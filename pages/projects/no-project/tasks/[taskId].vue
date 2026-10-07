<template><AdHocTaskDetail :key="String(route.params.taskId)" :task-id="String(route.params.taskId)" /></template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import AdHocTaskDetail from '~/components/projects/AdHocTaskDetail.vue'
const route = useRoute()
</script>
