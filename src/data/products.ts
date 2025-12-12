import { Product } from '../types'

export const products: Product[] = [
	{
		id: '1',
		name: 'Сливочный круассан',
		nameKz: 'Кремді круассан',
		description: 'Свежевыпеченный, слоёный и маслянистый',
		descriptionKz: 'Жаңа пісірілген, қабатты және майлы',
		price: 850,
		image:
			'https://images.unsplash.com/photo-1687978975635-c20d06724c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBjb2ZmZWUlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzY0NDg2NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'breakfast',
		bestseller: true,
	},
	{
		id: '2',
		name: 'Греческий йогурт',
		nameKz: 'Грек йогурты',
		description: 'С гранолой и свежими ягодами',
		descriptionKz: 'Гранола және жаңа жидектермен',
		price: 1200,
		image:
			'https://images.unsplash.com/photo-1571230389215-b34a89739ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBwYXJmYWl0fGVufDF8fHx8MTc2NDQ1MzA5OXww&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'breakfast',
	},
	{
		id: '3',
		name: 'Шоколадный маффин',
		nameKz: 'Шоколадты маффин',
		description: 'С двойным шоколадом',
		descriptionKz: 'Қос шоколадпен',
		price: 950,
		image:
			'https://images.unsplash.com/photo-1611614010348-7df489604fe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBtdWZmaW58ZW58MXx8fHwxNzY0NDg2NDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'breakfast',
	},
	{
		id: '4',
		name: 'Сэндвич с курицей',
		nameKz: 'Тауық сэндвичі',
		description: 'Свежая курица, авокадо, салат на хлебе',
		descriptionKz: 'Жаңа тауық, авокадо, көкөніс нанда',
		price: 1850,
		image:
			'https://images.unsplash.com/photo-1600405884662-fe2eb608a3ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbmR3aWNoJTIwc3R1ZGlvfGVufDF8fHx8MTc2NDQ4NjQwMnww&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'mains',
		bestseller: true,
	},
	{
		id: '5',
		name: 'Салат Цезарь',
		nameKz: 'Цезарь салаты',
		description: 'Романо, пармезан, гренки, соус',
		descriptionKz: 'Романо, пармезан, сухарики, соус',
		price: 2100,
		image:
			'https://images.unsplash.com/photo-1574926054530-540288c8e678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzY0NDg2NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'mains',
	},
	{
		id: '6',
		name: 'Колд брю',
		nameKz: 'Колд брю',
		description: 'Мягкий, насыщенный, без горечи',
		descriptionKz: 'Жұмсақ, қанық, ащысыз',
		price: 1100,
		image:
			'https://images.unsplash.com/photo-1561641377-f7456d23aa9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMGNvZmZlZXxlbnwxfHx8fDE3NjQ0MzQ4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'drinks',
	},
	{
		id: '7',
		name: 'Апельсиновый сок',
		nameKz: 'Апельсин шырыны',
		description: 'Свежевыжатый, 100% натуральный',
		descriptionKz: 'Жаңа сығылған, 100% натуралды',
		price: 1300,
		image:
			'https://images.unsplash.com/photo-1641659735894-45046caad624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZSUyMGdsYXNzfGVufDF8fHx8MTc2NDQ4NDA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'drinks',
	},
	{
		id: '8',
		name: 'Протеиновый смузи',
		nameKz: 'Протеин смузи',
		description: 'Банан, ягоды, протеин',
		descriptionKz: 'Банан, жидектер, протеин',
		price: 1650,
		image:
			'https://images.unsplash.com/photo-1587501578729-2d1b41255ce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwc21vb3RoaWV8ZW58MXx8fHwxNzY0NDg2NDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
		category: 'drinks',
	},
]
