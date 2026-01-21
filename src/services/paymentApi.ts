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
		const response = await axios.post<QrResponse>(
			'http://localhost:5000/api/get-qr',
			{
				items: items.map(item => ({
					id: item.id,
					trackno: item.trackNo,
					name: item.name,
					price: item.price,
					quantity: 1, // Бэкенд делает expandItems
				})),
			},
		)
		return response.data
	},

	// 2. Проверка статуса оплаты
	checkStatus: async (
		config: AppConfig,
		totalOrderId: string,
		torderid: string, // Добавляем torderid, он критичен для твоего бэкенда
	): Promise<PollResponse> => {
		// Обращаемся к локальному бэкенду GET /api/check-status/:orderId/:torderid
		const response = await axios.get<PollResponse>(
			`http://localhost:5000/api/check-status/${totalOrderId}/${torderid}`,
		)
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

		const response = await axios.post(
			'http://localhost:5000/api/report-shipping',
			body,
		)
		return response.data
	},
}
