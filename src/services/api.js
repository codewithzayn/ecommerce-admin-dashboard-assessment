// src/services/api.js
import axios from 'axios'

const API_BASE = 'http://localhost:3001'

// PRODUCTS
export const getProducts = async () => {
  const { data } = await axios.get(`${API_BASE}/products`)
  return data
}

export const addProduct = async (product) => {
  const { data } = await axios.post(`${API_BASE}/products`, product)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/products/${id}`)
  return data
}

export async function updateProductStock(id, newStock) {
  return await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: newStock }),
  }).then((res) => res.json())
}
