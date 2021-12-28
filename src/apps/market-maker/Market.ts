type TuserID = string
type Tcurrency = string
type Tamount = number

class Market {
    pool: {
        [key: Tcurrency]: {
            providers: { [key: TuserID]: Tamount }
            balance: Tamount
        }
    } = {}

    balance: {
        [key: Tcurrency]: {
            [key: TuserID]: Tamount
        }
    } = {}

    comms = 0.001

    _gamma() {
        return 1 - this.comms
    }

    addLiquidity(userID: TuserID, currency: Tcurrency, amt: Tamount) {
        if (typeof this.balance[userID]?.[currency] !== 'number') throw Error('Balance not found.')

        // balance must be great than amt
        if (!(this.balance[userID][currency] >= amt)) throw Error('Balance insufficient.')

        // deduct balance
        this.balance[userID][currency] -= amt

        // add to liquidity pool
        if (this.pool[currency]?.providers[userID] >= 0) {
            this.pool[currency].providers[userID] += amt
            this.pool[currency].balance += amt
        } else {
            // if currency exists
            if (this.pool[currency]) {
                this.pool[currency].providers[userID] = amt
                this.pool[currency].balance += amt
            } else {
                // if currency doesn't exist, add the genesis entry
                this.pool[currency] = {
                    providers: { [userID]: amt },
                    balance: amt,
                }
            }
        }
    }

    _mint(userID: TuserID, currency: Tcurrency, amt: Tamount) {
        // if user and currency record exist, add to it
        if (typeof this.balance[userID]?.[currency] === 'number') {
            this.balance[userID][currency] += amt
        } else {
            // if user record exist
            if (this.balance[userID]) {
                this.balance[userID][currency] = amt
                return
            }

            // if user record don't exist
            this.balance[userID] = {
                [currency]: amt,
            }
        }
    }

    _burn(userID: TuserID, currency: Tcurrency, amt: Tamount) {
        if (typeof this.balance[userID]?.[currency] !== 'number') throw Error('Balance not found.')

        // balance must be great than amt
        if (!(this.balance[userID][currency] >= amt)) throw Error('Balance insufficient.')

        this.balance[userID][currency] -= amt
    }

    balanceOf(userID: TuserID, currency: Tcurrency) {
        if (typeof this.balance[userID]?.[currency] !== 'number') throw Error('Balance not found.')
        return this.balance[userID][currency]
    }

    poolBalanceOf(userID: TuserID, currency: Tcurrency) {
        if (typeof this.pool[currency]?.providers[userID] !== 'number')
            throw Error('Balance not found.')
        return this.pool[currency].providers[userID]
    }

    buy(userID: TuserID, buying: Tcurrency, buyAmt: Tamount, selling: Tcurrency) {
        const reserveOfBuying = this.pool[buying]
        if (!reserveOfBuying) throw Error('Unsupported buying currency.')
        const reserveOfSelling = this.pool[selling]
        if (!reserveOfSelling) throw Error('Unsupported selling currency.')

        const fees = buyAmt * this.comms
        const totalBuyingAmt = buyAmt + fees

        const sellAmtRequired =
            (reserveOfSelling.balance * totalBuyingAmt) / (reserveOfBuying.balance - buyAmt)

        // ADJUST USER BALANCE
        if (typeof this.balance[userID]?.[selling] !== 'number') throw Error(`${selling} balance not found.`)

        // balance must be great than amt
        if (!(this.balance[userID][selling] >= sellAmtRequired)) throw Error('Balance insufficient.')

        this.balance[userID][selling] -= sellAmtRequired

        // if user currency record exist, add to it
        if (typeof this.balance[userID]?.[buying] === 'number') {
            this.balance[userID][buying] += buyAmt
        } else {
            this.balance[userID][buying] = buyAmt
        }

        // ADJUST GLOBAL BALANCE
        this.pool[buying].balance -= buyAmt - fees
        this.pool[selling].balance += sellAmtRequired

        // DISTRIBUTE REWARDS
        this._distribute(fees, 'usd')
    }

    _distribute(fees: Tamount, currency: Tcurrency) {
        let sum = 0
        let feesRemaining = fees

        for (let u in this.pool[currency].providers) {
            sum += this.pool[currency].providers[u]
        }

        for (let u in this.pool[currency].providers) {
            let apportioned = fees * (this.pool[currency].providers[u]/sum)


            // if (typeof this.balance[u]?.[currency] !== 'number') {
            //     // if user doesn't have a balance account
            //     if (!this.balance[u]) {
            //         this.balance[u] = {
            //             [currency]: 0
            //         }
            //     } else {
            //         // user has a balance account but not the currency
            //         this.balance[u][currency] = 0
            //     }
            // }

            if (feesRemaining < apportioned) {
                this.pool[currency].providers[u] += feesRemaining
                console.warn('Fees are not enough to apportion to all. Could be fractional errors, or too small a transaction.')
                break
            }

            this.pool[currency].providers[u] += apportioned
            feesRemaining -= apportioned

        }
    }
}

export default Market
export { Market }
