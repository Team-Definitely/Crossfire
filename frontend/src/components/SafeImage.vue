<script setup lang="ts">
import { onImageError } from '~/utils/icons'
</script>

<template>
    <img @error="onImageError" />
</template>
