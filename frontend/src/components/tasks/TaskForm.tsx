import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Task } from "../../hooks/useTasks";

interface TaskFormProps {
  task: Task | null;
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
