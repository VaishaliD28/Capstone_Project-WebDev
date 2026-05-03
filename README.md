# Resumify - Advanced Resume Builder SaaS

## Features
-Drag & Drop Resume Builder
-Live Preview with Real-Time Updates
-Modern & Professional Templates
-PDF Export & Download
-Dark / Light Mode with Theme Switching
-User Authentication (Login / Signup)
-Persistent User Data (Resume Save & Access Anytime)
-AI-Based Resume Analysis & Job Role Suggestions
-Skill Gap Recommendations for Target Jobs
-Resume Upload & Parsing (PDF/DOC support)

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
