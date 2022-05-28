
<script setup lang="ts">
import { onMounted, Ref, ref, defineEmits } from 'vue';
import { chains } from '~/constants/chainList'
import { tokens } from '~/constants/tokenList'
import { getIconUrl } from '~/utils/icons'
import { useVModel } from '@vueuse/core'

const open = ref(false)
const items = ref([] as any[])

const props = defineProps({
    type: {
        default: 'Chain',
        type: String
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

function openModal() {
    open.value = true
}
function closeModal() {
    open.value = false
}

function init() {
    if (props.type === 'Chain') items.value = chains
    else if (props.type === 'Token') {
        items.value = props.list as any[] ?? tokens
    }
}

function select(item: any) {
    console.log("selected", selected.value)
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
            <img :src="getIconUrl(selected.symbol.toLowerCase())" :alt="selected.symbol" class="w-5 h-5" />
            <span>
                {{ selected.name }}
            </span>
        </span>
    </button>
    <Modal v-model="open" :close="closeModal">
        <div class="bg-true-gray-700 text-white rounded-lg w-10/12 md:w-1/5">
            <div class="p-5 bg-true-gray-800 rounded-t-lg">
                Select a {{ props.type }}
            </div>
            <ul class="list-none">
                <li v-for="item in items" @click="select(item)"
                    class="flex space-x-2 items-center px-4 py-3 max-h-36 overflow-y-auto cursor-pointer hover:(bg-true-gray-600) rounded-lg">
                    <img :src="getIconUrl(item.symbol.toLowerCase())" :alt="item.symbol" class="w-6 h-6 mt-0.5" />
                    <span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
    </Modal>
</template>
