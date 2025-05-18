<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { defineProps } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// register the chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// declare props as plain JS (no TS)
const { chartData, chartOptions } = defineProps({
  chartData: { type: Object, required: true },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      plugins: { legend: { display: true } },
    }),
  },
})
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
