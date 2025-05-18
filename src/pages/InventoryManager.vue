<template>
  <div class="responsive-container">
    <h2 class="text-h6 text-h5-md q-mb-sm q-mb-md-md">Inventory Management</h2>

    <!-- Search Input -->
    <div class="search-container">
      <q-input
        dense
        filled
        v-model="search"
        debounce="300"
        placeholder="Search products..."
        @update:model-value="filterProducts"
        class="full-width"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Responsive Table Wrapper -->
    <div class="responsive-table-wrapper">
      <q-table
        :rows="filteredProducts"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination="{ rowsPerPage: 10 }"
        :filter="search"
        :rows-per-page-options="[10, 20, 50]"
        class="bg-white shadow-2 rounded-borders"
      >
        <!-- Stock Input Cell -->
        <template v-slot:body-cell-stock="props">
          <q-td :props="props" class="flex items-center">
            <q-input
              dense
              v-model.number="props.row.stock"
              type="number"
              @blur="updateStock(props.row)"
              class="q-mx-sm"
              style="max-width: 80px; width: 100%"
            />
            <q-badge v-if="props.row.stock < 10" color="red" class="q-ml-sm" label="Low" />
          </q-td>
        </template>

        <!-- Forecast Cell -->
        <template v-slot:body-cell-forecast="props">
          <q-td :props="props">
            <q-badge color="orange" v-if="props.row.stock < 15">Restock Soon</q-badge>
            <q-badge color="green" v-else>Stock OK</q-badge>
          </q-td>
        </template>

        <!-- Image Cell: use getImageSrc helper -->
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <q-img
              :src="getImageSrc(props.row.image)"
              class="product-img"
              fit="cover"
              spinner-color="grey-5"
              alt="product"
            />
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="row items-center q-gutter-sm">
            <q-btn icon="edit" flat dense @click="startEdit(props.row)" />
            <q-btn icon="delete" flat dense color="negative" @click="remove(props.row.id)" />
          </q-td>
        </template>
      </q-table>

      <!-- AG GRID BELOW -->
      <div class="ag-theme-alpine" style="margin-top: 40px; height: 400px; width: 100%">
        <AgGridVue
          :rowData="agRowData"
          :columnDefs="agColumnDefs"
          :pagination="true"
          :paginationPageSize="10"
        />
      </div>

      <!-- Edit Dialog -->
      <q-dialog v-model="editing">
        <q-card class="q-pa-md" style="min-width: 300px">
          <div class="text-h6 q-mb-md">Edit Product</div>
          <q-form @submit.prevent="saveEdit">
            <q-input v-model="editForm.name" label="Name" filled class="q-mb-md" />
            <q-input
              v-model.number="editForm.price"
              label="Price"
              type="number"
              filled
              class="q-mb-md"
            />
            <q-input
              v-model.number="editForm.stock"
              label="Stock"
              type="number"
              filled
              class="q-mb-md"
            />
            <div class="q-mt-md text-right">
              <q-btn flat label="Cancel" color="grey" @click="editing = false" class="q-mr-sm" />
              <q-btn type="submit" label="Save" color="primary" />
            </div>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '@/stores/products'

// Import AgGridVue & styles
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default {
  components: {
    AgGridVue,
  },
  setup() {
    const store = useProductStore()
    const search = ref('')
    const filteredProducts = ref([])
    const editing = ref(false)
    const editForm = ref({ id: null, name: '', price: 0, stock: 0 })
    const $q = useQuasar()

    const columns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'name', label: 'Product Name', field: 'name', sortable: true },
      { name: 'description', label: 'Description', field: 'description' },
      { name: 'category', label: 'Category', field: 'category', sortable: true },
      { name: 'price', label: 'Price', field: 'price', sortable: true },
      { name: 'stock', label: 'Stock', field: 'stock', sortable: true },
      { name: 'forecast', label: 'Forecast', field: 'forecast' },
      { name: 'image', label: 'Image', field: 'image' },
      { name: 'actions', label: 'Actions', field: 'actions' },
    ]

    // AG Grid column definitions (similar to your q-table columns but simplified)
    const agColumnDefs = ref([
      {
        field: 'id',
        headerName: 'ID',
        sortable: true,
        filter: true,
        checkboxSelection: true,
        width: 90,
      },
      { field: 'name', headerName: 'Product Name', sortable: true, filter: true },
      { field: 'description', headerName: 'Description', sortable: true, filter: true },
      { field: 'category', headerName: 'Category', sortable: true, filter: true },
      { field: 'price', headerName: 'Price', sortable: true, filter: true },
      { field: 'stock', headerName: 'Stock', sortable: true, filter: true },
      // For forecast and image you can add cellRenderers if needed later
    ])

    // AG Grid row data, derived from store.list
    const agRowData = ref([])

    // Filter products by name
    const filterProducts = () => {
      filteredProducts.value = store.list.filter((p) =>
        p.name.toLowerCase().includes(search.value.toLowerCase()),
      )
      // Also update agGrid row data to sync with filteredProducts
      agRowData.value = filteredProducts.value
    }

    // Update stock
    const updateStock = async (product) => {
      try {
        await store.update(product.id, { stock: product.stock })
        $q.notify({ type: 'positive', message: `Stock for ${product.name} updated!` })
      } catch {
        $q.notify({ type: 'negative', message: 'Failed to update stock.' })
      }
    }

    // Remove product
    const remove = async (id) => {
      try {
        await store.remove(id)
        filteredProducts.value = store.list.filter((p) =>
          p.name.toLowerCase().includes(search.value.toLowerCase()),
        )
        agRowData.value = filteredProducts.value
        $q.notify({ type: 'positive', message: 'Product deleted.' })
      } catch {
        $q.notify({ type: 'negative', message: 'Failed to delete product.' })
      }
    }

    // Start edit
    const startEdit = (row) => {
      editForm.value = { ...row }
      editing.value = true
    }

    // Save edit
    const saveEdit = async () => {
      await store.update(editForm.value.id, editForm.value)
      editing.value = false
    }

    // Generate image src helper
    const getImageSrc = (img) => {
      if (!img) return ''
      if (img instanceof File) return URL.createObjectURL(img)
      if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
        return img
      }

      // Normalize and clean the path
      const cleanedPath = img.replace(/\s+/g, '-').replace(/\.+/g, '.')

      return `/images/${cleanedPath}`
    }

    onMounted(async () => {
      await store.fetch()
      filteredProducts.value = store.list
    })

    return {
      search,
      filteredProducts,
      columns,
      filterProducts,
      updateStock,
      remove,
      editing,
      editForm,
      startEdit,
      saveEdit,
      getImageSrc,
      agColumnDefs,
      agRowData,
    }
  },
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 16px;
}
.responsive-table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.product-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
.responsive-container {
  padding: 8px;
}

.q-table th,
.q-table td {
  padding: 0px 23px;
  background-color: inherit;
}
@media (min-width: 600px) {
  .responsive-container {
    padding: 0;
  }
}
@media (min-width: 1024px) {
  .responsive-container {
    padding: 24px;
  }
}
@media (max-width: 768px) {
  .responsive-table-wrapper .q-table {
    max-width: 600px;
  }
  .responsive-table-wrapper {
    max-width: 600px;
  }
  .search-container {
    max-width: 600px;
  }
  .product-img {
    width: 35px;
    height: 35px;
  }
}
/* AG Grid styling override if needed */
.ag-theme-alpine {
  box-shadow: 0 0 5px rgb(0 0 0 / 0.1);
  border-radius: 6px;
}
</style>
