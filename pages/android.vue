<template>
  <AndroidAppScreens />
</template>

<script setup lang="ts">
import AndroidAppScreens from '~/components/android/AndroidAppScreens.vue';

// one-step-phone-pairing (design-only): the Android app's native start screen. The app draws it around the node pages.
definePageMeta({ layout: false });

useHead({
  title: 'AutoByteus Android app',
  meta: [{ name: 'theme-color', content: '#FFFFFF' }],
});
</script>
