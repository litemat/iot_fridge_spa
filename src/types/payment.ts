// payment.ts

// Конфигурация из файла JSON
export interface AppConfig {
	code: string
	deviceid: string // machid
	companyshh: string
	gettwocodeurl: string // URL для получения QR
	looppayurl: string // URL для проверки статуса
	salereporturl: string // URL для отчета о выдаче
	paycompany: string
}

// Структура товара в корзине (для внутреннего использования в React)
export interface CartItem {
	id: string // Внутренний ID
	trackNo: string // Номер ячейки (критично для выдачи)
	name: string
	price: number // Цена в обычной валюте (не в тиынах)
}

// Структура goodsinfo для API V2 [cite: 56]
export interface ApiGoodsInfo {
	orderid: string // Sub-order ID
	trackno: string
	name: string
	price: string // Цена * 100
	machid: string
}

// Ответ от API получения QR [cite: 59]
export interface QrResponse {
	code: string // "1" - успех
	msg: string
	twocode: string // Данные для QR
	orderid: string // totalorderid
	totalorderid?: string
	torderid: string // ID на стороне оператора
	subOrderIds?: string[]
}

// Ответ от проверки статуса [cite: 104]
export interface PollResponse {
	code: string // "1" - успех, "2" - ожидание, "3" - таймаут
	msg: string
	orderid: string
	torderid: string
}
