import { Task } from "../../hooks/useTasks";
import { Button } from "../ui/Button";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: (assigneeId: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onAssign,
  canEdit,
  canDelete,
  canAssign,
}: TaskCardProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
            task.status
          )}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          Assigned to: {task.assignedTo.firstName} {task.assignedTo.lastName}
        </div>
        <div className="text-sm text-gray-500">
          Created by: {task.createdBy.firstName} {task.createdBy.lastName}
        </div>
      </div>

      <div className="flex space-x-2">
        {canEdit && (
          <Button onClick={onEdit} variant="secondary" size="sm">
            Edit
          </Button>
        )}
        {canDelete && (
          <Button onClick={onDelete} variant="danger" size="sm">
            Delete
          </Button>
        )}
        {canAssign && (
          <Button
            onClick={() => onAssign(task.assignedTo.id)}
            variant="secondary"
            size="sm"
          >
            Reassign
          </Button>
        )}
      </div>
    </div>
  );
}
