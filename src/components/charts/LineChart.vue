<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { defineProps } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// register the chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

// declare props as plain JS
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
