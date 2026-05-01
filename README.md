# Resumify - Advanced Resume Builder SaaS

## Features
- Drag & Drop Resume Builder
- Live Preview
- 5 Modern Templates
- PDF Export
- Dark/Light Mode
- Zero-Config Database (SQLite)
- Node.js & React

## Prerequisites
- Node.js (v16+)

## Setup Instructions

This application uses a local SQLite database, meaning you **do not** need to install or configure any external database application!

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.
The backend API is running at `http://localhost:5000`.
