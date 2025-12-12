import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full bg-[#F5F5F7] p-3 transition-colors hover:bg-gray-200"
          >
            <X size={24} />
          </button>

          {/* Product Image */}
          <div className="mb-6 aspect-video overflow-hidden rounded-2xl bg-gray-50">
            <img
              src={product.image}
              alt={language === 'ru' ? product.name : product.nameKz}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <h2 className="mb-3" style={{ fontSize: '32px', fontWeight: '800' }}>
              {language === 'ru' ? product.name : product.nameKz}
            </h2>
            <p className="text-[#666666] mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>
              {language === 'ru' ? product.description : product.descriptionKz}
            </p>
            <p style={{ fontSize: '36px', fontWeight: '800', color: '#5E35B1' }}>
              {product.price.toLocaleString()} ₸
            </p>
          </div>

          {/* Quantity Stepper */}
          <div className="mb-8">
            <p className="mb-3 text-[#666666]" style={{ fontSize: '16px' }}>
              {t('Количество', 'Саны')}
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-2xl p-5 transition-all disabled:opacity-30"
                style={{ 
                  minWidth: '64px', 
                  minHeight: '64px', 
                  border: '3px solid #E0E0E0',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <Minus size={28} />
              </button>
              <span style={{ fontSize: '40px', fontWeight: '800', minWidth: '60px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-2xl p-5 transition-all"
                style={{ 
                  minWidth: '64px', 
                  minHeight: '64px', 
                  backgroundColor: '#5E35B1',
                  color: 'white'
                }}
              >
                <Plus size={28} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full rounded-2xl py-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: '#5E35B1',
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              minHeight: '64px',
            }}
          >
            {t('Добавить в корзину', 'Себетке қосу')} • {(product.price * quantity).toLocaleString()} ₸
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
