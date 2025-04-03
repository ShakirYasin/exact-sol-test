import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useWebSocket } from "./useWebSocket";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: "admin" | "user";
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Task["status"];
  dueDate?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

const createTask = async (data: Partial<Task>) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create task");
  }
  return response.json();
};

const updateTask = async (data: Partial<Task> & { id: string }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
};

const deleteTask = async (taskId: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
};

const assignTask = async (data: { taskId: string; assigneeId: string }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${data.taskId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ assigneeId: data.assigneeId }),
  });
  if (!response.ok) {
    throw new Error("Failed to assign task");
  }
  return response.json();
};

export function useTasks() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { lastMessage } = useWebSocket();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(token || ""),
    enabled: !!token,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: (data: { taskId: string; assigneeId: string }) =>
      assignTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Handle WebSocket messages
  if (lastMessage) {
    const message = JSON.parse(lastMessage.data);
    if (message.type === "TASK_UPDATED") {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  }

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    assignTask: assignTaskMutation.mutate,
  };
}
