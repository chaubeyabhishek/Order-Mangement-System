<<<<<<< HEAD
# MERN Role-Based Access & Unit Conversion App

This repository contains a sample MERN stack application with:
- Express + MongoDB backend using MVC pattern
- React frontend with role-based access controls
- Inventory and unit pricing support for `g`, `kg`, `L`, `mL`, and `unit`
- INR price display across the UI
- JWT authentication for `admin` and `user` roles

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
=======
# Order-Mangement-System
>>>>>>> dff8ae5de8cd3ecc413c507b4b9f60f4127c1daa
