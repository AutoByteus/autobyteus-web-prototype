<template>
  <IosShareExtension />
</template>

<script setup lang="ts">
import IosShareExtension from '~/components/ios/IosShareExtension.vue';

// ios-demo-mode-279 (design-only): the iOS share extension, as iOS shows it when another app shares to AutoByteus.
// `?text=` is what that other app shared (it stands in for the other app; nothing else reads it).
definePageMeta({ layout: false });
useHead({ title: 'Share to AutoByteus', meta: [{ name: 'theme-color', content: '#FFFFFF' }] });
</script>
