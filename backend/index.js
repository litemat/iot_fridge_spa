import axios from 'axios'
import cors from 'cors'
import crypto from 'crypto'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'

// Load environment variables from backend/.env
dotenv.config()

const app = express()

// Disable X-Powered-By header for security
app.disable('x-powered-by')

const PORT = Number(process.env.PORT || 5000)
const APP_KEY = process.env.APP_KEY || ''
const CALLBACK_DOMAIN = process.env.CALLBACK_DOMAIN || 'http://localhost:5000'

const PRICE_MULTIPLIER = Number(process.env.PRICE_MULTIPLIER || 100)

// Рабочие параметры как в Postman
const MACH_ID = process.env.MACH_ID || '00000000007'
const DEVICE_ID = process.env.DEVICE_ID || '00000000000'
const COMPANY_SHH = process.env.COMPANY_SHH || '20251210'
const PAY_COMPANY = process.env.PAY_COMPANY || 'vid.company(13979)'
const CHANNEL_ID = process.env.CHANNEL_ID || '36'

// URL для API оператора
const OPERATOR_BASE_URL = 'https://kaspi.negiz.pro'
const GET_TWO_CODE_URL = `${OPERATOR_BASE_URL}/device/le/qr`
const LOOP_PAY_URL = `${OPERATOR_BASE_URL}/device/le/result`
const SALE_REPORT_URL = `${OPERATOR_BASE_URL}/device/le/report`

const inFlightQrRequests = new Map()

if (!APP_KEY || APP_KEY === 'CHANGE_ME_APP_KEY') {
	console.warn(
		'⚠️  APP_KEY is not set or uses placeholder. Update backend/.env before production.',
	)
}

// CORS only for React dev origin
app.use(
	cors({
		origin: 'http://localhost:3000',
	}),
)

// JSON body parser
app.use(express.json())

// Helpers
let lastTimestamp = ''
let lastTimestampOffsetSeconds = 0

function getRequestTimestamp() {
	const base = dayjs().format('YYYYMMDDHHmmss')
	if (base !== lastTimestamp) {
		lastTimestamp = base
		lastTimestampOffsetSeconds = 0
		return base
	}

	lastTimestampOffsetSeconds += 1
	return dayjs()
		.add(lastTimestampOffsetSeconds, 'second')
		.format('YYYYMMDDHHmmss')
}

function generateSecurityParams(securityTimestamp) {
	const randstr = uuidv4().replace(/-/g, '').substring(0, 16)

	// Sort appkey, randstr, timestamp lexicographically
	const parts = [APP_KEY, securityTimestamp, randstr].sort()
	const raw = parts.join('')

	const sign = crypto.createHash('sha1').update(raw, 'utf8').digest('hex')

	// Логирование для отладки
	console.log('🔐 Security params generated:', {
		timestamp: securityTimestamp,
		randstr,
		sign: sign.substring(0, 16) + '...',
		raw: parts.join('+'),
	})

	return { timestamp: securityTimestamp, randstr, sign }
}

function toTiyinString(price) {
	const num = Number(price) || 0
	return Math.floor(num * PRICE_MULTIPLIER).toString()
}

// Expand items by quantity if provided
function expandItems(items) {
	const result = []
	for (const item of items) {
		const qty = Number(item.quantity || 1)
		for (let i = 0; i < qty; i++) {
			result.push({
				trackno: String(item.trackno ?? item.trackNo ?? ''),
				name: String(item.name ?? ''),
				price: Number(item.price) || 0,
			})
		}
	}
	return result
}

// POST /api/get-qr
app.post('/api/get-qr', async (req, res) => {
	try {
		const { items } = req.body || {}

		if (!Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ error: 'items must be a non-empty array' })
		}

		const requestKey = JSON.stringify(items)
		const existing = inFlightQrRequests.get(requestKey)
		if (existing) {
			const data = await existing
			return res.json(data)
		}

		const work = (async () => {
			const flatItems = expandItems(items)
			const currentMachId = MACH_ID // Используем постоянный machid как в Postman

			console.log('📦 Processing QR request:', {
				itemsCount: items.length,
				flatItemsCount: flatItems.length,
				machid: currentMachId,
			})

			console.log('🛒 Original items:', items)
			console.log('📋 Expanded items:', flatItems)

			const requestTimestamp = getRequestTimestamp()
			const { timestamp, randstr, sign } =
				generateSecurityParams(requestTimestamp)
			const totalorderid = `C${requestTimestamp}`

			const goodsinfo = flatItems.map((item, index) => ({
				orderid: `SUB_${requestTimestamp}_${index + 1}`,
				price: toTiyinString(item.price),
				trackno: item.trackno || '',
				name: item.name || '',
			}))

			console.log('📦 Goodsinfo for API:', goodsinfo)

			const totalpriceNumber = goodsinfo.reduce(
				(sum, gi) => sum + Number(gi.price || '0'),
				0,
			)

			const payload = {
				ver: 'v2',
				totalorderid,
				machid: currentMachId,
				totalprice: String(totalpriceNumber),
				channelid: CHANNEL_ID,
				randstr,
				timestamp,
				sign,
				goodsinfo,
				deviceid: DEVICE_ID,
				companyshh: COMPANY_SHH,
				gettwocodeurl: GET_TWO_CODE_URL,
				loppayurl: LOOP_PAY_URL,
				salereporturl: SALE_REPORT_URL,
				isenable: '0',
				paycompany: PAY_COMPANY,
			}

			console.log('🚀 Sending request to operator API:', {
				url: GET_TWO_CODE_URL,
				totalorderid,
				machid: currentMachId,
				totalprice: totalpriceNumber,
				goodsinfoCount: goodsinfo.length,
			})

			console.log('📋 Full request payload:', payload)

			const response = await axios.post(GET_TWO_CODE_URL, payload, {
				headers: {
					'Content-Type': 'application/json',
				},
				timeout: 10000,
			})

			console.log('✅ Operator API response:', {
				code: response.data?.code,
				msg: response.data?.msg,
				orderid: response.data?.orderid,
				torderid: response.data?.torderid,
				hasTwocode: !!response.data?.twocode,
			})

			console.log(
				'📄 Full response from operator:',
				JSON.stringify(response.data, null, 2),
			)

			return {
				code: response.data?.code ?? '',
				msg: response.data?.msg ?? '',
				orderid: response.data?.orderid ?? '',
				torderid: response.data?.torderid ?? '',
				twocode: response.data?.twocode ?? '',
				raw: response.data ?? {},
			}
		})()

		inFlightQrRequests.set(requestKey, work)
		try {
			const data = await work
			return res.json(data)
		} finally {
			inFlightQrRequests.delete(requestKey)
		}
	} catch (err) {
		console.error('❌ Error in /api/get-qr:', err)

		if (err?.response) {
			console.error('🚨 API Error Details:', {
				status: err.response.status,
				statusText: err.response.statusText,
				data: err.response.data,
				headers: err.response.headers,
			})
		}

		const status = err?.response?.status || 500
		const upstream = err?.response?.data

		return res.status(status).json({
			error: 'Failed to get QR from operator API',
			message: err?.message || 'Unexpected error',
			upstream: upstream ?? undefined,
		})
	}
})

