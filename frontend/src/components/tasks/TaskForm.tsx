import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Task } from "../../hooks/useTasks";
import { useUsers } from "../../hooks/useUsers";
import { TaskStatus } from "../../types";
import { format, parse } from "date-fns";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  assignedTo: string;
}

interface TaskFormProps {
  task: Task | null;
  onSubmit: (data: Partial<Task & { assignedTo: { id: string } }>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  currentUserId: string;
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps) {
  const { users } = useUsers();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
      status: task?.status || TaskStatus.PENDING,
      assignedTo: task?.assignedTo?.id,
    },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const formattedData = {
      ...data,
      dueDate: data.dueDate ? parse(data.dueDate, "yyyy-MM-dd", new Date()).toISOString() : undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Input
          label="Title"
          {...register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />
      </div>

      <div>
        <Input
          label="Description"
          {...register("description")}
          error={errors.description?.message}
        />
      </div>

      <div>
        <Input
          type="date"
          label="Due Date"
          {...register("dueDate")}
          error={errors.dueDate?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          {...register("status")}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={TaskStatus.PENDING}>Pending</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <select
          {...register("assignedTo")}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
