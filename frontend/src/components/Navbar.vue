<script setup lang="ts">
import { connect } from 'http2';
import { onMounted } from 'vue';
import { ConnectWalletButton, useMetaMaskWallet } from 'vue-connect-wallet'
import { useWeb3Store } from '../stores/web3Store';
import { ethers } from 'ethers'
import { storeToRefs } from 'pinia';

const wallet = useMetaMaskWallet()
const store = useWeb3Store()

const { address } = storeToRefs(store)

onMounted(init)

async function init() {
    const accounts = await wallet.getAccounts()
    if (accounts.length > 0) connectWallet()
    wallet.onAccountsChanged(() => connectWallet())
    wallet.onChainChanged(() => connectWallet())
}

async function connectWallet() {
    const accounts = await wallet.connect()
    if (typeof accounts === 'string') return

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const chainId = (await web3Provider.getNetwork()).chainId

    store.$patch({
        address: accounts[0],
        chainId
    })
}

</script>

<template>
    <nav class="bg-dark-300 m-2 rounded-lg">
        <div class="flex justify-between items-center p-5">
            <div class="py-2">
                <h1 class="logo">Crossfire</h1>
                <h3 class="px-3 text-gray-300">by Team Definitely</h3>
            </div>
            <ul class="list-none flex space-x-2 items-center">
                <li class="z-0">
                    <ConnectWalletButton @click="connectWallet" :address="address ?? ''" :dark="true" />
                </li>
            </ul>
        </div>
        <div class="h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-b-lg">
        </div>
    </nav>
</template>

<style scoped>
.logo {
    @apply bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1 tracking-widest font-black text-4xl;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
