
# Multi-pool constant product automated market maker

This is proof-of-concept written in TypeScript to mimick a smart contract for a constant product automated market maker, with a common liquidity pool, requiring only **n** number of consolidated pools for any given  **n** number currencies.

It solves the problem of having to establish <sub>n</sub>C<sub>2</sub> discrete liquidity pairs, and hence 2<sub>n</sub>C<sub>2</sub> liquidity pools, for any given **n** number of currencies.

**Swap freely**. Currencies can freely swap between each other as long as liquidity pools are present. 

**Balancing mechanism**. In the case of market movement, or liquidity pool movements/imbalances, market arbitrages should re-balance to equilbrium pricing.

## Formula
> (R<sub>selling</sub> + ∆R<sub>selling</sub>)(R<sub>buying</sub> - γ∆R<sub>buying</sub>) = k

where R are the reserves, and γ = 1 + commission (in %)

  $\frac{n!}{k!(n-k)!}$

Therefore, re-arranging for ∆R<sub>buying</sub> (amount of buying currency to receive), given ∆R<sub>selling</sub> (the target amount to sell):

>γ∆R<sub>buying</sub> = $\frac{R_{buying} * ∆R_{selling}}{R_{selling} + ∆R_{selling}}$

Or, re-arranging for ∆R<sub>selling</sub> (cost in units of selling currency), given ∆R<sub>buying</sub> (target units of currency to acquire) :

>∆R<sub>selling</sub> = $\frac{R_{selling} * γ∆R_{buying}}{R_{buying} - γ∆R_{selling}}$


## Try it

```js

yarn  start:dev

```

### Get /

See the balances of the simulated market.


### Get swap/:userID/:buy/:amount/:sell

Simulate a user swapping for a currency from the pool, using a currency that he/she owns.


E.g: Dick buys 100 usd using sgd.

```

/swap/dick/usd/100/sgd

```

The AMM algo will:

1) Calculate the exchange rate using the constant product formula
2) Adjust Dick's balance by deducting SGD and adding 100 USD.
3) Adds SGD into the liquidity pool.
3) Distribute the fees (paid by Dick) proportionally to all USD liquidity providers.