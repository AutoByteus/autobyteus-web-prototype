<template><ProjectEditorPage :project-id="String(route.params.id)" /></template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import ProjectEditorPage from '~/components/projects/ProjectEditorPage.vue'
const route = useRoute()
</script>
