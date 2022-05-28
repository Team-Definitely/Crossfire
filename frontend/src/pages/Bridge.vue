<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import axios from '~/utils/axios';
import Dropdown from '../components/Dropdown.vue';
import InputField from '../components/InputField.vue';
import { Chain } from '~/interfaces'

const selectedChain0 = ref(null as Chain | null)
const selectedChain1 = ref(null as Chain | null)

const selectedToken0 = ref(null)
const selectedToken1 = ref(null)

const chainList0 = ref(null)
const chainList1 = ref(null)
const tokenList0 = ref(null)
const tokenList1 = ref(null)


onMounted(init)

function init() {
    getSupportedChains()
}

watch(chainList0, () => getSupportedTokens())
watch(chainList1, () => getSupportedTokens())

async function getSupportedChains() {
    const chains = await axios.get(`/supported/chains`);
    chainList0.value = chains.data.result
    chainList1.value = chains.data.result

    selectedChain0.value = (chainList0.value as any)[0]
    selectedChain1.value = (chainList1.value as any)[1]
}

async function getSupportedTokens() {
    tokenList0.value = null
    tokenList1.value = null
    if (!selectedChain0.value || !selectedChain1.value) return

    const tokens = await axios.get('/token-lists/from-token-list', {
        params: {
            fromChainId: selectedChain0.value.chainId,
            toChainId: selectedChain1.value.chainId,
            isShortList: true,
        }
    })
    tokenList0.value = tokens.data.result
    tokenList1.value = tokens.data.result

}

function transfer() {

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
            <InputField label="From token" v-model="selectedToken0" placeholder="0.0" :list="tokenList0" />
            <div class="mt-3"></div>
            <InputField label="To token" v-model="selectedToken1" placeholder="0.0" :list="tokenList1" />
        </div>

        <div class="mt-5">
            <button @click="transfer"
                class="w-full bg-primary-500 hover:bg-primary-600 transition rounded-lg p-3 font-bold">Transfer</button>
        </div>
    </div>
</template>
