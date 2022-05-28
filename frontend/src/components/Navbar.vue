<script setup lang="ts">
import { ConnectWalletButton } from 'vue-connect-wallet'
</script>

<template>
    <nav class="flex justify-between items-center p-5">
        <h1>Crossfire</h1>
        <ul class="list-none flex space-x-2 items-center">
            <li>
                <ConnectWalletButton address="0x08DcE649f86AF45dA8648FaD31D1C33A617C52d1" />
            </li>
        </ul>
    </nav>
</template>