<script setup lang="ts">
import { formatEther } from '@ethersproject/units';
import { ethers } from 'ethers';
import { onMounted, ref } from 'vue';

// @ts-ignore
import ERC20ABI from '~/constants/abis/ERC20'

const loading = ref(false)
const loadingAllowance = ref(false)

const hasAllowance = ref(false)

const props = defineProps({
    token: {
        required: true
    },
    spender: {
        type: String,
        required: true
    }
})

onMounted(init)

function init() {
    checkAllowance()
}

async function checkAllowance() {
    if (!props.token || !props.spender) return
    loadingAllowance.value = true

    try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        const userAddress = await web3Provider.getSigner().getAddress()

        console.log("allowance for ", props.token, props.spender)

        const contract = new ethers.Contract(props.token.address, ERC20ABI, web3Provider)
        const allowance = await contract.allowance(userAddress, props.spender)
        if (+formatEther(allowance) > 0) {
            hasAllowance.value = true
        }
        else {
            hasAllowance.value = false
        }
    }
    catch (e) {
        console.error(e)
    }
    finally {
        loadingAllowance.value = false
    }
}

async function approve() {
    try {
        loading.value = true

        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)

        const contract = new ethers.Contract(props.token.address, ERC20ABI, web3Provider.getSigner())
        const result = await contract.approve(props.spender, ethers.constants.MaxUint256)

        console.log("Approve hash", result.hash)
        result.wait(1).then(() => {
            checkAllowance()
        })
    }
    catch (e) {
        console.error(e)
    }
    finally {
        loading.value = false
    }
}

</script>

<template>
    <button @click="approve" v-if="!hasAllowance"
        class="w-full text-xs bg-primary-700 hover:bg-primary-800 transition rounded-lg p-3 font-bold"
        :disabled="loading || loadingAllowance">
        <span v-if="!hasAllowance">Approve {{ token.symbol }}</span>
        <span v-else-if="loadingAllowance">Checking allowance</span>
        <span v-else-if="loading">Loading...</span>
    </button>
</template>
