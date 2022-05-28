<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { Ref } from 'vue';
import Dropdown from './Dropdown.vue';

const props = defineProps({
    label: {
        default: 'Select',
        type: String
    },
    modelValue: {
        required: false,
    }
})

const emit = defineEmits(['update:modelValue'])
const selected: Ref<any> = useVModel(props, 'modelValue', emit)

</script>

<template>
    <div>
        <div class="relative">
            <input type="text" v-bind="$attrs"
                class="bg-dark-400 rounded-lg pb-3 pt-7 pr-32 pl-4 w-full font-mono text-2xl">
            <div class="text-xs absolute left-3 top-2 ml-0.5 text-gray-300">
                {{ props.label }}
            </div>
            <div class="absolute right-0 top-1/4">
                <Dropdown v-model="selected" type="Token">
                    Select a token
                </Dropdown>
            </div>
        </div>
    </div>
</template>
