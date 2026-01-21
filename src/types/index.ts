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
	trackno: string // Номер ячейки в холодильнике (например, "01", "02")
}

export interface CartItem extends Product {
	quantity: number
}
