import { describe } from 'mocha'
import { should } from 'chai'
import Market from '../src/apps/market-maker/Market'

should()

describe('index', () => {

    it('should mint', () => {
        const market = new Market
        market._mint('a', 'sgd', 1360)
        market.balanceOf('a', 'sgd').should.equal(1360)
    })

    it('should be able to add to liquidity pool', () => {
        const market = new Market
        market._mint('a', 'sgd', 1360)
        market.addLiquidity('a', 'sgd', 1360)
        market.balanceOf('a', 'sgd').should.equal(0)
        market.poolBalanceOf('a', 'sgd').should.equal(1360)
    })

    it('should be able to trade pairs', () => {
        const market = new Market
        market._mint('alice', 'sgd', 1360000)
        market.addLiquidity('alice', 'sgd', 1360000)
        market._mint('bob', 'usd', 650000)
        market.addLiquidity('bob', 'usd', 650000)
        market._mint('charlie', 'usd', 350000)
        market.addLiquidity('charlie', 'usd', 350000)
        market._mint('dick', 'sgd', 1000)
        market.buy('dick', 'usd', 10, 'sgd')
        const sgdSpent = 13.6137361373613
        market.balanceOf('dick', 'usd').should.equal(10)
        market.balanceOf('dick', 'sgd').should.equal(1000-sgdSpent)
        market.pool.usd.balance.should.equal(999990)
        market.pool.sgd.balance.should.equal(1360000+sgdSpent)
        market.balanceOf('bob', 'usd').should.equal(10*0.001*0.65)
        market.balanceOf('charlie', 'usd').should.equal(10*0.001*0.35)
    })

    it('should be able to trade pairs', () => {
        const market = new Market
        market.comms = 0
        market._mint('alice', 'sgd', 1360000)
        market.addLiquidity('alice', 'sgd', 1360000)
        market._mint('bob', 'usd', 650000)
        market.addLiquidity('bob', 'usd', 650000)
        market._mint('charlie', 'usd', 350000)
        market.addLiquidity('charlie', 'usd', 350000)
        market._mint('dick', 'sgd', 1000)
        market.buy('dick', 'usd', 10, 'sgd')
        const sgdSpent = 13.6137361373613
        market.balanceOf('dick', 'usd').should.equal(10)
        market.balanceOf('dick', 'sgd').should.equal(1000-sgdSpent)
        market.pool.usd.balance.should.equal(999990)
        market.pool.sgd.balance.should.equal(1360000+sgdSpent)
        market.balanceOf('bob', 'usd').should.equal(10*0.001*0.65)
        market.balanceOf('charlie', 'usd').should.equal(10*0.001*0.35)
    })

})
