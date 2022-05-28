<script setup lang="ts">
import { ref } from 'vue';
import Dropdown from '../components/Dropdown.vue';
import InputField from '../components/InputField.vue';

const selectedChain0 = ref(null)
const selectedChain1 = ref(null)

const selectedToken0 = ref(null)
const selectedToken1 = ref(null)

</script>

<template>
    <div class="mt-20 w-full mx-auto min-w-72 md:min-w-96 w-45 bg-dark-100 p-5 rounded-lg">
        <h1 class="font-bold text-xl">Bridge</h1>
        <h3 class="text-sm text-gray-300">Transfer tokens between varying chains</h3>

        <div class="flex items-center justify-between mt-3">
            <Dropdown v-model="selectedChain0">
                From Chain
            </Dropdown>
            <span>&rarr;</span>
            <Dropdown v-model="selectedChain1">
                To Chain
            </Dropdown>

        </div>
        <div class="mt-5">
            <InputField label="First token" v-model="selectedToken0" placeholder="0.0" />
            <div class="mt-3"></div>
            <InputField label="Second token" v-model="selectedToken1" placeholder="0.0" />
        </div>
    </div>
</template>
