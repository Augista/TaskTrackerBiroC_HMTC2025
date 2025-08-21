import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("Attempting to fetch tasks from database")
    const tasks = await sql`
      SELECT * FROM tasks 
      ORDER BY created_at DESC
    `
    console.log(" Successfully fetched tasks:", tasks.length)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error(" Error fetching tasks:", error)
    if (error instanceof Error) {
      if (error.message.includes('relation "tasks" does not exist')) {
        return NextResponse.json(
          {
            error: "Tasks table does not exist. Please run the database migration script first.",
          },
          { status: 500 },
        )
      }
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log(" Attempting to create new task")
    const body = await request.json()
    const { title, description, status, priority, assigned_to, due_date } = body

    console.log(" Task data:", { title, description, status, priority, assigned_to, due_date })

    const result = await sql`
      INSERT INTO tasks (title, description, status, priority, assigned_to, due_date)
      VALUES (${title}, ${description}, ${status || "pending"}, ${priority || "medium"}, ${assigned_to}, ${due_date})
      RETURNING *
    `

    console.log(" Successfully created task:", result[0])
    return NextResponse.json(result[0])
  } catch (error) {
    console.error(" Error creating task:", error)
    if (error instanceof Error) {
      if (error.message.includes('relation "tasks" does not exist')) {
        return NextResponse.json(
          {
            error: "Tasks table does not exist. Please run the database migration script first.",
          },
          { status: 500 },
        )
      }
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
