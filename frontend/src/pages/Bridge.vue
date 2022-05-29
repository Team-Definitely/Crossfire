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
import ApproveButton from '~/components/ApproveButton.vue';
import { addToHistory, loadHistory } from '~/utils/history'
import { addTransaction } from '~/utils/transactions';
import SafeImage from '~/components/SafeImage.vue';
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
const routes = ref([] as any[])

const defaultPlaceholder = "0.0"
const placeholder = ref(defaultPlaceholder)

const priority = ref('Gas' as 'Output' | 'Gas' | 'Time')

const transferLoading = ref(false)

const spender = ref('')

const bridgeUsed = ref([] as any[])
const protocolFees = ref(null)
const gasFees = ref(null)

const history = ref([] as any[])
onMounted(init)

function init() {
    getSupportedChains()
}

watch(selectedChain0, onSelectedChainChange)
watch(selectedChain1, onSelectedChainChange)

watch(selectedToken0, onTokenChange)
watch(selectedToken1, onTokenChange)

watch(inputAmount, onAmountChange)

watch(priority, () => {
    getQuote()
})

function onSelectedChainChange() {
    selectedToken0.value = null
    selectedToken1.value = null
    inputAmount.value = null
    outputAmount.value = null
    quoteResult.value = null
    gasFees.value = null
    protocolFees.value = null
    bridgeUsed.value = []
    routes.value = []

    getSupportedTokens()
}

function onTokenChange() {
    inputAmount.value = null
    outputAmount.value = null
    quoteResult.value = null
    routes.value = []
}

function onAmountChange() {
    routes.value = []
}

