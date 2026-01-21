import axios from 'axios'
import { AppConfig, CartItem, PollResponse, QrResponse } from '../types/payment'

export const paymentApi = {
	// 1. Получение QR кода
	getQrCode: async (
		config: AppConfig,
		items: CartItem[],
		totalOrderId: string,
	): Promise<QrResponse> => {
		// Отправляем на локальный бэкенд POST /api/get-qr
		const response = await axios.post<QrResponse>(config.gettwocodeurl, {
			items: items.map(item => ({
				id: item.id,
				trackno: item.trackNo,
				name: item.name,
				price: item.price,
				quantity: 1, // Бэкенд делает expandItems
			})),
		})
		return response.data
	},

	// 2. Проверка статуса оплаты
	checkStatus: async (
		config: AppConfig,
		totalOrderId: string,
		torderid: string, // Добавляем torderid, он критичен для твоего бэкенда
	): Promise<PollResponse> => {
		// Обращаемся к локальному бэкенду POST /api/check-status
		const response = await axios.post<PollResponse>(config.looppayurl, {
			orderid: totalOrderId,
			torderid: torderid,
		})
		return response.data
	},

	// 3. Отчет о выдаче
	reportItemDispense: async (
		config: AppConfig,
		subOrderId: string,
		tOrderId: string,
		trackNo: string,
		success: boolean,
	) => {
		// Отправляем на локальный бэкенд POST /api/report-shipping
		const body = {
			items: [
				{
					subOrderId,
					tOrderId,
					trackNo,
					success,
					error: success ? '' : 'Dispense Error',
				},
			],
		}

		const response = await axios.post(config.salereporturl, body)
		return response.data
	},
}
