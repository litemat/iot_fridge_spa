import { QRCodeSVG } from 'qrcode.react'
import React from 'react'
import configData from '../data/appConfig.json'
import { usePaymentFlow } from '../hooks/usePaymentFlow'
import { AppConfig, CartItem } from '../types/payment'

interface PaymentModalProps {
	isOpen: boolean
	onClose: () => void
	cart: CartItem[]
}

// Приведение типа для конфига из JSON
const config = configData as unknown as AppConfig

const PaymentModal: React.FC<PaymentModalProps> = ({
	isOpen,
	onClose,
	cart,
}) => {
	const { status, qrData, errorMsg, startPayment, reset } =
		usePaymentFlow(config)

	// Если модалка закрыта, ничего не рендерим
	if (!isOpen) return null

	const totalAmount = cart.reduce((sum, item) => sum + item.price, 0)

	const handleClose = () => {
		reset()
		onClose()
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm'>
			<div className='bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center relative'>
				{/* Кнопка закрытия */}
				<button
					onClick={handleClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
				>
					✕
				</button>

				<h2 className='text-2xl font-bold mb-6 text-gray-800'>Оплата заказа</h2>

				{/* Состояние: Кнопка "Начать" или загрузка */}
				{status === 'IDLE' && (
					<div className='space-y-4'>
						<p className='text-gray-600'>
							К оплате:{' '}
							<span className='font-bold text-lg'>{totalAmount} ₸</span>
						</p>
						<button
							onClick={() => startPayment(cart)}
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all'
						>
							Оплатить через Kaspi QR
						</button>
					</div>
				)}

				{status === 'LOADING_QR' && (
					<div className='flex flex-col items-center py-10'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
						<p className='mt-4 text-gray-500'>Генерация QR-кода...</p>
					</div>
				)}

				{/* Состояние: Показ QR-кода */}
				{status === 'WAITING_PAYMENT' && qrData && (
					<div className='flex flex-col items-center animate-fade-in'>
						<div className='bg-white p-4 border-4 border-blue-50 rounded-xl mb-4'>
							<QRCodeSVG value={qrData} size={220} />
						</div>
						<p className='text-sm text-gray-500 mb-2'>
							Откройте приложение Kaspi.kz
						</p>
						<p className='text-lg font-semibold text-blue-600 animate-pulse'>
							Ожидание оплаты...
						</p>
					</div>
				)}

				{/* Состояние: Выдача товара */}
				{status === 'DISPENSING' && (
					<div className='py-10 text-center'>
						<div className='text-5xl mb-4'>📦</div>
						<p className='text-xl font-bold text-green-600'>Оплата принята!</p>
						<p className='text-gray-600 mt-2'>
							Пожалуйста, заберите ваш товар из лотка
						</p>
					</div>
				)}

				{/* Состояние: Успех */}
				{status === 'SUCCESS' && (
					<div className='py-10'>
						<div className='text-5xl mb-4'>✅</div>
						<p className='text-xl font-bold text-gray-800'>
							Приятного аппетита!
						</p>
						<button
							onClick={handleClose}
							className='mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg'
						>
							Закрыть
						</button>
					</div>
				)}

				{/* Состояние: Ошибка */}
				{status === 'ERROR' && (
					<div className='py-6'>
						<div className='text-5xl mb-4'>⚠️</div>
						<p className='text-red-600 font-bold'>Произошла ошибка</p>
						<p className='text-sm text-gray-500 mt-2'>{errorMsg}</p>
						<button
							onClick={() => startPayment(cart)}
							className='mt-6 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold'
						>
							Попробовать снова
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default PaymentModal
