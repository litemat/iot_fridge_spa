import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full bg-[#F5F5F7] p-1">
      <button
        onClick={() => setLanguage('ru')}
        className="rounded-full px-5 py-2 transition-all"
        style={{
          backgroundColor: language === 'ru' ? '#5E35B1' : 'transparent',
          color: language === 'ru' ? '#FFFFFF' : '#666666',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        RU
      </button>
      <button
        onClick={() => setLanguage('kz')}
        className="rounded-full px-5 py-2 transition-all"
        style={{
          backgroundColor: language === 'kz' ? '#5E35B1' : 'transparent',
          color: language === 'kz' ? '#FFFFFF' : '#666666',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        KZ
      </button>
    </div>
  );
}
