"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Calendar, User, MoreVertical } from "lucide-react"
import { TaskForm } from "./task-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: number
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assigned_to: string
  due_date: string
  created_at: string
  updated_at: string
}

interface TaskTableProps {
  tasks: Task[]
  onTaskUpdated: () => void
  onTaskDeleted: () => void
}

export function TaskTable({ tasks, onTaskUpdated, onTaskDeleted }: TaskTableProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          onTaskDeleted()
        }
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      "in-progress": "default",
      completed: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status.replace("-", " ")}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }

    return <Badge className={colors[priority as keyof typeof colors] || colors.medium}>{priority}</Badge>
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{task.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingTask(task)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-2">
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
            </div>

            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              {task.assigned_to && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{task.assigned_to}</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Priority</TableHead>
              <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
              <TableHead className="hidden lg:table-cell">Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{getStatusBadge(task.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{getPriorityBadge(task.priority)}</TableCell>
                <TableCell className="hidden lg:table-cell">{task.assigned_to || "-"}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(task.due_date)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingTask(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={() => {
            onTaskUpdated()
            setEditingTask(null)
          }}
        />
      )}
    </>
  )
}
