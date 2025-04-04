import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks, Task } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskForm } from "../components/tasks/TaskForm";
import { Button } from "../components/ui/Button";
import { useRouter } from "next/router";
import { TaskStatus, TaskStatusType } from "../types";

export default function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatusType>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();

  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
  } = useTasks(selectedStatus);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTask({ id: taskId, status });
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as TaskStatusType)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="all">All Tasks</option>
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </select>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition duration-200"
              >
                Create New Task
              </Button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => {
                if (window.confirm("Are you sure you want to delete this task?")) {
                  deleteTask(task.id);
                }
              }}
              onAssign={(assigneeId) => assignTask({ taskId: task.id, assigneeId })}
              onStatusChange={(status) => handleStatusChange(task.id, status)}
              canEdit={user.role === "admin" || task.createdBy.id === user.id}
              canDelete={user.role === "admin" || task.createdBy.id === user.id}
              canAssign={user.role === "admin"}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-200 border border-gray-100 p-6"
            />
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found.</p>
          </div>
        )}

        {(showTaskForm || editingTask) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <TaskForm
                task={editingTask}
                onSubmit={async (data) => {
                  if (editingTask) {
                    await updateTask({ id: editingTask.id, ...data });
                    setEditingTask(null);
                  } else {
                    await createTask(data);
                    setShowTaskForm(false);
                  }
                }}
                onCancel={() => {
                  setEditingTask(null);
                  setShowTaskForm(false);
                }}
                isLoading={false}
                currentUserId={user.id}
                
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
