
<script setup lang="ts">
import { onMounted, Ref, ref, defineEmits, watch } from 'vue';
import { chains } from '~/constants/chainList'
import { tokens } from '~/constants/tokenList'
import { getIconUrl } from '~/utils/icons'
import { useVModel } from '@vueuse/core'
import SafeImage from './SafeImage.vue';

const open = ref(false)
const items = ref([] as any[])

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

function openModal() {
    open.value = true
}
function closeModal() {
    open.value = false
}

function updateList() {
    if (props.type === 'Chain') items.value = props.list as any[] ?? chains
    else if (props.type === 'Token') {
        items.value = props.list as any[] ?? tokens
    }
}

function init() {
    updateList()
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
            <SafeImage :src="getIconUrl(selected.symbol ? selected.symbol.toLowerCase() : selected.name, props.type)"
                :alt="selected.symbol ? selected.symbol : selected.name" class="w-5 h-5 rounded-full" />
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
            <ul class="list-none max-h-64 overflow-y-auto">
                <li v-for="item in items" @click="select(item)"
                    class="flex space-x-2 items-center px-4 py-3 cursor-pointer hover:(bg-true-gray-600) rounded-lg">
                    <SafeImage :src="getIconUrl(item.name, props.type)" :alt="item.name"
                        class="w-6 h-6 mt-0.5 rounded-full" />
                    <span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
    </Modal>
</template>
