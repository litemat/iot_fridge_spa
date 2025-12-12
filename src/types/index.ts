export interface Product {
	id: string
	name: string
	nameKz: string
	description: string
	descriptionKz: string
	price: number
	image: string
	category: 'breakfast' | 'mains' | 'drinks'
	bestseller?: boolean
}

export interface CartItem extends Product {
	quantity: number
}
