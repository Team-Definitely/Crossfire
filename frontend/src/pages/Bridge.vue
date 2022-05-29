<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import axios from '~/utils/axios';
import Dropdown from '../components/Dropdown.vue';
import InputField from '../components/InputField.vue';
import { Chain } from '~/interfaces'
import { postBuildTx, quote } from '../utils/requests'
import { useWeb3Store } from '~/stores/web3Store';
import { storeToRefs } from 'pinia';
import { formatUnits } from '@ethersproject/units';
import { ethers } from 'ethers';

const { address } = storeToRefs(useWeb3Store())

const selectedChain0 = ref(null as Chain | null)
const selectedChain1 = ref(null as Chain | null)

const selectedToken0 = ref(null)
const selectedToken1 = ref(null)

const chainList0 = ref(null)
const chainList1 = ref(null)
const tokenList0 = ref(null)
const tokenList1 = ref(null)

const inputAmount = ref(null as number | null)
const outputAmount = ref(null as number | null)

const quoteResult = ref(null)

const defaultPlaceholder = "0.0"
const placeholder = ref(defaultPlaceholder)

const transferLoading = ref(false)

onMounted(init)

function init() {
    getSupportedChains()
}

watch(selectedChain0, onSelectedChainChange)
watch(selectedChain1, onSelectedChainChange)

watch(selectedToken0, onTokenChange)
watch(selectedToken1, onTokenChange)

function onSelectedChainChange() {
    selectedToken0.value = null
    selectedToken1.value = null
    inputAmount.value = null
    outputAmount.value = null
    getSupportedTokens()
}

function onTokenChange() {
    inputAmount.value = null
    outputAmount.value = null
}

async function getSupportedChains() {
    const chains = await axios.get(`/supported/chains`);
    chainList0.value = chains.data.result
    chainList1.value = chains.data.result

    selectedChain0.value = (chainList0.value as any)[0]
    selectedChain1.value = (chainList1.value as any)[1]
}

async function getSupportedTokens() {
    if (!selectedChain0.value || !selectedChain1.value) return

    const fromTokens = await axios.get('/token-lists/from-token-list', {
        params: {
            fromChainId: selectedChain0.value.chainId,
            toChainId: selectedChain1.value.chainId,
            isShortList: true,
            singleTxOnly: true,
        }
    })

    const toTokens = await axios.get('/token-lists/to-token-list', {
        params: {
            fromChainId: selectedChain0.value.chainId,
            toChainId: selectedChain1.value.chainId,
            isShortList: true,
            singleTxOnly: true,
        }
    })
    // console.log("Tokens", tokens.data.result)
    tokenList0.value = fromTokens.data.result
    tokenList1.value = toTokens.data.result

    selectedToken0.value = fromTokens.data.result[0]
    selectedToken1.value = toTokens.data.result[0]
}

async function getQuote() {
    try {
        placeholder.value = "Loading..."

        quoteResult.value = null
        outputAmount.value = null

        if (!selectedChain0.value || !selectedChain1.value || !selectedToken0.value || !selectedToken1.value || !inputAmount.value) return
        const result = await quote({
            fromChainId: selectedChain0.value.chainId,
            toChainId: selectedChain1.value.chainId,
            fromTokenAddress: (selectedToken0.value as any).address,
            toTokenAddress: (selectedToken1.value as any).address,
            fromAmount: inputAmount.value * 10 ** (selectedToken0.value as any).decimals,
            userAddress: address.value,
            uniqueRoutesPerBridge: true,
            sort: "time", // can provide option to user
        } as any)
        console.log(result.result)
        if (result.result.routes?.length > 0) {
            const toAmount = result.result.routes[result.result.routes.length - 1].toAmount
            console.log("quote result", toAmount)
            outputAmount.value = +formatUnits(toAmount, (selectedToken1.value as any).decimals)

            quoteResult.value = { route: result.result.routes[result.result.routes.length - 1] } as any
        }
        else {
            outputAmount.value = 0
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        placeholder.value = defaultPlaceholder
    }
}

async function transfer() {
    if (!quoteResult.value) return
    try {
        transferLoading.value = true
        const result = await postBuildTx(quoteResult.value)
        const txnCalldata = result.data.result
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(txnCalldata)
        const txn = await web3Provider.sendTransaction(txnCalldata.txData)

        // @ts-ignore
        console.log("Txn hash", txn.hash)
    }
    catch (e) {
        console.error(e);
    }
    finally {
        transferLoading.value = false
    }
}

</script>

<template>
    <div class="mt-20 w-10/12 mx-auto min-w-72 md:(min-w-96 w-45) bg-dark-100 p-5 rounded-lg">
        <h1 class="font-bold text-xl">Bridge</h1>
        <h3 class="text-sm text-gray-300">Transfer tokens between varying chains</h3>

        <div class="flex flex-col md:flex-row md:items-center justify-between mt-3">
            <Dropdown v-model="selectedChain0" :list="chainList0">
                From Chain
            </Dropdown>
            <span class="hidden md:block">&rarr;</span>
            <span class="block md:hidden my-2 mx-auto">&darr;</span>
            <Dropdown v-model="selectedChain1" :list="chainList1">
                To Chain
            </Dropdown>

        </div>
        <div class="mt-5">
            <InputField label="From token" v-model="selectedToken0" v-model:inputValue="inputAmount" placeholder="0.0"
                :list="tokenList0" v-debounce:500ms="getQuote" />
            <div class="my-1.5 w-full text-center">&darr;</div>
            <InputField label="To token" v-model="selectedToken1" v-model:inputValue="outputAmount"
                :placeholder="placeholder" :list="tokenList1" disabled="true" />
        </div>

        <div class="mt-5">
            <button @click="transfer"
                class="w-full bg-primary-500 hover:bg-primary-600 transition rounded-lg p-3 font-bold"
                :disabled="transferLoading">Transfer</button>
        </div>
    </div>
</template>
