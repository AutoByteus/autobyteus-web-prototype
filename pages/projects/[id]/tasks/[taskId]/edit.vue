<template><ProjectTaskPage :key="`${projectId}/${taskId}`" :project-id="projectId" :task-id="taskId" mode="edit" /></template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProjectTaskPage from '~/components/projects/ProjectTaskPage.vue'
const route = useRoute()
const projectId = computed(() => String(route.params.id))
const taskId = computed(() => String(route.params.taskId))
</script>
