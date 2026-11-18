<template>
  <AndroidAppScreens platform="ios" />
</template>

<script setup lang="ts">
import AndroidAppScreens from '~/components/android/AndroidAppScreens.vue';

// ios-demo-mode-279 (design-only): the iOS app's native first screen. It is the Android app's approved start screen
// (autobyteus-395; on iOS it is autobyteus-395 FU-001) with "Try demo" under Scan. The app draws it around the node pages.
definePageMeta({ layout: false });

useHead({
  title: 'AutoByteus iOS app',
  meta: [{ name: 'theme-color', content: '#FFFFFF' }],
});
</script>
