// src/stores/products.js
import { defineStore } from 'pinia'
import axios from 'axios'

const API = 'http://localhost:3000/products'

export const useProductStore = defineStore('products', {
  state: () => ({ list: [] }),
  actions: {
    async fetch() {
      const res = await axios.get(API)
      this.list = res.data
    },
    async create(prod) {
      const res = await axios.post(API, prod)
      this.list.push(res.data)
      return res.data
    },
    async update(id, upd) {
      const res = await axios.put(`${API}/${id}`, upd)
      const i = this.list.findIndex((p) => p.id === id)
      if (i !== -1) this.list.splice(i, 1, res.data)
    },
    async remove(id) {
      await axios.delete(`${API}/${id}`)
      this.list = this.list.filter((p) => p.id !== id)
    },
  },
})
