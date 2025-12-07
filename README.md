# Full-Stack Admin Dashboard

This is a comprehensive, full-stack admin dashboard application built with a modern Angular frontend and a Node.js/Express/MongoDB backend. It provides a secure, role-based interface for managing users and content, and visualizing key application analytics with D3.js.

## Tech Stack

**Frontend:**
- **Angular (v20+):** Modern, zoneless, using standalone components.
- **TypeScript:** For type-safe code.
- **Tailwind CSS:** For utility-first styling.
- **D3.js:** For dynamic, interactive data visualizations.
- **Angular Signals:** For reactive state management.

**Backend:**
- **Node.js & Express.js:** For building the REST API.
- **MongoDB:** NoSQL database for data storage.
- **JSON Web Tokens (JWT):** For secure authentication.
- **bcrypt.js:** For password hashing.
- **express-rate-limit:** For brute-force attack prevention.

---

## Features

- **Secure Authentication:** JWT-based login system with password hashing and route protection.
- **Role-Based Access Control:** Differentiates between 'Admin' and other roles, restricting access to sensitive areas like user management.
- **Dynamic Analytics Dashboard:**
  - Real-time metric cards (Total Users, New Users, Total Posts).
  - Pie chart for user role distribution.
- **User Management (Admin only):** Full CRUD (Create, Read, Update, Delete) functionality for users.
  - Search by name or email.
  - Filter by user status (Active/Inactive) and role.
- **Content Management (Admin only):** Full CRUD functionality for posts.
  - Search by post title.
  - Filter by post status (Published/Draft).
- **Responsive Design:** The UI is fully responsive and works seamlessly on desktop and mobile devices.
- **Toast Notifications:** Provides clear, non-intrusive feedback for user actions.

---

## How to Run the Application

This is a full-stack project with a separate frontend and backend. **Both must be running at the same time.** You do not need to install Node.js or Angular on your computer; this environment provides everything you need.

### Step 1: Run the Backend Server

The backend server handles all data, authentication, and business logic. The frontend will not work without it.

1.  Open a new terminal within this development environment.
2.  Navigate to the server directory:
    ```bash
    cd server
    ```
3.  Install the required dependencies:
    ```bash
    npm install
    ```
4.  Start the server: 
    ```bash
    npm start
    ```
5.  You should see confirmation messages in the terminal: `Server started on port 5000` and `MongoDB Connected...`.
6.  **Leave this terminal running.**

### Step 2: Run the Frontend Application

🚀 Frontend Setup (Angular Application)
Step 1️⃣ Navigate to the Frontend Directory

The frontend is already configured inside the project.
Move to the admin-dashboard-2 folder:

```bash
cd admin-dashboard-2
```

Step 2️⃣ Install Dependencies (One Time Only)

If this is your first time running the project, install the required packages:

```bash
npm install
```

Step 3️⃣ Start the Frontend Application

Make sure the backend server is already running.

Now start the Angular frontend:

```bash
npm start
```
    

✅ This command will automatically:

Compile the Angular application

Start the development server

Connect to the backend API

---


## Default Login Credentials

You can use the following pre-configured accounts to log in:

-   **Admin User:**
    -   **Email:** `alice@example.com`
    -   **Password:** `password123`