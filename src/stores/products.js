// src/stores/products.js
import { defineStore } from 'pinia'
// import axios from 'axios'

// const API = 'http://localhost:3000/products'

export const useProductStore = defineStore('products', {
  state: () => ({
    list: JSON.parse(localStorage.getItem('products') || '[]'),
  }),
  actions: {
    async fetch() {
      // Simulate API call
      this.list = JSON.parse(localStorage.getItem('products') || '[]')
    },
    async create(prod) {
      // Simulate backend-generated ID
      // Generate incremental numeric ID:
      if (this.list.length === 0) {
        prod.id = 1
      } else {
        // Get max current id and add 1
        const maxId = Math.max(...this.list.map((p) => p.id))
        prod.id = maxId + 1
      }

      this.list.push(prod)
      localStorage.setItem('products', JSON.stringify(this.list))
      return prod
    },
    async update(id, upd) {
      const i = this.list.findIndex((p) => p.id === id)
      if (i !== -1) {
        this.list[i] = { ...this.list[i], ...upd }
        localStorage.setItem('products', JSON.stringify(this.list))
      }
    },
    async remove(id) {
      this.list = this.list.filter((p) => p.id !== id)
      localStorage.setItem('products', JSON.stringify(this.list))
    },
  },
})
