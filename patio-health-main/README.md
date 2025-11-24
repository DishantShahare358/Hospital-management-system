# 🏥 Hospital Management System - Complete React Application

A comprehensive, modern Hospital Management System built with React, TypeScript, TailwindCSS, Framer Motion, and shadcn/ui components.

## ✨ Features

### 🔐 Authentication
- **Beautiful Login Page** with role dropdown, password visibility toggle, and glassmorphic design
- **Complete Signup Page** with all required fields (Name, Email, Password, Confirm Password, Role, Phone, Date of Birth)
- Role-based authentication for 6 different user types
- Protected routes with JWT mock authentication
- Forgot password link

### 👥 Role-Based Dashboards (6 Complete Dashboards)

#### 1️⃣ **Hospital Administrator Dashboard**
- Total doctors, nurses, patients, and revenue statistics
- Hospital statistics with charts (admissions, discharges, bed occupancy)
- Staff management (CRUD operations)
- Department management
- Billing overview
- Appointment management
- Notifications & settings panel

#### 2️⃣ **Doctor Dashboard**
- Schedule overview with calendar
- Today's appointments list
- Patient medical records management
- Prescriptions page
- Write diagnosis interface
- Lab test requests
- Patient vitals charts
- Messages & notifications

#### 3️⃣ **Nurse Dashboard**
- Assigned patients list
- Medication schedule
- Shift schedule
- Vital signs recording UI
- Bed allocation overview
- Emergency alert system

#### 4️⃣ **Receptionist Dashboard**
- Patient check-in/check-out
- Appointment booking interface
- Upcoming appointments
- Room allocation management
- Visitor registration

#### 5️⃣ **Patient Dashboard**
- View and book appointments
- Download prescriptions
- Medical reports & lab results
- Billing & payment history
- Chat with doctor
- Health records access
- Profile settings

#### 6️⃣ **Lab Technician Dashboard**
- Lab test requests list
- Upload results interface
- Sample tracking
- Report generation UI
- Test status management

### 🎨 UI/UX Features
- **Fully Responsive** design for all screen sizes
- **Modern Glassmorphic & Neumorphic** UI elements
- **Dark & Light Theme Toggle** with smooth transitions
- **Beautiful Animations** using Framer Motion
- **Reusable Components**: buttons, cards, modals, sidebar, topbar, tables, forms
- **Charts & Graphs** using Recharts
- **Clean Navigation** with dynamic sidebar
- **Mobile Responsive** drawer navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher) or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd patio-health-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Demo Accounts

You can use these demo accounts to test different roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | dr.smith@hospital.com | doctor123 |
| Nurse | nurse.johnson@hospital.com | nurse123 |
| Receptionist | receptionist@hospital.com | receptionist123 |
| Patient | patient@example.com | patient123 |
| Lab Technician | labtech@hospital.com | labtech123 |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── charts/          # Chart components
│   ├── cards/           # Card components
│   └── layout/          # Layout components (Sidebar, Topbar)
├── pages/
│   ├── auth/            # Login & Signup pages
│   ├── admin/           # Admin dashboard
│   ├── doctor/          # Doctor dashboard
│   ├── nurse/           # Nurse dashboard
│   ├── receptionist/    # Receptionist dashboard
│   ├── patient/         # Patient dashboard
│   └── lab/             # Lab Technician dashboard
├── context/             # React Context (Auth)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── data/                # Dummy data
├── types/               # TypeScript types
└── services/            # API services (mock)
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **shadcn/ui** - UI component library
- **React Router** - Routing
- **Recharts** - Charts and graphs
- **next-themes** - Theme management
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 🎯 Key Features Implementation

### Authentication
- Role-based login with dropdown selection
- Password visibility toggle
- Form validation
- Toast notifications
- Protected routes

### Dashboards
- Real-time statistics cards
- Interactive charts and graphs
- Data tables with sorting and filtering
- CRUD operations UI
- Responsive grid layouts

### Theme System
- Light and dark mode support
- Smooth theme transitions
- System preference detection

## 📦 Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 Notes

- This is a frontend-only application with mock API
- All data is stored in localStorage for demo purposes
- Authentication uses mock JWT tokens
- Charts use sample data for demonstration

## 🎨 Design System

The application uses a comprehensive design system with:
- Custom color palette optimized for healthcare
- Glassmorphic effects
- Smooth animations
- Consistent spacing and typography
- Accessible components

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- shadcn/ui for the excellent component library
- Framer Motion for smooth animations
- Recharts for beautiful charts
- All contributors and the open-source community

---

**Built with ❤️ for healthcare professionals**
