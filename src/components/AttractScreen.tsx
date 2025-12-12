import { motion } from 'framer-motion'
import { ChevronRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export function AttractScreen() {
	const navigate = useNavigate()
	const { t } = useLanguage()

	return (
		<div className='relative h-screen w-full overflow-hidden bg-white'>
			{/* Hero Image Section */}
			<div className='absolute inset-0'>
				<img
					src='https://images.unsplash.com/photo-1687978975635-c20d06724c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzY0NDg2NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080'
					alt='Fresh breakfast'
					className='h-full w-full object-cover'
				/>
				{/* Gradient Overlay */}
				<div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
			</div>

			{/* Content */}
			<div className='relative z-10 flex h-full items-center px-16 lg:px-24'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='max-w-2xl'
				>
					{/* Bilingual Greeting */}
					<div className='mb-8'>
						<h1
							className='mb-2 text-white'
							style={{ fontSize: '52px', lineHeight: '1.1' }}
						>
							{t('Вкусно. Быстро.', 'Дәмді. Тез.')}
						</h1>
						<p
							className='text-white/90'
							style={{ fontSize: '24px', lineHeight: '1.3' }}
						>
							{t(
								'Свежая еда и напитки. Доступно 24/7.',
								'Жаңа тағам және сусындар. 24/7 қол жетімді.'
							)}
						</p>
					</div>

					{/* Main CTA and 24/7 Badge Row */}
					<div className='flex items-center gap-4 flex-wrap'>
						<motion.button
							onClick={() => navigate('/menu')}
							className='group relative overflow-hidden rounded-2xl px-14 py-5 shadow-2xl'
							style={{
								backgroundColor: '#5E35B1',
								minHeight: '70px',
								fontSize: '22px',
								fontWeight: '700',
							}}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							animate={{
								boxShadow: [
									'0 0 0 0 rgba(94, 53, 177, 0.4)',
									'0 0 0 20px rgba(94, 53, 177, 0)',
								],
							}}
							transition={{
								boxShadow: {
									duration: 2,
									repeat: Infinity,
									ease: 'easeOut',
								},
							}}
						>
							<div className='flex items-center justify-center gap-3 text-white'>
								{t('Открыть', 'Ашу')}
								<ChevronRight
									className='transition-transform group-hover:translate-x-2'
									size={26}
								/>
							</div>
						</motion.button>

						{/* 24/7 Badge */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className='inline-flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-md px-6'
							style={{
								height: '70px',
							}}
						>
							<Clock className='text-white' size={24} />
							<span
								className='text-white'
								style={{ fontSize: '18px', fontWeight: '600' }}
							>
								{t('Работает круглосуточно', 'Тәулік бойы жұмыс істейді')}
							</span>
						</motion.div>
					</div>
				</motion.div>
			</div>

			{/* Bottom Info Bar */}
			<div className='absolute bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm px-8 lg:px-24 py-6'>
				<div className='flex flex-wrap items-center justify-between gap-6'>
					<div className='flex gap-8 lg:gap-12'>
						<div>
							<p className='text-[#666666]' style={{ fontSize: '14px' }}>
								{t('Режим работы', 'Жұмыс режимі')}
							</p>
							<p style={{ fontSize: '17px', fontWeight: '600' }}>24/7</p>
						</div>
						<div>
							<p className='text-[#666666]' style={{ fontSize: '14px' }}>
								{t('Оплата', 'Төлем')}
							</p>
							<p style={{ fontSize: '17px', fontWeight: '600' }}>
								Kaspi | Halyk
							</p>
						</div>
						<div>
							<p className='text-[#666666]' style={{ fontSize: '14px' }}>
								{t('Среднее время', 'Орташа уақыт')}
							</p>
							<p style={{ fontSize: '17px', fontWeight: '600' }}>
								{t('До 2 минут', '2 минутқа дейін')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
