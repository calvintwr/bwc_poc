import express from 'express'
import market from '../apps/market-maker'

const router = express.Router()

router.get('/', (req, res, next) => {
    res.send(market)
})

export default router
