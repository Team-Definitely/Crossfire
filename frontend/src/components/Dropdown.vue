
<script setup lang="ts">
import { onMounted, Ref, ref, defineEmits, watch } from 'vue';
import { chains } from '~/constants/chainList'
import { tokens } from '~/constants/tokenList'
import { getIconUrl } from '~/utils/icons'
import { useVModel } from '@vueuse/core'
import SafeImage from './SafeImage.vue';
import Chevron from './Icons/Chevron.vue';

const open = ref(false)
const items = ref([] as any[])
const frequent = ref([] as any[])
const keyupdate = ref("")
const filteredItems = ref([] as any[])
const props = defineProps({
    type: {
        default: 'Chain',
        type: Object as () => 'Chain' | 'Token'
    },
    modelValue: {
        required: false,
    },
    list: {
        required: false,
    },
})

const emit = defineEmits(['update:modelValue'])
const selected: Ref<any> = useVModel(props, 'modelValue', emit)

onMounted(init)

watch(() => props.list, () => {
    updateList()
})

watch(() => keyupdate.value, () => {
    console.log(keyupdate.value)
    updateList()
})
function openModal() {
    open.value = true
}
function closeModal() {
    open.value = false
}

async function updateList() {
    if (props.type === 'Chain') items.value = props.list as any[]
    else if (props.type === 'Token') {
        items.value = props.list as any[]
    }
    if (items.value != null) {
        if (keyupdate.value != null || keyupdate.value != "") {
            console.log('inside filter')
            filteredItems.value = items.value.filter(function (item) {
                return item.symbol.toLowerCase().includes(keyupdate.value.trim().toLowerCase())
            })
        }

        frequent.value = items.value.filter(function (item) {
            return ["DAI", "MATIC", "ETH", "USDT", "USDC"].includes(item.symbol);
        });
    }
    else {
        await sleep(1000);
    }



}
let sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function init() {
    updateList()
}


function select(item: any) {
    console.log(item);
    selected.value = item
    closeModal()
}



</script>

<template>
    <button class="bg-dark-400 hover:bg-dark-500 transition px-3 py-2 text-sm rounded-lg" @click="openModal">
        <span v-if="!selected">
            <slot />
        </span>
        <span v-else class="flex space-x-2 items-center">
            <SafeImage
                :src="selected.icon ?? getIconUrl(selected.symbol ? selected.symbol.toLowerCase() : selected.name, props.type)"
                :alt="selected.symbol ? selected.symbol : selected.name" class="w-5 h-5 rounded-full" />
            <span>
                {{ selected.name }}
            </span>
            <Chevron class="w-4 h-4" />
        </span>
    </button>
    <Modal v-model="open" :close="closeModal">
        <div class="bg-true-gray-700 text-white rounded-lg w-96">
            <div class="p-5 bg-true-gray-800 rounded-t-lg">
                Select a {{ props.type }}
            </div>
            <div v-if="props.type === 'Token'" class="px-5 pb-2 bg-true-gray-800">
                <div
                    class="flex items-center px-2 w-full bg-gray-100 border-gray-100 rounded-lg text-gray-800 sm:text-sm overflow-hidden focus-within:border-secondary mb-4 focus-within:bg-white relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="w-5 h-5 text-gray-500 mr-2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input v-model="keyupdate" placeholder="Search for a token" class="w-full py-2.5 outline-0	">
                </div>
                <div class="flex flex-wrap gap-x-2 gap-y-2 mb-4">
                    <div v-for="item in frequent" @click="select(item)" class="text-black flex items-center border border-gray-800 bg-true-gray-600
                        cursor-pointer hover:bg-true-gray-400 rounded-full py-1 pl-1 pr-2 sm:py-2 sm:pl-2 sm:pr-4 text-xs
                        font-medium">
                        <SafeImage :src="item.icon ?? getIconUrl(item.name, props.type)" :alt="item.name"
                            class="w-6 h-6 rounded-full mr-1 sm:mr-2 bg-gray-200 border border-gray-300 " />
                        <div class="text-white">{{ item.symbol }}</div>

                    </div>

                </div>

            </div>
            <ul class="list-none max-h-64 overflow-y-auto">
                <li v-for="item in filteredItems.length == 0 ? items : filteredItems" @click="select(item)"
                    class="flex space-x-2 items-center px-4 py-3 cursor-pointer hover:(bg-true-gray-600) rounded-lg">
                    <SafeImage :src="item.icon ?? getIconUrl(item.name, props.type)" :alt="item.name"
                        class="w-6 h-6 mt-0.5 rounded-full" />
                    <span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
    </Modal>
</template>
