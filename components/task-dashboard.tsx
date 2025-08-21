"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Plus, AlertCircle, Users, TrendingUp } from "lucide-react"
import { TaskForm } from "./task-form"
import { TaskTable } from "./task-table"

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

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const pieColors = ["#00C49F","#0088FE", "#FFBB28", "#FF8042"]
  const barColors = ["#E62747", "#E6C627", "#3DFF5A", "#ff7300"]

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setError(null)
      console.log(" Fetching tasks from API")
      const response = await fetch("/api/tasks")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Received tasks data:", data)
      setTasks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error fetching tasks:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch tasks"
      setError(errorMessage)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = () => {
    fetchTasks()
    setShowTaskForm(false)
  }

  const handleTaskUpdated = () => {
    fetchTasks()
  }

  const handleTaskDeleted = () => {
    fetchTasks()
  }

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length

  const teamPerformanceData = () => {
    const teamStats = tasks.reduce(
      (acc, task) => {
        const assignee = task.assigned_to || "Unassigned"
        if (!acc[assignee]) {
          acc[assignee] = { name: assignee, completed: 0, total: 0 }
        }
        acc[assignee].total += 1
        if (task.status === "completed") {
          acc[assignee].completed += 1
        }
        return acc
      },
      {} as Record<string, { name: string; completed: number; total: number }>,
    )

    return Object.values(teamStats).sort((a, b) => b.total - a.total)
  }

  // const taskTimelineData = () => {
  //   const timelineStats = tasks.reduce(
  //     (acc, task) => {
  //       const date = new Date(task.created_at).toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //       })
  //       if (!acc[date]) {
  //         acc[date] = { date, tasks: 0 }
  //       }
  //       acc[date].tasks += 1
  //       return acc
  //     },
  //     {} as Record<string, { date: string; tasks: number }>,
  //   )

  //   return Object.values(timelineStats).sort(
  //     (a, b) => new Date(a.date + ", 2024").getTime() - new Date(b.date + ", 2024").getTime(),
  //   )
  // }

    const taskDueDateData = () => {
    const dueStats = tasks.reduce(
      (acc, task) => {
        if (!task.due_date) return acc // skip kalau due_date kosong

        const date = new Date(task.due_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })

        if (!acc[date]) {
          acc[date] = { date, tasks: 0 }
        }
        acc[date].tasks += 1
        return acc
      },
      {} as Record<string, { date: string; tasks: number }>,
    )

    return Object.values(dueStats).sort(
      (a, b) => new Date(a.date + ", 2025").getTime() - new Date(b.date + ", 2025").getTime(),
    )
  }


  // Chart data
  const statusData = [
    { name: "Completed", value: completedTasks, color: "hsl(var(--chart-4))" },
    { name: "In Progress", value: inProgressTasks, color: "hsl(var(--chart-1))" },
    { name: "Pending", value: pendingTasks, color: "hsl(var(--chart-2))" },
  ].filter((item) => item.value > 0)

  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "high").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length },
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Tasks</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          {error.includes("does not exist") && (
            <p className="text-sm text-muted-foreground mb-4">
              Please run the database migration script to create the tasks table.
            </p>
          )}
          <Button onClick={fetchTasks} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
         <Image 
          src="images/hmtc.png"  
          alt="Logo Biro C"
          width={70}
          height={70}
          className="mx-auto sm:mx-0"
        />
            <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Task Tracker Biro C</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Project Tracker Biro C HMTC 2025</p>
            </div>
          </div>
          <Button onClick={() => setShowTaskForm(true)} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Tasks</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{completedTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">In Progress</CardTitle>
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-blue-500"></div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{inProgressTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-orange-500"></div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{pendingTasks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts  */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-sm sm:text-base">Task Status Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Overview of task completion status</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              {statusData.length > 0 ? (
                <ChartContainer
                  config={{
                    value: { label: "Tasks" },
                  }}
                  className="h-[200px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent = 0 }) =>
                          window.innerWidth > 640
                            ? `${name} ${(percent * 100).toFixed(0)}%`
                            : `${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={window.innerWidth > 640 ? 80 : 60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="font-medium text-sm">{data.name}</p>
                                <p className="text-xs text-muted-foreground">{data.value} tasks</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  No tasks to display
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-sm sm:text-base">Task Priority Breakdown</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Tasks organized by priority level</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              {priorityData.some((item) => item.value > 0) ? (
                <ChartContainer
                  config={{
                    value: { label: "Tasks" },
                  }}
                  className="h-[200px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="font-medium text-sm">{label} Priority</p>
                                <p className="text-xs text-muted-foreground">{payload[0].value} tasks</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="value">
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-bar-${index}`} fill={barColors[index % barColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  No tasks to display
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Team Performance
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Individual team member task completion</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              {teamPerformanceData().length > 0 ? (
                <ChartContainer
                  config={{
                    completed: { label: "Completed Tasks", color: "hsl(142, 76%, 36%)" },
                    total: { label: "Total Tasks", color: "hsl(217, 91%, 60%)" },
                  }}
                  className="h-[200px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformanceData()} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                      <YAxis fontSize={10} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="font-medium text-sm">{label}</p>
                                <p className="text-xs text-green-600">Completed: {data.completed}</p>
                                <p className="text-xs text-blue-600">Total: {data.total}</p>
                                <p className="text-xs text-muted-foreground">
                                  Rate: {data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="completed" fill="hsl(142, 76%, 36%)" name="Completed Tasks" />
                      <Bar dataKey="total" fill="hsl(217, 91%, 60%)" name="Total Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  No team data to display
                </div>
              )}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Task Timeline
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Task creation over time</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              {taskTimelineData().length > 0 ? (
                <ChartContainer
                  config={{
                    tasks: { label: "Tasks Created", color: "hsl(142, 76%, 36%)" },
                  }}
                  className="h-[200px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={taskTimelineData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis fontSize={10} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="font-medium text-sm">{label}</p>
                                <p className="text-xs text-muted-foreground">{payload[0].value} tasks created</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="tasks"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 4, stroke: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  No timeline data to display
                </div>
              )}
            </CardContent>
          </Card>
        */}
        

            <Card>
  <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
    <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
      Task Due Date Timeline
    </CardTitle>
    <CardDescription className="text-xs sm:text-sm">
      Task deadlines over time
    </CardDescription>
  </CardHeader>
  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
    {taskDueDateData().length > 0 ? (
      <ChartContainer
        config={{
          tasks: { label: "Tasks Due", color: "hsl(25, 95%, 53%)" },
        }}
        className="h-[200px] sm:h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={taskDueDateData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={10} />
            <YAxis fontSize={10} />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-md">
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {payload[0].value} tasks due
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="hsl(25, 95%, 53%)"
              strokeWidth={2}
              dot={{ fill: "hsl(25, 95%, 53%)", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4, stroke: "hsl(25, 95%, 53%)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    ) : (
      <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground text-sm">
        No due date data to display
      </div>
    )}
  </CardContent>
</Card>
 </div>


        <Card>
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base">All Tasks</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Ini Project Tracker Biro C Internal Affairs HMTC 2025</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <TaskTable tasks={tasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
          </CardContent>
        </Card>

        {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} onTaskCreated={handleTaskCreated} />}
      </div>
    </div>
  )
}
