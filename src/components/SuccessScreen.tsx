import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Unlock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function SuccessScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-return to home after timer expires
          setTimeout(() => navigate('/'), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4"
      style={{ backgroundColor: '#F1F8F4' }}
    >
      {/* Animated Background Circles */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '600px', height: '600px', backgroundColor: '#00C853', opacity: 0.1 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', backgroundColor: '#00C853', opacity: 0.15 }}
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <div 
            className="relative rounded-2xl p-10"
            style={{ backgroundColor: '#00C853' }}
          >
            <Check size={70} className="text-white" strokeWidth={4} />
            
            {/* Pulsing Ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ border: '4px solid #00C853' }}
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="mb-4" style={{ fontSize: '42px', fontWeight: '800', color: '#212121' }}>
            {t('Дверь открыта!', 'Есік ашылды!')}
          </h1>
          <p className="text-[#666666] mb-12" style={{ fontSize: '22px', lineHeight: '1.5' }}>
            {t('Приятного аппетита. Дверь закроется автоматически.', 'Дәмді болсын. Есік автоматты түрде жабылады.')}
          </p>
        </motion.div>

        {/* Timer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mb-12 rounded-3xl bg-white p-8"
          style={{
            boxShadow: '0px 20px 60px rgba(0,0,0,0.12)',
            maxWidth: '400px',
          }}
        >
          <div className="mb-4 flex justify-center">
            <Unlock size={38} style={{ color: '#00C853' }} />
          </div>
          <p className="text-[#666666] mb-4" style={{ fontSize: '16px' }}>
            {t('Дверь открыта ещё', 'Есік әлі ашық')}
          </p>
          <div 
            className="inline-block rounded-2xl px-8 py-4"
            style={{ backgroundColor: '#F1F8F4', border: '3px solid #00C853' }}
          >
            <p style={{ fontSize: '44px', fontWeight: '800', color: '#00C853' }}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </motion.div>

        
        {/* Back to Home */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-3 mx-auto rounded-2xl px-8 py-4 transition-colors hover:bg-white/50"
          style={{ color: '#666666', fontSize: '17px', fontWeight: '600' }}
        >
          <ArrowLeft size={20} />
          {t('Вернуться в меню', 'Менюға оралу')}
        </motion.button>
      </motion.div>

      {/* Auto-redirect Notice */}
      <div 
        className="absolute bottom-8 left-0 right-0 text-center text-[#666666]"
        style={{ fontSize: '14px' }}
      >
        {t('Автоматический возврат на главный экран...', 'Басты экранға автоматты оралу...')}
      </div>
    </div>
  );
}
