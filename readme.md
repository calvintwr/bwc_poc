
# Multi-pool constant product automated market maker

This is proof-of-concept written in TypeScript to mimick a smart contract for a constant product automated market maker, with a common liquidity pool, requiring only **n** number of consolidated pools for any given  **n** number currencies.

It solves the problem of having to establish <sub>n</sub>C<sub>2</sub> discrete liquidity pairs, and hence 2<sub>n</sub>C<sub>2</sub> liquidity pools, for any given **n** number of currencies.

**Swap freely**. Currencies can freely swap between each other as long as liquidity pools are present. 

**Balancing mechanism**. In the case of market movement, or liquidity pool movements/imbalances, market arbitrages should re-balance to equilbrium pricing.

## Formula

<br>

>![\Large&space;\gamma\Delta{R_{buying}}=\frac{R_{buying}*\Delta{R_{selling}}}{R_{selling}+\Delta{R_{selling}}}](https://latex.codecogs.com/svg.latex?\Large&space;(R_{selling}+\Delta{R_{selling}})(R_{buying}-\gamma\Delta{R_{buying}})=k)


where R are the reserves; 
and γ = 1 + commission (in %)

*Note: This varies from the constant product formula used by Uniswap, where commission is charged on the currency sold, and pooled together for distribution to all Liquidity Providers (LPs). In this version instead, actor will spend more to purchase an amount of desired currency that includes fees. I.e. Instead of buying 10 USD, one is to buy 10 USD + fees in USD. The fees are distributed to LPs of the purchased currency. This incentivises LPs to provide for pools there are being depleted, as currencies in-demand with depleting (or high turnover) pools will generate higher returns in fees, acting to maintain market equilibrium.

<br>

Therefore, re-arranging for ∆R<sub>buying</sub> (amount of buying currency to receive), given ∆R<sub>selling</sub> (the target amount to sell):



>![\Large&space;\gamma\Delta{R_{buying}}=\frac{R_{buying}*\Delta{R_{selling}}}{R_{selling}+\Delta{R_{selling}}}](https://latex.codecogs.com/svg.latex?\gamma\Delta{R_{buying}}=\frac{R_{buying}*\Delta{R_{selling}}}{R_{selling}+\Delta{R_{selling}}})

<br>

Or, re-arranging for ∆R<sub>selling</sub> (cost in units of selling currency), given ∆R<sub>buying</sub> (target units of currency to acquire):


>![\Large&space;\Delta{R_{selling}}=\frac{R_{selling}*\gamma\Delta{R_{buying}}}{R_{buying}-\gamma\Delta{R_{buying}}}](https://latex.codecogs.com/svg.latex?\Delta{R_{selling}}=\frac{R_{selling}*\gamma\Delta{R_{buying}}}{R_{buying}-\gamma\Delta{R_{buying}}})

## Roles and Incentives

**Liquidity Providers** provide liquidity (staking) in return for commissions, akin to collecting interest with deposits in the bank. As a reference of equivalent interest rate accruable, at the time of writing (25 Decemeber 2021), Uniswap has an average of 4.3b USD and equivalent liquidity provided, and averaging daily volume of 1b USD, over a period of 30 days. At a small 0.1% commission rate earned, this represents an equivalent of 8.4% gains per annum, beating bank interests by far if funds are equally secured by bank or bank-like institutions. In addition, vastly reducing discrete liquidity pools should reduce liquity to volume ratio, increaseing per annum gains beyond 8.4%.

**Arbitragers** are natural profit-seeking individuals who will await imbalances to capture gains by equalizing differences between conventional forex and cryptocurrency representations. This is much like existing incentivised arbitrages that keeps all cryptocurency exchanges prices similar to one another. Practically, such players typically hold sufficiently large amount of assets in reserves, and likely employ automated algorithms to conduct arbitrages at an efficient and effective scale.

**Users** are natural persons or organisations seeking to swap their currencies to another. If given that liquidity pools are large enough, and effective arbitraging to maintain price equilibrium, and an cost-efficient blockchain (Solana, Cardano, Polkadot or Ethereum V2), the cost of currency exchange on crypto for trading purposes would likely be lower than conventional forex (0.2-0.5%). If coupled with efficient fiat multicurrency account for money transfer solution (wise, remitly), or usage of funds directly on-chain, cost of money exchange will be much lower than remittance services (1-3%).

## Try it

```js

yarn  start:dev

```

### `Get` /

See the balances of the simulated market.


### `Get` swap/:userID/:buy/:amount/:sell

Simulate a user swapping for a currency from the pool, using a currency that he/she owns.


E.g: Dick buys 100 usd using sgd.

```

/swap/dick/usd/100/sgd

```

The AMM formula will:

1) Calculate the exchange rate using the constant product formula, requiring the Dick pays in SGD the equivalent of 100 USD + 0.1 USD (fees of 0.1%). 
2) Adjust Dick's balance by deducting SGD and adding 100 USD.
3) Adds SGD into the liquidity pool.
3) Distribute the fees of 0.1USD (paid by Dick) proportionally to all USD liquidity providers.
