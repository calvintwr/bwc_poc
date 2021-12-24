import Market from './Market'

const market = new Market

market._mint('alice', 'sgd', 1360000)
market.addLiquidity('alice', 'sgd', 1360000)
market._mint('bob', 'usd', 650000)
market.addLiquidity('bob', 'usd', 650000)
market._mint('charlie', 'usd', 350000)
market.addLiquidity('charlie', 'usd', 350000)
market._mint('dick', 'sgd', 1000)
market._mint('ernie', 'aud', 1380000)
market.addLiquidity('ernie', 'aud', 1380000)

export default market
export { market }
