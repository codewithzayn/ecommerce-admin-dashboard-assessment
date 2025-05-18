<!-- src/components/charts/CombinedChart.vue -->
<template>
  <Chart :data="data" :options="options" :type="type" />
</template>

<script setup>
import { defineProps } from 'vue'
import { Chart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js'

// register all needed pieces, including Filler
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
)

const { data, options, type } = defineProps({
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({ responsive: true }) },
  type: { type: String, default: 'bar' },
})
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
