import { useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { withAdminRoute } from '../utils/adminRoute';
import { useEvents } from '../hooks/useEvents';

function EventsPage() {
  const { events, isLoading, refetch } = useEvents();
  const { lastMessage, subscribeToTaskUpdates } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribeToTaskUpdates();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToTaskUpdates]);

  useEffect(() => {
    if (lastMessage) {
      refetch();
    }
  }, [lastMessage, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Events</h1>
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {event.type.replace('_', ' ')}
                  </h3>
                  <p className="text-gray-600 mt-1">Task &quot;{event?.metadata?.task?.title || ""}&quot; was {event.type.split('_')?.[1]} {event.type.includes("assigned") ? `to "${event?.metadata?.task?.assignedTo?.firstName || ""} ${event?.metadata?.task?.assignedTo?.lastName || ""}"` : ""}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-center text-gray-500 py-8">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAdminRoute(EventsPage); 