async function getSupportedChains() {
    const chains = await axios.get(`/supported/chains`);
    chainList0.value = chains.data.result
    chainList1.value = chains.data.result

    selectedChain0.value = (chainList0.value as any)[0]
    selectedChain1.value = (chainList1.value as any)[2]
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

    selectedToken0.value = fromTokens.data.result[1]
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
            sort: priority.value.toLowerCase(), // provided option to user
            singleTxOnly: true
        } as any)
        console.log(result.result)
        if (result.result.routes?.length > 0) {
            const toAmount = result.result.routes[result.result.routes.length - 1].toAmount
            bridgeUsed.value = result.result.routes[result.result.routes.length - 1].usedBridgeNames
            gasFees.value = result.result.routes[result.result.routes.length - 1].totalGasFeesInUsd
            try {
                const user_transactions = result.result.routes[result.result.routes.length - 1].userTxs
                for (let txs in user_transactions) {
                    if (user_transactions[txs].userTxType == "fund-movr") {
                        console.log(user_transactions[txs])
                        console.log(22222)
                        const stepss = user_transactions[txs].steps
                        for (let step in stepss) {
                            if (stepss[step].type == "bridge") {
                                protocolFees.value = stepss[step].protocolFees.feesInUsd
                            }
                        }
                    }
                }
            }
            catch {
                console.log('moving to next step for bridge fee')
            }
            console.log("quote result", toAmount, "bridgeUsed", bridgeUsed)
            outputAmount.value = +formatUnits(toAmount, (selectedToken1.value as any).decimals)

            quoteResult.value = { route: result.result.routes[result.result.routes.length - 1] } as any
            routes.value = result.result.routes

            const txn = await postBuildTx(quoteResult.value)
            spender.value = txn.data.result.approvalData.allowanceTarget
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


        const txn = await web3Provider.getSigner().sendTransaction({
            from: address.value ?? '',
            to: txnCalldata.txTarget,
            data: txnCalldata.txData,
            chainId: txnCalldata.chainId,
            value: txnCalldata.value,
            gasLimit: 800000,
        })

        // const hash = 'randomhash'
        // CONVERT HASH TO TXN.HASH
        addToHistory({ 'name': 'transfer', 'hash': txn.hash, 'fromChain': selectedChain0.value, 'toChain': selectedChain1.value, 'fromToken': { ...selectedToken0.value as any, amount: inputAmount.value }, 'toToken': { ...selectedToken1.value as any, amount: outputAmount.value }, 'value': txnCalldata.value, 'time': +new Date })
        // const jsonuwu = JSON.stringify({ 'name': 'transfer', 'hash': txn.hash, 'fromChain': selectedChain0, 'toChain': selectedChain1, 'fromToken': selectedToken0, 'toToken': selectedToken1, 'value': txnCalldata.value, 'time': +new Date })
        // name, hash, from, to chain and token, value, time

        addTransaction(txn.hash)


        // @ts-ignore
        console.log("Txn", txn)
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
    <div class="md:(flex)">
        <!-- <div class="mt-20 w-10/12 mx-auto min-w-72 md:(min-w-96 w-45) bg-dark-100 p-5 rounded-lg"> -->
        <div class="mt-20 w-10/12 mx-auto min-w-72 md:w-1/3 bg-dark-100 rounded-lg h-full">
            <div class="p-5">
                <h1 class="font-bold text-xl">Bridge</h1>
                <h3 class="text-sm text-gray-300">Transfer tokens between varying chains</h3>

                <div class="flex flex-col md:flex-row md:items-center space-x-3 mt-3">
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
                    <InputField label="From token" v-model="selectedToken0" v-model:inputValue="inputAmount"
                        placeholder="0.0" :list="tokenList0" v-debounce:500ms="getQuote" />
                    <div class="my-1.5 w-full text-center">&darr;</div>
                    <InputField label="To token" v-model="selectedToken1" v-model:inputValue="outputAmount"
                        :placeholder="placeholder" :list="tokenList1" disabled="true" />
                </div>

                <div class="mt-5">
                    <ApproveButton v-if="selectedToken0 && quoteResult" :token="selectedToken0" :spender="spender" />
                    <button @click="transfer"
                        class="w-full mt-2 bg-primary-500 hover:bg-primary-600 transition rounded-lg p-3 font-bold"
                        :disabled="transferLoading">Transfer</button>
                </div>
            </div>
            <div class="bg-dark-500 p-5 rounded-b-lg bg-true-gray-700 bg-opacity-75 py-3 px-3.5 mt-5"
                :class="protocolFees == null || gasFees == null || bridgeUsed.length == 0 ? 'hidden' : ''">
                <div class="text-sm flex flex-row justify-between text-gray-200 my-2"><span>Bridge Name</span><span>{{
                        bridgeUsed[bridgeUsed.length - 1]
                }}</span>
                </div>
                <div class="text-sm flex flex-row justify-between text-gray-200 my-2"><span>Bridge
                        Fee</span><span>${{ protocolFees?.toLocaleString('en-US') }}
                    </span></div>
                <div class="text-sm flex flex-row justify-between text-gray-200 my-2"><span>Gas Fee</span><span>${{
                        gasFees?.toLocaleString('en-US')
                }}
                    </span></div>
            </div>
        </div>
        <div class="mt-20 w-10/12 mx-auto min-w-72 md:w-1/3 bg-dark-100 p-5 rounded-lg">
            <h1 class="font-bold text-lg">Routing</h1>
            <div class="flex items-center space-x-3">
                <p class="text-sm">
                    Priority:
                </p>
                <select v-model="priority" class="mt-0.5 text-white text-xs px-2 py-1 rounded-md bg-dark-500">
                    <option value="Gas">Gas</option>
                    <option value="Time">Time</option>
                    <option value="Output">Output</option>
                </select>
            </div>
            <p v-if="!routes || routes.length === 0" class="text-sm mt-3">No routes available yet
            </p>
            <div v-else>
                <div v-for="route in routes" :key="route.routeId" class="p-3 border border-gray-500 rounded-lg my-3">
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2">
                            <SafeImage :src="(selectedToken0 as any).icon" class="w-5 h-5 rounded-full"
                                :alt="(selectedToken0 as any).symbol" />
                            <div>{{ (route.fromAmount * 10 ** -((selectedToken0 as
                                    any).decimals)).toLocaleString('en-US')
                            }}</div>
                        </div>
                        <div>
                            &rarr;
                        </div>
                        <div v-for="bridge in route.usedBridgeNames">
                            <h1>{{ bridge }} </h1>
                        </div>
                        <div>
                            &rarr;
                        </div>
                        <div class="flex items-center space-x-2 my-1">
                            <SafeImage :src="(selectedToken1 as any).icon" class="w-5 h-5 rounded-full"
                                :alt="(selectedToken1 as any).symbol" />
                            <div>{{ (route.toAmount * 10 ** -((selectedToken1 as
                                    any).decimals)).toLocaleString('en-US')
                            }}</div>
                        </div>
                    </div>

                    <div class="mt-2 flex space-x-2">
                        <div class="text-xs bg-primary-500 rounded-lg inline-flex w-auto">
                            <span class="px-2 py-1">Gas fees</span> <span
                                class="px-2 py-1 bg-primary-600 rounded-r-lg">${{
                                        route.totalGasFeesInUsd.toLocaleString('en-US')
                                }}</span>
                        </div>
                        <div class="text-xs bg-primary-500 rounded-lg inline-flex w-auto">
                            <span class="px-2 py-1">Txn count</span> <span
                                class="px-2 py-1 bg-primary-600 rounded-r-lg">{{
                                        route.totalUserTx
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
