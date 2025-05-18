<template>
  <q-card class="q-pa-md q-mx-auto" style="max-width: 600px">
    <q-form @submit.prevent="onSubmit">
      <div class="text-h6 q-mb-md">Add New Product</div>
      <q-input v-model="name" label="Name" filled required class="q-mb-md" />
      <q-input v-model.number="price" label="Price" type="number" filled required class="q-mb-md" />
      <q-input v-model.number="stock" label="Stock" type="number" filled required class="q-mb-md" />
      <q-input v-model="description" label="Description" type="textarea" filled class="q-mb-md" />

      <!-- File Upload with Preview -->
      <q-input type="file" filled @update:model-value="onFile" class="q-mb-md" />
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Image Preview"
        class="q-mb-md"
        style="max-width: 100%; max-height: 200px; object-fit: contain"
      />

      <q-btn type="submit" color="primary" label="Add Product" class="full-width" />
    </q-form>
  </q-card>

  <!-- ag-grid below the form -->
  <div
    class="ag-theme-alpine q-mt-xl"
    style="width: 100%; max-width: 900px; height: 400px; margin: auto"
  >
    <ag-grid-vue
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="products"
      :defaultColDef="defaultColDef"
      rowSelection="single"
      animateRows
      style="width: 100%; height: 100%"
    ></ag-grid-vue>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '@/stores/products'
import { useQuasar } from 'quasar'

// Import ag-grid-vue3
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridVue } from 'ag-grid-vue3'

const name = ref('')
const price = ref(0)
const stock = ref(0)
const description = ref('')
const file = ref(null)
const previewUrl = ref(null)
const $q = useQuasar()
const store = useProductStore()

const products = ref([]) // data for ag-grid

// ag-grid column definitions
const columnDefs = [
  { headerName: 'Name', field: 'name', sortable: true, filter: true },
  { headerName: 'Price', field: 'price', sortable: true, filter: true },
  { headerName: 'Stock', field: 'stock', sortable: true, filter: true },
  { headerName: 'Description', field: 'description', sortable: false, filter: true },
  {
    headerName: 'Image',
    field: 'image',
    cellRenderer: (params) => {
      if (params.value)
        return `<img src="/images/${params.value}" style="width:40px; height:40px; object-fit:contain; border-radius: 4px"/>`
      return ''
    },
  },
]

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
}

// Handle file selection and generate preview URL
const onFile = (files) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  file.value = files && files.length ? files[0] : null

  // ✅ Clean file name (replace spaces and extra dots)
  if (file.value) {
    file.value = new File([file.value], file.value.name.replace(/\s+/g, '-').replace(/\.+/g, '.'), {
      type: file.value.type,
    })
    previewUrl.value = URL.createObjectURL(file.value)
  } else {
    previewUrl.value = null
  }
}

const onSubmit = async () => {
  const missing = []
  if (!name.value) missing.push('Name')
  if (!price.value) missing.push('Price')
  if (!stock.value) missing.push('Stock')
  if (!file.value) missing.push('Image')

  if (missing.length) {
    $q.notify({ type: 'negative', message: `${missing.join(', ')} required.` })
    return
  }

  const prod = {
    name: name.value,
    price: price.value,
    stock: stock.value,
    description: description.value,
    image: file.value.name, // ✅ just the file name
  }

  await store.create(prod)
  console.log('✅ Product added:', prod)
  $q.notify({ type: 'positive', message: 'Product added successfully!' })

  // Reset form
  name.value = ''
  price.value = 0
  stock.value = 0
  description.value = ''
  file.value = null
  previewUrl.value = null
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
