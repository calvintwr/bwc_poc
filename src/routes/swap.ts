import express from 'express'
import { cloneDeep } from 'lodash'
import market from '../apps/market-maker'


const router = express.Router()

router.get('/:userID/:buy/:amount/:sell', (req, res, next) => {
    const old = cloneDeep(market)

    market.buy(req.params.userID,req.params.buy, parseFloat(req.params.amount), req.params.sell)

    res.send({
        old,
        new: market,
    })
})

export default router
