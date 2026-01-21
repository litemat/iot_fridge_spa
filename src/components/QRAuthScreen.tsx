import { motion } from 'framer-motion'
import { Loader2, Shield, Smartphone, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { usePaymentFlow } from '../hooks/usePaymentFlow'
import { AppConfig, CartItem as PaymentCartItem } from '../types/payment'

const VENDING_CONFIG: AppConfig = {
	deviceid: '00000000009',
	companyshh: '20251210',
	paycompany: 'vid.company(13979)',
	code: '36', // Исправил на 36, как в твоем бэкенде (CHANNEL_ID)

	// ИСПРАВЛЕННЫЕ ПУТИ (теперь они соответствуют твоему server.js):
	gettwocodeurl: 'http://localhost:5000/api/get-qr',
	looppayurl: 'http://localhost:5000/api/check-status',
	salereporturl: 'http://localhost:5000/api/report-shipping',
}

export function QRAuthScreen() {
	const navigate = useNavigate()
	const { t } = useLanguage()
	const { cart, clearCart } = useCart()
	const startedRef = useRef(false)

	// ТЕПЕРЬ ОШИБКИ НЕТ, ТАК КАК ПЕРЕДАН VENDING_CONFIG
	const { status, qrData, errorMsg, startPayment } =
		usePaymentFlow(VENDING_CONFIG)

	const transformedCart = useMemo<PaymentCartItem[]>(() => {
		const result: PaymentCartItem[] = []
		cart.forEach(item => {
			for (let i = 0; i < item.quantity; i++) {
				result.push({
					id: item.id,
					trackNo: item.trackno,
					name: item.name,
					price: item.price,
				})
			}
		})
		return result
	}, [cart])

	useEffect(() => {
		if (startedRef.current) return
		if (transformedCart.length > 0) {
			startedRef.current = true
			startPayment(transformedCart)
		} else {
			navigate('/cart')
		}
	}, [navigate, startPayment, transformedCart])

	useEffect(() => {
		if (status === 'SUCCESS') {
			clearCart()
			const timer = setTimeout(() => navigate('/success'), 1000)
			return () => clearTimeout(timer)
		}
	}, [status, navigate, clearCart])

	return (
		<div className='relative min-h-screen w-full bg-[#F5F5F7] overflow-hidden flex items-center justify-center p-4'>
			<div className='absolute inset-0 opacity-5'>
				<div
					className='absolute inset-0'
					style={{
						backgroundImage:
							'radial-gradient(circle, #5E35B1 1px, transparent 1px)',
						backgroundSize: '40px 40px',
					}}
				/>
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className='relative z-10 rounded-3xl bg-white p-10 lg:p-16 text-center'
				style={{
					boxShadow: '0px 20px 60px rgba(0,0,0,0.12)',
					maxWidth: '700px',
					width: '100%',
				}}
			>
				<div className='mb-8 flex justify-center'>
					<div
						className='rounded-2xl p-8'
						style={{ backgroundColor: '#EDE7F6' }}
					>
						{status === 'SUCCESS' || status === 'DISPENSING' ? (
							<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
								✅
							</motion.div>
						) : (
							<Smartphone size={60} style={{ color: '#5E35B1' }} />
						)}
					</div>
				</div>

				<h2 className='mb-4' style={{ fontSize: '32px', fontWeight: '800' }}>
					{status === 'LOADING_QR' && t('Загрузка...', 'Жүктеу...')}
					{status === 'WAITING_PAYMENT' &&
						t('Сканируйте для оплаты', 'Төлем үшін сканерлеңіз')}
					{status === 'DISPENSING' && t('Оплата прошла!', 'Төлем сәтті!')}
					{status === 'ERROR' && t('Ошибка оплаты', 'Төлем қатесі')}
				</h2>

				<p
					className='text-[#666666] mb-12'
					style={{ fontSize: '18px', lineHeight: '1.6' }}
				>
					{status === 'LOADING_QR' &&
						t('Получаем QR-код от Kaspi...', 'Kaspi-ден QR-код алу...')}
					{status === 'WAITING_PAYMENT' &&
						t(
							'Откройте приложение Kaspi.kz и отсканируйте код',
							'Kaspi.kz қосымшасын ашып, кодты сканерлеңіз',
						)}
					{status === 'DISPENSING' &&
						t('Пожалуйста, заберите ваш товар', 'Тауарыңызды алыңыз')}
					{status === 'ERROR' &&
						(errorMsg || t('Попробуйте еще раз', 'Қайтадан байқап көріңіз'))}
				</p>

				<div className='mb-12 flex justify-center'>
					<div
						className='relative flex items-center justify-center'
						style={{ width: '280px', height: '280px' }}
					>
						{status === 'LOADING_QR' && (
							<Loader2 className='animate-spin' size={48} color='#5E35B1' />
						)}
						{status === 'WAITING_PAYMENT' && qrData && (
							<div
								className='relative p-4 bg-white rounded-2xl border-4'
								style={{ borderColor: '#5E35B1' }}
							>
								<QRCodeSVG value={qrData} size={240} />
								<motion.div
									className='absolute left-2 right-2 h-1 rounded-full'
									style={{ backgroundColor: '#5E35B1', opacity: 0.4 }}
									animate={{ y: [0, 240] }}
									transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
								/>
							</div>
						)}
						{status === 'DISPENSING' && (
							<div className='text-6xl animate-bounce'>📦</div>
						)}
						{status === 'ERROR' && (
							<div className='text-red-500 font-bold'>
								<X size={64} className='mx-auto mb-2' />
								<button
									onClick={() => startPayment(transformedCart)}
									className='underline'
								>
									{t('Повторить', 'Қайталау')}
								</button>
							</div>
						)}
					</div>
				</div>

				<div className='space-y-4'>
					<div
						className='flex items-center justify-center gap-3 text-[#666666]'
						style={{ fontSize: '17px' }}
					>
						<Shield size={22} style={{ color: '#5E35B1' }} />
						{t('Защищённое соединение', 'Қорғалған байланыс')}
					</div>
					<button
						onClick={() => navigate('/cart')}
						className='w-full flex items-center justify-center gap-2 rounded-2xl px-12 py-3'
						style={{
							backgroundColor: '#F5F5F5',
							color: '#666666',
							fontWeight: '600',
							border: '1px solid #E0E0E0',
						}}
					>
						<X size={20} />
						{t('Отмена платежа', 'Төлемді болдырмау')}
					</button>
				</div>
			</motion.div>
		</div>
	)
}
