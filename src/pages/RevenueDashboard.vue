<template>
  <div class="dashboard">
    <DashboardHeader />

    <!-- 1. LIVE CARDS -->
    <div class="dashboard-grid">
      <Card title="Total Orders" :value="totalOrders" />
      <Card title="Total Revenue" :value="formattedRevenue" />
      <Card title="Top Category" :value="topCategory" />
    </div>

    <!-- 2. FILTERS & TABS -->
    <div class="controls">
      <!-- Category Dropdown -->
      <div class="filter-group">
        <label>Category:</label>
        <select v-model="selectedCategory">
          <option value="All">All</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>
      </div>
      <!-- Timeframe Tabs -->
      <div class="tabs">
        <button
          v-for="g in granularities"
          :key="g"
          :class="{ active: selectedGranularity === g }"
          @click="selectedGranularity = g"
        >
          {{ g }}
        </button>
      </div>

      <div>
        <q-card class="col-12 col-md-8 q-pa-md">
          <div class="text-h6">Total Products:</div>
          <div class="text-h6">{{ total }}</div>
        </q-card>
      </div>
      <div>
        <q-card class="col-12 col-md-8 q-pa-md">
          <div class="text-h6">Latest Added</div>
          <div v-if="latest">{{ latest.name }} — ${{ latest.price }}</div>
          <div v-else class="text-grey">No products yet</div>
        </q-card>
      </div>
    </div>

    <!-- 3. CHARTS -->
    <div class="charts">
      <BarChart :chartData="barChartData" :chartOptions="barChartOptions" />
      <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
    </div>

    <!-- 4. COMBINED -->
    <div class="combined-chart">
      <CombinedChart :data="combinedData" :options="combinedOptions" type="bar" />
    </div>
    <!-- 5. AG-GRID TABLE -->
    <div class="ag-grid-container" style="width: 100%; height: 400px; margin-top: 2rem">
      <ag-grid-vue
        class="ag-theme-alpine"
        :rowData="filteredProducts"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :animateRows="true"
        style="width: 100%; height: 100%"
      />
    </div>
  </div>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader.vue'
import Card from '@/components/CardComp.vue'
import BarChart from '@/components/charts/BarChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import CombinedChart from '@/components/charts/CombinedChart.vue'
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { AgGridVue } from 'ag-grid-vue3'

