# MERN Inventory & Order Management System

This repository contains a comprehensive MERN stack application with:
- Express + MongoDB backend using MVC pattern
- React frontend with role-based access controls and modern UI
- Inventory and unit pricing support for `g`, `kg`, `L`, `mL`, and `unit`
- INR price display across the UI
- JWT authentication for `admin` and `user` roles
- Premium dark theme with glassmorphism design
- Fully responsive layout

## Data Precision
- This MERN app uses MongoDB `Decimal128` for product quantity and pricing so it supports high decimal precision and large values safely.
- If a PostgreSQL stack were used instead, equivalent types would be `NUMERIC(30,8)` or `DECIMAL(30,8)` for precision-sensitive monetary and inventory fields.

## Setup
1. Install dependencies:
   ```bash
   npm run install-all
   ```
2. Create `.env` files in `backend` and `client` if needed.
3. Run in development:
   ```bash
   npm run dev
   ```

## Features
- **Product Management**: Create, update, delete products with pricing and inventory tracking
- **Order System**: Users can request orders, admins can approve/disapprove/delete
- **Inventory Units**: Support for grams, kilograms, liters, milliliters, and units
- **Role-Based Access**: Admin and user roles with separate dashboards
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations

## Backend
- `backend/app.js`
- `backend/server.js`
- `backend/controllers`
- `backend/models`
- `backend/routes`
- `backend/middleware`
- `backend/utils`

## Frontend
- `client/src`
- `client/src/components`
- `client/src/services`
- `client/src/index.css` - Premium dark theme styles

