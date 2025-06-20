# 🚗 Vehicle Management System

A modern web application for tracking and managing vehicle data, users, and their assignments. It offers an interactive dashboard, real-time map integration, and full CRUD capabilities for Superadmins, with user-friendly UX and strong architectural structure.

## 🌐 Live Demo

👉 [Visit the Application](https://si-blue-frontend.onrender.com/)

---

## ✨ Features

- **📊 Interactive Dashboard**  
  View total vehicles, customers, sold units, and a map view of active listings.

- **🚘 Vehicle Management (CRUD)**  
  - Add/edit/delete vehicles (Superadmin only)  
  - Assign/unassign vehicles to customers  
  - Search & filter functionality  
  - View detailed listings in a tabular interface

- **🗺️ Map Integration**  
  - Visualize vehicles live on Google Maps  
  - Clickable markers lead to detailed vehicle info  
  - Instant updates on vehicle creation

- **👥 Customer Management**  
  - View customer list  
  - Unassign vehicles and delete records

- **🛡️ User Management (Superadmin-only)**  
  - Add, deactivate, or remove users  
  - Role-based access control

- **🔔 Notifications**  
  - Vehicle assign/unassign & user deactivation alerts for relevant users

- **📜 User Activity Log**  
  - Track actions like vehicle/customer CRUD, assignments, etc.

- **🙍 User Profile Management**  
  - Update personal information and upload avatar

- **✅ Robust Form Handling**  
  - Zod + React Hook Form for strict validation  
  - Clean and accessible forms

---

## ⚙️ Tech Stack

| Layer            | Technology                                                                 |
|------------------|-----------------------------------------------------------------------------|
| 🖼️ Frontend      | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| ⚡ Build Tool     | [Vite](https://vitejs.dev/)                                                 |
| 📦 State Mgmt     | [Zustand](https://zustand-demo.pmnd.rs/)                                    |
| 🔁 Data Fetching | [@tanstack/react-query](https://tanstack.com/query/latest)                  |
| 🎨 Styling        | [Tailwind CSS](https://tailwindcss.com/)                                   |
| 🧱 UI Components | [Radix UI](https://www.radix-ui.com/primitives) + [Lucide Icons](https://lucide.dev/) |
| 📝 Forms         | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)     |
| 🗺 Maps          | [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/)      |
| 🧭 Routing       | [React Router](https://reactrouter.com/en/main)                             |
| 🕓 Dates         | [date-fns](https://date-fns.org/), [react-day-picker](https://react-day-picker.js.org/) |

---

## 📁 Folder Structure

```bash
src/
├── api/                    # API utility functions (e.g., fetch clients, Axios instances)
├── app/
│   ├── styles/             # Global styles (Tailwind configs, CSS)
│   └── App.tsx            # Root application entry
├── assets/                # Static assets (SVGs, PNGs, WebP, etc.)
│   └── svgIconComponents/ # Icon components
├── components/            # Reusable UI components
│   ├── atom/              # Smallest, indivisible UI units (e.g., buttons, inputs) 
│   ├── molecule/          # Groups of atoms (e.g., forms, dropdowns) 
│   └── organism/          # Larger UI structures (e.g., tables, cards)
├── hooks/                 # Custom React hooks (e.g., useVehicles, useAuth)
├── layouts/               # Page layouts and route wrappers
├── pages/                 # Route-based components (Dashboard, Vehicles, etc.)
├── routes/                # React Router configs
├── stores/                # Zustand stores for global state
├── types/                 # Global TypeScript interfaces/types
├── utils/                 # Utility functions (e.g., formatters, validators)
├── main.tsx               # Main React DOM rendering
└── vite-env.d.ts          # Vite-specific TypeScript definitions
```

### 📦 Design Pattern: Atomic Design + Feature Segregation

- **Atomic Design**: `components/atom`, `molecule`, `organism` create a UI hierarchy.
- **Feature-first**: Pages + hooks + stores follow business domain groupings.
- **Zustand** used instead of Redux for simplicity and performance.
- **Vite** ensures fast dev & HMR.

---

## 🛠 Getting Started

### ✅ Prerequisites

- Node.js `v18+`
- npm or Yarn

### 📥 Installation

```bash
git clone https://github.com/SimplyTechnologies/SI-Blue-Frontend.git
cd SI-Blue-Frontend
npm install  # or yarn install
```

### 🔐 Environment Setup

Create a `.env` file at the root of the project:

```env
VITE_GOOGLE_API_KEY=your_google_maps_api_key
VITE_MAP_ID=your_google_map_id
VITE_API_URL=https://your-backend-api.com
```

---

## 🙌 Acknowledgements

Thanks to open source tools and libraries that power this project:  
Zustand, React Hook Form, Zod, Tailwind, Lucide, TanStack Query, Google Maps, and more.

Special thanks to **Simply Technologies** for organizing the internship and providing the opportunity to build this project.