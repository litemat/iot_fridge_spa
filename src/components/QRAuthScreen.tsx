import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Scan, Shield, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function QRAuthScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate scanning progress
    if (scanning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => navigate('/success'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [scanning, navigate]);

  const handleScanStart = () => {
    setScanning(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F5F5F7] overflow-hidden flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #5E35B1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 rounded-3xl bg-white p-10 lg:p-16 text-center"
        style={{
          boxShadow: '0px 20px 60px rgba(0,0,0,0.12)',
          maxWidth: '700px',
          width: '100%',
        }}
      >
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div 
            className="rounded-2xl p-8"
            style={{ backgroundColor: '#EDE7F6' }}
          >
            {scanning ? (
              <Scan size={60} style={{ color: '#5E35B1' }} />
            ) : (
              <Smartphone size={60} style={{ color: '#5E35B1' }} />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-4" style={{ fontSize: '32px', fontWeight: '800' }}>
          {scanning 
            ? t('Сканирование...', 'Сканерлеу...') 
            : t('Сканируйте для оплаты', 'Төлем үшін сканерлеңіз')
          }
        </h2>

        {/* Description */}
        <p className="text-[#666666] mb-12" style={{ fontSize: '18px', lineHeight: '1.6' }}>
          {scanning 
            ? t('Пожалуйста, подождите, идет проверка платежа', 'Күтіңіз, төлем тексерілуде')
            : t('Откройте приложение и отсканируйте Kaspi QR код для завершения оплаты', 'Қосымшаны ашып, төлемді аяқтау үшін Kaspi QR кодын сканерлеңіз')
          }
        </p>

        {/* QR Frame / Progress Ring */}
        <div className="mb-12 flex justify-center">
          <div className="relative" style={{ width: '280px', height: '280px' }}>
            {scanning ? (
              // Progress Ring
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E0E0E0"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#5E35B1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={282.7}
                  strokeDashoffset={282.7 - (282.7 * progress) / 100}
                  style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy="0.3em"
                  style={{ fontSize: '24px', fontWeight: '800', fill: '#5E35B1' }}
                >
                  {Math.round(progress)}%
                </text>
              </svg>
            ) : (
              // QR Scanner Frame
              <div 
                className="flex items-center justify-center rounded-2xl border-4"
                style={{ 
                  borderColor: '#5E35B1',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#FAFAFA',
                }}
              >
                {/* Kaspi Logo Placeholder */}
                <div className="text-center">
                  <p style={{ fontSize: '48px', fontWeight: '800', color: '#5E35B1' }}>
                    Kaspi
                  </p>
                  <p className="text-[#666666]" style={{ fontSize: '14px' }}>
                    QR
                  </p>
                </div>
                
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 rounded-tl-2xl" style={{ borderColor: '#5E35B1' }} />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 rounded-tr-2xl" style={{ borderColor: '#5E35B1' }} />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 rounded-bl-2xl" style={{ borderColor: '#5E35B1' }} />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 rounded-br-2xl" style={{ borderColor: '#5E35B1' }} />
                
                {/* Animated Scan Line */}
                <motion.div
                  className="absolute left-4 right-4 h-1 rounded-full"
                  style={{ backgroundColor: '#5E35B1', opacity: 0.5 }}
                  animate={{ y: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!scanning ? (
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-2xl px-12 py-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              minHeight: '64px',
            }}
          >
            {t('Вернуться', 'Оралу')}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-[#666666]" style={{ fontSize: '17px' }}>
              <Shield size={22} style={{ color: '#5E35B1' }} />
              {t('Защищённое соединение', 'Қорғалған байланыс')}
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="w-full flex items-center justify-center gap-2 rounded-2xl px-12 py-3 transition-colors"
              style={{
                backgroundColor: '#F5F5F5',
                color: '#666666',
                fontSize: '16px',
                fontWeight: '600',
                border: '1px solid #E0E0E0'
              }}
            >
              <X size={20} />
              {t('Отмена платежа', 'Төлемді болдырмау')}
            </button>
          </div>
        )}
      </motion.div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-[#666666]" style={{ fontSize: '15px' }}>
        <p>{t('Платёж обрабатывается безопасно через ваше приложение', 'Төлем қосымша арқылы қауіпсіз өңделеді')}</p>
      </div>
    </div>
  );
}
