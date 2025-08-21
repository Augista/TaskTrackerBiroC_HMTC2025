# Task Tracker Web Application

A modern, responsive task management application built with Next.js, TypeScript, and Neon PostgreSQL.

## Features

- Interactive dashboard with charts and statistics
- Complete CRUD operations for tasks
- Team performance tracking
- Task timeline visualization
- responsive design (mobile & desktop)
- Using Modern UI with Tailwind CSS and shadcn/ui

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd task-tracker
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Database Setup

1. Create a Neon database account at [https://neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy your database connection string

### 4. Environment Variables

1. Copy the example environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Update `.env.local` with your actual Neon database URL:
\`\`\`env
DATABASE_URL="your-actual-neon-database-url-here"
\`\`\`

### 5. Initialize Database

Run the SQL script to create the tasks table:

\`\`\`sql
-- Execute this in your Neon SQL editor or via psql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to VARCHAR(100),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### 6. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── api/tasks/          # API routes for task operations
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard page
├── components/
│   ├── task-dashboard.tsx  # Main dashboard with charts
│   ├── task-form.tsx       # Task creation/editing form
│   └── task-table.tsx      # Task list table
├── lib/
│   └── db.ts              # Database connection
└── scripts/
    └── create-tasks-table.sql  # Database schema
\`\`\`

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Neon PostgreSQL
- **Charts**: Recharts
- **Icons**: Lucide React

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task
