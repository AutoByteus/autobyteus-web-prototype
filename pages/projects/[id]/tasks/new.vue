<template><ProjectTaskPage :key="projectId" :project-id="projectId" mode="create" /></template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProjectTaskPage from '~/components/projects/ProjectTaskPage.vue'
const route = useRoute()
const projectId = computed(() => String(route.params.id))
</script>
