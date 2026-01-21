// CartContext.tsx
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'
import { Product } from '../types'

// Интерфейс товара в корзине
export interface CartItem {
	id: string
	name: string
	nameKz: string
	description: string
	descriptionKz: string
	price: number
	image: string
	quantity: number
	trackno: string // Номер ячейки
}

interface CartContextType {
	cart: CartItem[]
	addToCart: (product: Product, quantity?: number) => void
	updateQuantity: (id: string, delta: number) => void
	removeItem: (id: string) => void
	clearCart: () => void
	getCart: () => CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([])

	// Добавление товара в корзину
	const addToCart = useCallback((product: Product, quantity: number = 1) => {
		setCart(prev => {
			const existing = prev.find(item => item.id === product.id)
			if (existing) {
				// Если товар уже есть, увеличиваем количество
				return prev.map(item =>
					item.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item,
				)
			}
			// Добавляем новый товар
			return [
				...prev,
				{
					id: product.id,
					name: product.name,
					nameKz: product.nameKz,
					description: product.description,
					descriptionKz: product.descriptionKz,
					price: product.price,
					image: product.image,
					quantity,
					trackno: product.trackno,
				},
			]
		})
	}, [])

	// Изменение количества товара
	const updateQuantity = useCallback((id: string, delta: number) => {
		setCart(
			prev =>
				prev
					.map(item =>
						item.id === id
							? { ...item, quantity: Math.max(0, item.quantity + delta) }
							: item,
					)
					.filter(item => item.quantity > 0), // Удаляем товары с нулевым количеством
		)
	}, [])

	// Удаление товара из корзины
	const removeItem = useCallback((id: string) => {
		setCart(prev => prev.filter(item => item.id !== id))
	}, [])

	// Очистка корзины
	const clearCart = useCallback(() => {
		setCart([])
	}, [])

	// Получение корзины
	const getCart = useCallback(() => {
		return cart
	}, [cart])

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				updateQuantity,
				removeItem,
				clearCart,
				getCart,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

// Хук для использования контекста корзины
export function useCart() {
	const context = useContext(CartContext)
	if (!context) {
		throw new Error('useCart must be used within CartProvider')
	}
	return context
}
