import { Task } from "../../hooks/useTasks";
import { Button } from "../ui/Button";
import { useUsers } from "../../hooks/useUsers";
import { TaskStatus } from "../../types";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: (assigneeId: string) => void;
  onStatusChange: (status: TaskStatus) => void;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  className?: string;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
  canEdit,
  canDelete,
  canAssign,
  className,
}: TaskCardProps) {
  const { users } = useUsers();

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${getStatusColor(
            task.status
          )}`}
        >
          <option value={TaskStatus.PENDING}>Pending</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
        </select>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <span>Assigned to:</span>
          {canAssign ? (
            <select
              value={task.assignedTo.id}
              onChange={(e) => onAssign(e.target.value)}
              className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          ) : (
            <span>
              {task.assignedTo.firstName} {task.assignedTo.lastName}
            </span>
          )}
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
      </div>
    </div>
  );
}
