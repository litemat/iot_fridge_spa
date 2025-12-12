import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ArrowLeft, ChevronRight, Trash2, MoveLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { products } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

export function CartScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>(location.state?.cart || []);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Cross-sell drinks
  const crossSellDrinks = products.filter(p => 
    p.category === 'drinks' && !cart.some(item => item.id === p.id)
  ).slice(0, 3);

  const handleCheckout = () => {
    navigate('/qr-auth');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F5F5F7] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 lg:px-12 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => navigate('/menu')}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={26} />
            </button>
            <h2 style={{ fontSize: '28px', fontWeight: '800' }}>
              {t('Корзина', 'Себет')}
            </h2>
          </div>
          <p className="text-[#666666]" style={{ fontSize: '17px' }}>
            {cart.length} {t('товаров', 'тауар')}
          </p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 lg:px-12 py-6 lg:py-8">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <p className="text-[#666666] mb-6" style={{ fontSize: '20px' }}>
              {t('Корзина пуста', 'Себет бос')}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="rounded-2xl px-8 py-4"
              style={{ backgroundColor: '#5E35B1', color: 'white', fontSize: '18px', fontWeight: '600' }}
            >
              {t('Вернуться к меню', 'Мәзірге оралу')}
            </button>
          </div>
        ) : (
          <>
            {/* Swipe Hint */}
            <div className="mb-4 flex items-center gap-2 text-[#666666]" style={{ fontSize: '14px' }}>
              <MoveLeft size={18} />
              <span>{t('Проведите влево для удаления', 'Жою үшін солға сүйреңіз')}</span>
            </div>

            <div className="space-y-5">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative"
                  >
                    {/* Delete Button (Swipe Target) */}
                    <motion.button
                      onClick={() => removeItem(item.id)}
                      className="absolute right-0 top-0 bottom-0 rounded-2xl px-6 flex items-center justify-center"
                      style={{ backgroundColor: '#EF5350', width: '100px' }}
                      whileHover={{ width: '120px' }}
                    >
                      <Trash2 className="text-white" size={24} />
                    </motion.button>

                    {/* Cart Item Card */}
                    <motion.div
                      className="relative flex items-center gap-4 lg:gap-6 rounded-2xl bg-white p-4 lg:p-6"
                      style={{ boxShadow: '0px 6px 20px rgba(0,0,0,0.08)' }}
                      drag="x"
                      dragConstraints={{ left: -100, right: 0 }}
                      dragElastic={0.2}
                    >
                      {/* Thumbnail */}
                      <div className="h-24 w-24 lg:h-28 lg:w-28 overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={language === 'ru' ? item.name : item.nameKz}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1" style={{ fontSize: '19px', fontWeight: '700' }}>
                          {language === 'ru' ? item.name : item.nameKz}
                        </h3>
                        <p className="text-[#666666] truncate" style={{ fontSize: '15px' }}>
                          {language === 'ru' ? item.description : item.descriptionKz}
                        </p>
                      </div>

                      {/* Quantity Controls - Desktop */}
                      <div className="hidden lg:flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded-xl p-3 transition-all hover:bg-gray-100"
                          style={{ minWidth: '48px', minHeight: '48px', border: '2px solid #E0E0E0' }}
                        >
                          <Minus size={20} />
                        </button>
                        <span style={{ fontSize: '24px', fontWeight: '700', minWidth: '35px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded-xl p-3 transition-all"
                          style={{ 
                            minWidth: '48px', 
                            minHeight: '48px', 
                            backgroundColor: '#5E35B1',
                            color: 'white',
                          }}
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="hidden lg:block" style={{ fontSize: '24px', fontWeight: '800', color: '#5E35B1', minWidth: '120px', textAlign: 'right' }}>
                        {(item.price * item.quantity).toLocaleString()} ₸
                      </p>

                      {/* Mobile: Quantity and Price */}
                      <div className="lg:hidden flex flex-col items-end gap-2">
                        <p style={{ fontSize: '20px', fontWeight: '800', color: '#5E35B1' }}>
                          {(item.price * item.quantity).toLocaleString()} ₸
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="rounded-lg p-2"
                            style={{ border: '2px solid #E0E0E0' }}
                          >
                            <Minus size={16} />
                          </button>
                          <span style={{ fontSize: '18px', fontWeight: '700', minWidth: '25px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded-lg p-2"
                            style={{ backgroundColor: '#5E35B1', color: 'white' }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cross-sell Section */}
            {crossSellDrinks.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-5" style={{ fontSize: '22px', fontWeight: '700' }}>
                  {t('Не забудьте напиток', 'Сусынды ұмытпаңыз')}
                </h3>
                <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
                  {crossSellDrinks.map(drink => (
                    <div
                      key={drink.id}
                      className="flex-shrink-0 w-56 rounded-2xl bg-white p-5 cursor-pointer transition-all hover:shadow-xl"
                      style={{ boxShadow: '0px 6px 20px rgba(0,0,0,0.08)' }}
                      onClick={() => {
                        setCart(prev => [...prev, { ...drink, quantity: 1 }]);
                      }}
                    >
                      <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-gray-50">
                        <img
                          src={drink.image}
                          alt={language === 'ru' ? drink.name : drink.nameKz}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h4 className="mb-2" style={{ fontSize: '17px', fontWeight: '700' }}>
                        {language === 'ru' ? drink.name : drink.nameKz}
                      </h4>
                      <p style={{ fontSize: '19px', fontWeight: '800', color: '#5E35B1' }}>
                        {drink.price.toLocaleString()} ₸
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="bg-white px-6 lg:px-12 py-6 border-t border-gray-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[#666666]" style={{ fontSize: '15px' }}>
                {t('Итого', 'Барлығы')}
              </p>
              <p style={{ fontSize: '36px', fontWeight: '800', color: '#212121' }}>
                {totalPrice.toLocaleString()} ₸
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full lg:w-auto group flex items-center justify-center gap-4 rounded-2xl px-10 py-5 transition-all"
              style={{
                backgroundColor: '#5E35B1',
                minHeight: '64px',
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
              }}
            >
              {t('Оплатить', 'Төлеу')} • {totalPrice.toLocaleString()} ₸
              <ChevronRight className="transition-transform group-hover:translate-x-2" size={26} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
