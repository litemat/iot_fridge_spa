// security.ts
import SHA1 from 'crypto-js/sha1'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

// APP_KEY считывается из переменной окружения сборки
// В продакшене REACT_APP_LE_APP_KEY нужно задавать на этапе билда
const APP_KEY = process.env.REACT_APP_LE_APP_KEY || '1234567890abcdef'

export const generateSecurityParams = () => {
	const timestamp = dayjs().format('YYYYMMDDHHmmss')
	const randstr = uuidv4().replace(/-/g, '').substring(0, 16)

	// Лексикографическая сортировка: appkey, randstr, timestamp
	const paramsToSort = [APP_KEY, timestamp, randstr]
	paramsToSort.sort()

	const rawString = paramsToSort.join('')
	const sign = SHA1(rawString).toString()

	return { timestamp, randstr, sign }
}

export const formatPrice = (price: number): string => {
	return Math.floor(price * 100).toString() // Преобразование в тиыны (цена * 100)
}
