import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  changeColor: string;
}

const StatCard = ({ title, value, change, icon: Icon, color, changeColor }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {change.startsWith('+') ? <TrendingUp className="w-4 h-4 text-green-500 mr-1" /> : <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
      <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
      <span className="text-gray-500 text-sm ml-1">from last period</span>
    </div>
  </div>
);

interface DashboardWidgetsProps {
  stats: {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
    changeColor: string;
  }[];
}

export default function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard 
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
          changeColor={stat.changeColor}
        />
      ))}
    </div>
  );
}