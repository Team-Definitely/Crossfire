import { defineStore } from 'pinia'
import { Web3Provider, AlchemyProvider } from '@ethersproject/providers'

export const useWeb3Store = defineStore('web3store', {
    state: () => ({
        address: null as string | null,
        chainId: null as number | null,
        provider: null as Web3Provider | null,
        readProvider: null as AlchemyProvider | null,
        transactions: [] as string[]
    }),
    getters: {
        getReadProvider(state) {
            // @ts-ignore
            return state.readProvider.value
        }
    },
    actions: {
        addTransaction(hash: string) {
            this.transactions.push(hash)
        },
        removeTransaction(hash: string) {
            this.transactions = this.transactions.filter((item) => item !== hash)
        }
    }
})