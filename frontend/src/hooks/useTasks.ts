import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useWebSocket } from "./useWebSocket";
import { TaskStatus, TaskStatusType } from "../types";
import { useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchTasks = async (status?: TaskStatus): Promise<Task[]> => {
  const token = localStorage.getItem("token");
  const url = new URL(`${API_URL}/tasks`);
  if (status) {
    url.searchParams.append('status', status);
  }
  
  const response = await fetch(url.toString(), {
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
    method: "PATCH",
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

export function useTasks(status?: TaskStatusType) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { lastMessage, subscribeToTaskUpdates } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribeToTaskUpdates();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribeToTaskUpdates]);

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["tasks", status],
    queryFn: () => fetchTasks(status === 'all' ? undefined : status as TaskStatus),
    enabled: isAuthenticated,
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
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  return {
    tasks,
    refetch,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    assignTask: assignTaskMutation.mutate,
  };
}