// Import ag-grid css
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default {
  components: { DashboardHeader, Card, BarChart, LineChart, CombinedChart, AgGridVue },

  setup() {
    const store = useProductStore()
    onMounted(() => store.fetch())

    const categories = ref(['Electronics', 'Fashion', 'Books', 'Home'])
    const granularities = ref(['Daily', 'Weekly', 'Monthly', 'Annually'])
    const selectedCategory = ref('All')
    const selectedGranularity = ref('Monthly')

    // Derived product stats
    const total = computed(() => store.list.length)
    const latest = computed(() => (store.list.length ? store.list[store.list.length - 1] : null))

    // Filter products based on selectedCategory (for the grid)
    const filteredProducts = computed(() => {
      if (selectedCategory.value === 'All') return store.list
      return store.list.filter((p) => p.category === selectedCategory.value)
    })

    // ag-grid column definitions
    const columnDefs = ref([
      { headerName: 'Name', field: 'name', sortable: true, filter: true, flex: 1 },
      { headerName: 'Category', field: 'category', sortable: true, filter: true, flex: 1 },
      { headerName: 'Price', field: 'price', sortable: true, filter: true, flex: 1 },
      { headerName: 'Stock', field: 'stock', sortable: true, filter: true, flex: 1 },
    ])

    const defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    }

    // Computed for cards and charts
    const barChartData = computed(() => {
      const labels = revenueData.map((item) => item.month)

      // Show only selected category or all
      const categoriesToShow =
        selectedCategory.value === 'All' ? categories.value : [selectedCategory.value]

      const datasets = categoriesToShow.map((category) => ({
        label: category,
        backgroundColor: getColor(category),
        data: revenueData.map((item) => item[category] || 0),
      }))

      return {
        labels,
        datasets,
      }
    })

    const lineChartData = computed(() => {
      if (selectedGranularity.value === 'Monthly') {
        return {
          labels: ordersData.map((o) => o.month),
          datasets: [
            {
              label: 'Orders',
              data: ordersData.map((o) => o.orders),
              borderColor: '#ffa726',
              fill: false,
            },
          ],
        }
      }
      return timeframeOrders[selectedGranularity.value]
    })

    const combinedData = computed(() => ({
      labels: barChartData.value.labels,
      datasets: [
        { ...barChartData.value.datasets[0], type: 'bar' },
        { ...lineChartData.value.datasets[0], type: 'line' },
      ],
    }))

    const totalRevenue = computed(() =>
      barChartData.value.datasets.flatMap((ds) => ds.data).reduce((sum, v) => sum + v, 0),
    )
    const formattedRevenue = computed(() => `$${totalRevenue.value.toLocaleString()}`)
    const totalOrders = computed(() =>
      lineChartData.value.datasets[0].data.reduce((sum, v) => sum + v, 0),
    )
    const topCategory = computed(() =>
      selectedCategory.value === 'All' ? 'All Categories' : selectedCategory.value,
    )

    // Static data for charts
    const revenueData = [
      { month: 'Jan', Electronics: 12000, Fashion: 8000, Books: 3000, Home: 5000 },
      { month: 'Feb', Electronics: 14000, Fashion: 8500, Books: 3200, Home: 6200 },
      { month: 'Mar', Electronics: 13000, Fashion: 8700, Books: 2900, Home: 5800 },
      { month: 'Apr', Electronics: 15000, Fashion: 9400, Books: 3100, Home: 6000 },
    ]
    const ordersData = [
      { month: 'Jan', orders: 320 },
      { month: 'Feb', orders: 450 },
      { month: 'Mar', orders: 380 },
      { month: 'Apr', orders: 520 },
    ]
    const timeframeRevenue = {
      Daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Revenue', data: [120, 200, 150, 80, 70, 110, 130], backgroundColor: '#42b983' },
        ],
      },
      Weekly: {
        labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4'],
        datasets: [
          { label: 'Revenue', data: [4000, 5000, 4500, 6000], backgroundColor: '#42b983' },
        ],
      },
      Annually: {
        labels: ['2021', '2022', '2023', '2024'],
        datasets: [
          { label: 'Revenue', data: [150000, 175000, 160000, 190000], backgroundColor: '#42b983' },
        ],
      },
    }
    const timeframeOrders = {
      Daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Orders',
            data: [30, 40, 25, 20, 15, 35, 45],
            borderColor: '#ffa726',
            fill: false,
          },
        ],
      },
      Weekly: {
        labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4'],
        datasets: [
          { label: 'Orders', data: [320, 450, 380, 520], borderColor: '#ffa726', fill: false },
        ],
      },
      Annually: {
        labels: ['2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Orders',
            data: [35000, 48000, 42000, 55000],
            borderColor: '#ffa726',
            fill: false,
          },
        ],
      },
    }

    const barChartOptions = {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } },
    }
    const lineChartOptions = {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } },
    }
    const combinedOptions = {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } },
    }

    const getColor = (cat) =>
      ({ Electronics: '#42b983', Fashion: '#ffa726', Books: '#f06292', Home: '#7e57c2' })[cat] ||
      '#999'

    return {
      categories,
      granularities,
      selectedCategory,
      selectedGranularity,
      total,
      latest,
      barChartData,
      lineChartData,
      combinedData,
      formattedRevenue,
      totalOrders,
      topCategory,
      barChartOptions,
      lineChartOptions,
      combinedOptions,
      getColor,
      filteredProducts,
      columnDefs,
      defaultColDef,
      timeframeRevenue,
    }
  },
}
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-height: 100vh; /* Restrict to viewport height */
}

/* Cards grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Controls */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}
.filter-group select {
  margin-left: 0.5rem;
}
.tabs {
  display: flex;
  gap: 0.5rem;
}
.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: #eee;
  cursor: pointer;
  border-radius: 4px;
}
.tabs button.active {
  background: #42b983;
  color: #fff;
}

/* Charts grid */
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.combined-chart {
  width: 100%;
}

/* ag-grid container */
.ag-grid-container {
  height: 400px;
  width: 100%;
}

.q-pa-md {
  margin-top: 20px;
}
/* Mobile */
@media (max-width: 768px) {
  .charts {
    grid-template-columns: 1fr;
  }
}
</style>
