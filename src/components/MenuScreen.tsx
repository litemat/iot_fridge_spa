import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import { Product, CartItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { ProductDetailModal } from './ProductDetailModal';

export function MenuScreen() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'breakfast' | 'mains' | 'drinks'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all' as const, label: t('Все', 'Барлығы') },
    { id: 'breakfast' as const, label: t('Завтраки', 'Таңғы ас') },
    { id: 'mains' as const, label: t('Обеды', 'Түскі ас') },
    { id: 'drinks' as const, label: t('Напитки', 'Сусындар') },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (totalItems > 0) {
      navigate('/cart', { state: { cart } });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 lg:px-12 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#5E35B1' }}>
            MicroMarket
          </h2>
          <LanguageToggle />
        </div>

        {/* Cart Banner */}
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl p-5 lg:p-6 flex items-center justify-between cursor-pointer"
            style={{ backgroundColor: '#5E35B1' }}
            onClick={handleCheckout}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div>
                <p className="text-white" style={{ fontSize: '18px', fontWeight: '700' }}>
                  {t('Корзина', 'Себет')} • {totalItems} {t('шт.', 'дана')}
                </p>
                <p className="text-white/80" style={{ fontSize: '15px' }}>
                  {t('Итого', 'Барлығы')}: {totalPrice.toLocaleString()} ₸
                </p>
              </div>
            </div>
            <div className="rounded-xl px-6 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <span className="text-white font-bold text-lg">
                {t('Перейти к оплате', 'Төлемге өту')}
              </span>
            </div>
          </motion.div>
        )}

        {/* Category Tabs - Horizontal Swipeable */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center rounded-full bg-white shadow-lg p-2"
            style={{ border: '1px solid #E0E0E0' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center rounded-full bg-white shadow-lg p-2"
            style={{ border: '1px solid #E0E0E0' }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto hide-scrollbar pb-2"
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="flex-shrink-0 rounded-xl px-6 lg:px-8 py-3 transition-all"
                style={{
                  backgroundColor: activeCategory === category.id ? '#5E35B1' : '#F5F5F7',
                  color: activeCategory === category.id ? '#FFFFFF' : '#666666',
                  fontSize: '17px',
                  fontWeight: '600',
                  minHeight: '50px',
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 lg:px-12 py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl bg-white p-5 transition-all hover:shadow-xl cursor-pointer"
              style={{
                boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
              }}
              onClick={() => setSelectedProduct(product)}
            >
              
              {/* Product Image */}
              <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={product.image}
                  alt={language === 'ru' ? product.name : product.nameKz}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <h3 className="mb-2" style={{ fontSize: '19px', fontWeight: '700' }}>
                  {language === 'ru' ? product.name : product.nameKz}
                </h3>
                <p className="text-[#666666]" style={{ fontSize: '14px' }}>
                  {language === 'ru' ? product.description : product.descriptionKz}
                </p>
              </div>

              {/* Price and Add Button */}
              <div className="flex items-center justify-between">
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#5E35B1' }}>
                  {product.price.toLocaleString()} ₸
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="rounded-full p-3 transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: '#5E35B1' }}
                >
                  <Plus className="text-white" size={22} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(quantity) => {
            addToCart(selectedProduct, quantity);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
