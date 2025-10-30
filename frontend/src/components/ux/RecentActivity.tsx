import { User, BookOpen, FileText, DollarSign, Settings } from 'lucide-react';

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'user' | 'course' | 'content' | 'finance' | 'settings';
}

const activities: ActivityItem[] = [
  { id: 1, user: 'John Doe', action: 'enrolled in', target: 'React Fundamentals', time: '2 min ago', type: 'course' },
  { id: 2, user: 'Jane Smith', action: 'completed', target: 'JavaScript Basics', time: '15 min ago', type: 'course' },
  { id: 3, user: 'Robert Johnson', action: 'created new', target: 'Advanced CSS Course', time: '1 hour ago', type: 'course' },
  { id: 4, user: 'Emily Davis', action: 'submitted assignment for', target: 'Python for Beginners', time: '3 hours ago', type: 'course' },
  { id: 5, user: 'Michael Wilson', action: 'graded', target: 'Algorithms Quiz', time: '5 hours ago', type: 'course' },
  { id: 6, user: 'Sarah Johnson', action: 'updated billing info', target: 'Account Settings', time: '1 day ago', type: 'finance' },
  { id: 7, user: 'David Brown', action: 'created', target: 'Marketing Guidelines', time: '2 days ago', type: 'content' },
];

const getIconForType = (type: ActivityItem['type']) => {
  switch (type) {
    case 'user': return <User className="w-5 h-5 text-blue-500" />;
    case 'course': return <BookOpen className="w-5 h-5 text-green-500" />;
    case 'content': return <FileText className="w-5 h-5 text-yellow-500" />;
    case 'finance': return <DollarSign className="w-5 h-5 text-purple-500" />;
    case 'settings': return <Settings className="w-5 h-5 text-gray-500" />;
    default: return <User className="w-5 h-5 text-gray-500" />;
  }
};

const getColorForType = (type: ActivityItem['type']) => {
  switch (type) {
    case 'user': return 'bg-blue-100 text-blue-800';
    case 'course': return 'bg-green-100 text-green-800';
    case 'content': return 'bg-yellow-100 text-yellow-800';
    case 'finance': return 'bg-purple-100 text-purple-800';
    case 'settings': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  };
};

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start pb-4 last:pb-0 border-b border-gray-100 last:border-0">
          <div className={`p-2 rounded-full ${getColorForType(activity.type)}`}>
            {getIconForType(activity.type)}
          </div>
          <div className="ml-4 flex-1">
            <p className="font-medium">
              {activity.user} <span className="font-normal text-gray-600">{activity.action} {activity.target}</span>
            </p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
      ))}
      
      <button className="w-full py-2 text-center text-sm text-blue-500 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  );
}