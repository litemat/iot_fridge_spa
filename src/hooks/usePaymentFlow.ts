// usePaymentFlow.ts
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { paymentApi } from '../services/paymentApi'
import { AppConfig, CartItem } from '../types/payment'

// Обычно это localhost на порту, где крутится Python/Node скрипт
const HARDWARE_API_URL = 'http://localhost:5000/api/dispense'

type PaymentState =
	| 'IDLE'
	| 'LOADING_QR'
	| 'WAITING_PAYMENT'
	| 'DISPENSING'
	| 'SUCCESS'
	| 'ERROR'

export const usePaymentFlow = (config: AppConfig) => {
	const [status, setStatus] = useState<PaymentState>('IDLE')
	const [qrData, setQrData] = useState<string | null>(null)
	const [errorMsg, setErrorMsg] = useState<string>('')

	// Храним данные текущей сессии
	const sessionData = useRef({
		totalOrderId: '',
		tOrderId: '', // ID от оператора (Kaspi)
		items: [] as CartItem[],
		subOrderMap: {} as Record<number, string>, // map: index -> subOrderId
	})

	const pollTimer = useRef<NodeJS.Timeout | null>(null)

	// 1. Старт процесса
	const startPayment = async (items: CartItem[]) => {
		try {
			setStatus('LOADING_QR')
			sessionData.current.items = items

			// Генерируем ID заказа
			const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14)
			const uniqueSuffix = uuidv4().split('-')[0]
			const totalOrderId = `ORD${timestamp}${uniqueSuffix}` // макс 60 символов
			sessionData.current.totalOrderId = totalOrderId

			// Мапим subOrderIds для будущего отчета (используем индекс, т.к. trackNo может повторяться)
			items.forEach((item, index) => {
				sessionData.current.subOrderMap[index] = `${totalOrderId}_${index}`
			})

			// Запрос QR
			const res = await paymentApi.getQrCode(config, items, totalOrderId)

			if (res.code === '1') {
				setQrData(res.twocode)
				sessionData.current.tOrderId = res.torderid

				const effectiveOrderId =
					res.orderid || res.totalorderid || sessionData.current.totalOrderId
				sessionData.current.totalOrderId = effectiveOrderId

				if (Array.isArray(res.subOrderIds) && res.subOrderIds.length > 0) {
					res.subOrderIds.forEach((subId, index) => {
						sessionData.current.subOrderMap[index] = subId
					})
				}

				setStatus('WAITING_PAYMENT')
				startPolling(effectiveOrderId)
			} else {
				throw new Error(res.msg || 'Ошибка получения QR')
			}
		} catch (e: any) {
			setStatus('ERROR')
			setErrorMsg(e.message)
		}
	}

	// 2. Опрос статуса (Polling)
	const startPolling = (orderId: string) => {
		// Опрашиваем каждые 3 секунды
		pollTimer.current = setInterval(async () => {
			try {
				// ДОБАВЛЯЕМ ТРЕТИЙ АРГУМЕНТ: sessionData.current.tOrderId
				const res = await paymentApi.checkStatus(
					config,
					orderId,
					sessionData.current.tOrderId,
				)

				if (res.code === '1') {
					// Оплата прошла успешно
					stopPolling()
					setStatus('DISPENSING')
					handleDispense()
				} else if (res.code === '3' || res.code === '4') {
					// Таймаут или отмена
					stopPolling()
					setStatus('ERROR')
					setErrorMsg('Время оплаты истекло')
				}
				// code "2" = ожидание, продолжаем опрос
			} catch (e) {
				console.error('Polling error', e)
			}
		}, 3000)
	}

	const stopPolling = () => {
		if (pollTimer.current) clearInterval(pollTimer.current)
	}

	// 3. Выдача товара (Интеграция с локальным IoT контроллером)
	const handleDispense = async () => {
		const { items, tOrderId, subOrderMap } = sessionData.current

		for (let index = 0; index < items.length; index++) {
			const item = items[index]
			try {
				// Отправляем команду на "железо" (GitLab repo logic)
				// Предполагаем, что локальный API принимает trackNo
				await axios.post(HARDWARE_API_URL, {
					trackNo: item.trackNo,
				})

				// Если железо не вернуло ошибку -> Отчет об успехе в LE API
				const subOrderId = subOrderMap[index]
				await paymentApi.reportItemDispense(
					config,
					subOrderId,
					tOrderId,
					item.trackNo,
					true,
				)
			} catch (hwError) {
				console.error(`Ошибка выдачи ячейки ${item.trackNo}`, hwError)
				// Отчет об ошибке в LE API
				const subOrderId = subOrderMap[index]
				await paymentApi.reportItemDispense(
					config,
					subOrderId,
					tOrderId,
					item.trackNo,
					false,
				)
			}
		}

		setStatus('SUCCESS')
	}

	// Очистка таймера при размонтировании
	useEffect(() => {
		return () => stopPolling()
	}, [])

	return {
		status,
		qrData,
		errorMsg,
		startPayment,
		reset: () => setStatus('IDLE'),
	}
}
