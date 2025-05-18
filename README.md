🛒 Ecommerce Admin Dashboard

An admin dashboard built with Vue 3, Quasar, Vuetify, and AG Grid to manage products, orders, and users in an ecommerce system. It includes dynamic charts, product listings, and simulated backend data using `json-server`.
🚀 Features

- Product Management (Add, Delete, Update Stock)
- Responsive Design using Quasar & Vuetify
- AG Grid for interactive tables
- Chart.js for analytics dashboards
- Pinia for state management
- Vue Router for page navigation
- JSON Server as a mock backend API
  🧰 Tech Stack

Frontend: Vue 3, Vuetify, Quasar, Pinia, Vue Router
UI/UX: Vuetify, Chart.js, AG Grid
Dev Tools: Vite, ESLint, Prettier
Mock API: JSON Server

📦 Installation

1. Clone the repo

git clone https://github.com/your-username/ecommerce-admin-dashboard.git
cd ecommerce-admin-dashboard 2. Install dependencies

npm install

---

🔧 Running the App Locally

1. Start the Mock Backend (JSON Server)
   npx json-server --watch db.json --port 3001
   ✅ Make sure you have a db.json file in the root directory with initial data (products, etc.)
2. Start the Development Server
   npm run dev
   Visit the app at: http://localhost:5173

---

🛠 Project Structure
src/
│
├── components/ # Reusable Vue components
├── pages/ # Page views (dashboard, products, etc.)
├── services/
│ └── api.js # Axios-based API handlers for CRUD operations
├── store/ # Pinia state management
├── router/ # Vue Router routes
└── assets/ # Static assets and styles

---

📡 API Reference (src/services/api.js)
All product-related requests are made to:
http://localhost:3001/products
Example Endpoints:
• GET /products – Fetch all products
• POST /products – Add a new product
• DELETE /products/:id – Delete a product
• PUT /api/products/:id – Update product stock (custom route)

---

🧪 Linting & Formatting
Lint and fix issues:
npm run lint
Format using Prettier:
npm run format

---

📦 Build for Production
npm run build
To preview the production build:
npm run preview

---

🤝 Contributing

1. Fork the repo
2. Create your branch: git checkout -b feature/your-feature-name
3. Commit your changes: git commit -m 'Add your message'
4. Push and open a PR

---

📸 Screenshots
(Add screenshots here showing your dashboard UI, product table, and charts for better understanding.)

---

📄 License
This project is licensed under the MIT License.

---

yaml
Let me know if you'd like help generating the `db.json` file or inserting screenshots into the README.
