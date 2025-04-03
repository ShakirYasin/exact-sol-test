import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks, Task } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskForm } from "../components/tasks/TaskForm";
import { Button } from "../components/ui/Button";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
  } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const filteredTasks =
    selectedStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error loading tasks. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <Button onClick={() => setShowTaskForm(true)}>
              Create New Task
            </Button>
          </div>
          <button
            onClick={logout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => {
                if (
                  window.confirm("Are you sure you want to delete this task?")
                ) {
                  deleteTask(task.id);
                }
              }}
              onAssign={(assigneeId) =>
                assignTask({ taskId: task.id, assigneeId })
              }
              canEdit={user?.role === "admin" || task.createdBy.id === user?.id}
              canDelete={
                user?.role === "admin" || task.createdBy.id === user?.id
              }
              canAssign={user?.role === "admin"}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found.</p>
          </div>
        )}

        {showTaskForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <TaskForm
                task={null}
                onSubmit={async (data) => {
                  await createTask(data);
                  setShowTaskForm(false);
                }}
                onCancel={() => setShowTaskForm(false)}
                isLoading={false}
              />
            </div>
          </div>
        )}

        {editingTask && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <TaskForm
                task={editingTask}
                onSubmit={async (data) => {
                  await updateTask({ id: editingTask.id, ...data });
                  setEditingTask(null);
                }}
                onCancel={() => setEditingTask(null)}
                isLoading={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