// GET /api/check-status/:orderId/:torderid
app.get('/api/check-status/:orderId/:torderid', async (req, res) => {
	try {
		const { orderId, torderid } = req.params

		if (!orderId || !torderid) {
			return res
				.status(400)
				.json({ error: 'orderId and torderid are required' })
		}

		const requestTimestamp = getRequestTimestamp()
		const { timestamp, randstr, sign } =
			generateSecurityParams(requestTimestamp)

		const paramsObj = {
			ver: 'v2',
			orderid: String(orderId),
			torderid: String(torderid),
			machid: MACH_ID,
			channelid: CHANNEL_ID,
			randstr,
			timestamp,
			sign,
		}

		const searchParams = new URLSearchParams()
		for (const [key, value] of Object.entries(paramsObj)) {
			searchParams.append(key, value ?? '')
		}

		const url = LOOP_PAY_URL

		const response = await axios.post(url, searchParams.toString(), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			timeout: 10000,
		})

		return res.json({
			code: response.data?.code ?? '',
			msg: response.data?.msg ?? '',
			orderid: response.data?.orderid ?? '',
			torderid: response.data?.torderid ?? '',
			raw: response.data ?? {},
		})
	} catch (err) {
		console.error('Error in /api/check-status:', err)

		const status = err?.response?.status || 500
		const upstream = err?.response?.data

		return res.status(status).json({
			error: 'Failed to check payment status',
			message: err?.message || 'Unexpected error',
			upstream: upstream ?? undefined,
		})
	}
})

// POST /api/report-shipping
app.post('/api/report-shipping', async (req, res) => {
	try {
		const { items, machId } = req.body || {}

		if (!Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ error: 'items must be a non-empty array' })
		}

		const machineId = String(machId || MACH_ID)
		const results = []

		for (const item of items) {
			const { subOrderId, tOrderId, trackNo, success, error } = item || {}
			if (!subOrderId || !tOrderId || !trackNo) {
				results.push({
					subOrderId: subOrderId || '',
					tOrderId: tOrderId || '',
					trackNo: trackNo || '',
					success: false,
					error: 'Missing required fields',
				})
				continue
			}

			const requestTimestamp = getRequestTimestamp()
			const { timestamp, randstr, sign } =
				generateSecurityParams(requestTimestamp)

			const paramsObj = {
				ver: 'v2',
				orderid: String(subOrderId),
				torderid: String(tOrderId),
				machid: machineId,
				trackno: String(trackNo),
				status: success ? '1' : '0',
				errinfo: success ? '' : String(error || 'Dispense Error'),
				randstr,
				timestamp,
				sign,
			}

			const searchParams = new URLSearchParams()
			for (const [key, value] of Object.entries(paramsObj)) {
				searchParams.append(key, value ?? '')
			}

			const url = SALE_REPORT_URL

			try {
				const response = await axios.post(url, searchParams.toString(), {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					timeout: 10000,
				})

				results.push({
					subOrderId,
					tOrderId,
					trackNo,
					success: response.data?.code === '1',
					raw: response.data ?? {},
				})
			} catch (e) {
				console.error('Error in /api/report-shipping item:', e)
				results.push({
					subOrderId,
					tOrderId,
					trackNo,
					success: false,
					error: e?.message || 'Request failed',
				})
			}
		}

		const successCount = results.filter(r => r.success).length
		const failedCount = results.length - successCount

		return res.json({ results, successCount, failedCount })
	} catch (err) {
		console.error('Error in /api/report-shipping:', err)
		const status = err?.response?.status || 500
		const upstream = err?.response?.data

		return res.status(status).json({
			error: 'Failed to report shipping to operator API',
			message: err?.message || 'Unexpected error',
			upstream: upstream ?? undefined,
		})
	}
})

app.get('/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
	console.log(`Backend proxy listening on http://localhost:${PORT}`)
})
