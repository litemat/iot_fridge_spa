import { createBrowserRouter } from 'react-router-dom'
import { CartScreen } from '../components/CartScreen'
import { MenuScreen } from '../components/MenuScreen'
import { QRAuthScreen } from '../components/QRAuthScreen'
import { SuccessScreen } from '../components/SuccessScreen'
import { FiscalizedScreen } from '../components/FiscalizedScreen'

export const router = createBrowserRouter([
	{
		path: '/',
		Component: MenuScreen,
	},
	{
		path: '/cart',
		Component: CartScreen,
	},
	{
		path: '/qr-auth',
		Component: QRAuthScreen,
	},
	{
		path: '/success',
		Component: SuccessScreen,
	},
	{
		path: '/fiscalized',
		Component: FiscalizedScreen,
	},
])
