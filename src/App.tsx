import { RouterProvider } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { router } from './utils/routes'

export default function App() {
	return (
		<LanguageProvider>
			<CartProvider>
				<RouterProvider router={router} />
			</CartProvider>
		</LanguageProvider>
	)
}
