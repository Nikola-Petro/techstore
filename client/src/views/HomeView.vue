<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllDocs, addDoc, updateDoc, deleteDoc } from '../stores/myStore.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const products = ref([])
const searchQuery = ref('')
const selectedCategory = ref('All Products')
const viewMode = ref('table')

const addDialog = ref(false)
const editDialog = ref(false)
const selectedProduct = ref(null)

const newProduct = ref({
  name: '',
  category: '',
  price: '',
  stock: '',
  status: 'In Stock',
  description: ''
})

const categories = [
  'All Products',
  'Smartphones',
  'Laptops',
  'Accessories',
  'Audio',
  'Tablets',
  'Wearables',
  'Gaming',
  'Networking',
  'Storage',
  'Monitors',
  'Printers',
  'Cameras',
  'Smart Home',
  'Security'
]

const totalProducts = computed(() => products.value.length)
const totalValue = computed(() => {
  return products.value.reduce((sum, product) => {
    const price = parseFloat(product.price) || 0
    const stock = parseInt(product.stock) || 0
    return sum + (price * stock)
  }, 0)
})
const lowStock = computed(() => {
  return products.value.filter(product => parseInt(product.stock) < 10).length
})
const uniqueCategories = computed(() => {
  return [...new Set(products.value.map(product => product.category))]
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All Products' || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const getStatusColor = (status) => {
  return status === 'In Stock' ? 'positive' : 'warning'
}

const getCategoryColor = (category) => {
  const colors = {
    'Smartphones': 'primary',
    'Laptops': 'purple',
    'Audio': 'orange',
    'Accessories': 'teal',
    'Tablets': 'indigo',
    'Wearables': 'deep-orange',
    'Gaming': 'red',
    'Networking': 'cyan',
    'Storage': 'blue-grey',
    'Monitors': 'deep-purple',
    'Printers': 'brown',
    'Cameras': 'pink',
    'Smart Home': 'green',
    'Security': 'amber'
  }
  return colors[category] || 'grey'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openAddDialog = () => {
  newProduct.value = {
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'In Stock',
    description: ''
  }
  addDialog.value = true
}

const openEditDialog = (product) => {
  selectedProduct.value = { ...product }
  editDialog.value = true
}

const handleAdd = async () => {
  try {
    const product = {
      ...newProduct.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await addDoc(product)
    products.value = await getAllDocs()
    addDialog.value = false
    $q.notify({
      color: 'positive',
      message: 'Product added successfully'
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error adding product'
    })
  }
}

const handleEdit = async () => {
  try {
    const product = {
      ...selectedProduct.value,
      updatedAt: new Date().toISOString()
    }
    await updateDoc(product)
    products.value = await getAllDocs()
    editDialog.value = false
    $q.notify({
      color: 'positive',
      message: 'Product updated successfully'
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error updating product'
    })
  }
}
const handleDelete = async (product) => {
  try {
    
      await deleteDoc(product)
      products.value = await getAllDocs()
      $q.notify({
        color: 'positive',
        message: 'Product deleted successfully'
      })
  } catch (error) {
    console.error('Delete error:', error)
    $q.notify({
      color: 'negative',
      message: 'Error deleting product'
    })
  }
}

onMounted(async () => {
  products.value = await getAllDocs()
})
</script>

<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h3 q-mb-sm">
          <span class="text-primary">Tech</span>
          <span class="text-weight-bold">Stock</span>
          <span class="text-purple">Manager</span>
        </h1>
        <div class="text-subtitle1 text-grey-7">Complete inventory management for your electronics store</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn color="primary" icon="add" label="Add New Product" @click="openAddDialog" />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white rounded-borders">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="inventory_2" color="primary" size="2rem" />
              </div>
              <div class="col">
                <div class="text-subtitle2 text-grey-7">Total Products</div>
                <div class="text-h6">{{ totalProducts }}</div>
                <div class="text-caption text-grey">In inventory</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white rounded-borders">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="payments" color="primary" size="2rem" />
              </div>
              <div class="col">
                <div class="text-subtitle2 text-grey-7">Total Value</div>
                <div class="text-h6">${{ totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                <div class="text-caption text-grey">Inventory value</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white rounded-borders">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="headphones" color="warning" size="2rem" />
              </div>
              <div class="col">
                <div class="text-subtitle2 text-grey-7">Low Stock</div>
                <div class="text-h6">{{ lowStock }}</div>
                <div class="text-caption text-grey">Products to reorder</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white rounded-borders">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="category" color="primary" size="2rem" />
              </div>
              <div class="col">
                <div class="text-subtitle2 text-grey-7">Categories</div>
                <div class="text-h6">{{ uniqueCategories.length }}</div>
                <div class="text-caption text-grey">Product categories</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="row items-center q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-tabs
          v-model="selectedCategory"
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="All Products" label="All Products" />
          <q-tab v-for="category in uniqueCategories" :key="category" :name="category" :label="category" />
        </q-tabs>
      </div>
      <div class="col-12 col-md-6">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="searchQuery"
              dense
              outlined
              placeholder="Search products..."
              class="full-width"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              v-model="selectedCategory"
              :options="['All Products', ...uniqueCategories]"
              outlined
              dense
              class="full-width"
            />
          </div>
        </div>
      </div>
    </div>

    <q-table
      :rows="filteredProducts"
      :columns="[
        { name: 'name', label: 'Product Name', field: 'name', sortable: true },
        { name: 'category', label: 'Category', field: 'category', sortable: true },
        { name: 'price', label: 'Price', field: 'price', sortable: true, format: (val) => `$${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { name: 'stock', label: 'Stock', field: 'stock', sortable: true },
        { name: 'status', label: 'Status', field: 'status', sortable: true },
        { name: 'updatedAt', label: 'Last Updated', field: 'updatedAt', sortable: true, format: (val) => formatDate(val) },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
      ]"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      flat
      bordered
      class="bg-white"
      @row-click="(evt, row) => openEditDialog(row)"
    >
      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-chip
            :color="getCategoryColor(props.row.category)"
            text-color="white"
            dense
          >
            {{ props.row.category }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="getStatusColor(props.row.status)"
            text-color="white"
            dense
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn flat round icon="delete" color="negative" @click.stop="handleDelete(props.row)">
              <q-tooltip>Delete Product</q-tooltip>
            </q-btn>
          </q-btn-group>
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon name="inbox" size="2em" />
          <span>
            No products found
          </span>
        </div>
      </template>
    </q-table>

    <!-- Add Product Dialog -->
    <q-dialog v-model="addDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Add New Product</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="handleAdd" class="q-gutter-md">
            <q-input
              v-model="newProduct.name"
              label="Product Name"
              :rules="[val => !!val || 'Name is required']"
            />
            <q-select
              v-model="newProduct.category"
              :options="categories.filter(cat => cat !== 'All Products')"
              label="Category"
              :rules="[val => !!val || 'Category is required']"
            />
            <q-input
              v-model="newProduct.price"
              label="Price"
              type="number"
              step="0.01"
              :rules="[val => !!val || 'Price is required']"
            />
            <q-input
              v-model="newProduct.stock"
              label="Stock"
              type="number"
              :rules="[val => !!val || 'Stock is required']"
            />
            <q-select
              v-model="newProduct.status"
              :options="['In Stock', 'Low Stock']"
              label="Status"
              :rules="[val => !!val || 'Status is required']"
            />
            <q-input
              v-model="newProduct.description"
              label="Description"
              type="textarea"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn label="Add Product" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Product Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Product</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="handleEdit" class="q-gutter-md">
            <q-input
              v-model="selectedProduct.name"
              label="Product Name"
              :rules="[val => !!val || 'Name is required']"
            />
            <q-select
              v-model="selectedProduct.category"
              :options="categories.filter(cat => cat !== 'All Products')"
              label="Category"
              :rules="[val => !!val || 'Category is required']"
            />
            <q-input
              v-model="selectedProduct.price"
              label="Price"
              type="number"
              step="0.01"
              :rules="[val => !!val || 'Price is required']"
            />
            <q-input
              v-model="selectedProduct.stock"
              label="Stock"
              type="number"
              :rules="[val => !!val || 'Stock is required']"
            />
            <q-select
              v-model="selectedProduct.status"
              :options="['In Stock', 'Low Stock']"
              label="Status"
              :rules="[val => !!val || 'Status is required']"
            />
            <q-input
              v-model="selectedProduct.description"
              label="Description"
              type="textarea"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn label="Save Changes" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style lang="scss">
.q-card {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}

.q-table {
  border-radius: 8px;
  overflow: hidden;
}

.q-tab {
  text-transform: none;
  font-weight: 500;
}

.q-chip {
  font-weight: 500;
}
</style>
