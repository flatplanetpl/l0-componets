'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Server, HardDrive, Wifi, Clock, Bell, Settings, TrendingUp, TrendingDown, Eye, Download, Filter } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DynamicLineChart,
  DynamicLine,
  DynamicXAxis,
  DynamicYAxis,
  DynamicCartesianGrid,
  DynamicTooltip,
  DynamicResponsiveContainer,
  DynamicAreaChart,
  DynamicArea,
  DynamicBarChart,
  DynamicBar,
} from '@/components/charts/RechartsWrapper';

interface Metric {
  id: string;
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  acknowledged: boolean;
  service: string;
}

interface PerformanceDataPoint {
  time: string;
  cpu: number;
  memory: number;
  network: number;
  responseTime: number;
}

const initialMetrics: Metric[] = [
  { id: '1', name: 'CPU Usage', value: '42%', change: '+2.1%', changeType: 'positive', unit: '%', status: 'good' },
  { id: '2', name: 'Memory Usage', value: '68%', change: '-3.2%', changeType: 'negative', unit: '%', status: 'good' },
  { id: '3', name: 'Network Traffic', value: '1.2', change: '+5.7%', changeType: 'positive', unit: 'Gbps', status: 'good' },
  { id: '4', name: 'Response Time', value: '124', change: '+8.3%', changeType: 'positive', unit: 'ms', status: 'warning' },
  { id: '5', name: 'Error Rate', value: '0.23', change: '+12%', changeType: 'positive', unit: '%', status: 'warning' },
  { id: '6', name: 'Disk Usage', value: '78%', change: '+4.1%', changeType: 'positive', unit: '%', status: 'good' },
];

const initialAlerts: Alert[] = [
  { id: '1', title: 'High Response Time', description: 'API response time exceeded threshold', severity: 'warning', timestamp: '2023-10-15 14:28', acknowledged: false, service: 'API Gateway' },
  { id: '2', title: 'Database Connection Pool', description: 'Database connection pool running low', severity: 'warning', timestamp: '2023-10-15 13:45', acknowledged: true, service: 'Database' },
  { id: '3', title: 'Disk Space Alert', description: 'Disk usage above 80% threshold', severity: 'critical', timestamp: '2023-10-15 10:12', acknowledged: false, service: 'File Server' },
  { id: '4', title: 'Traffic Spike', description: 'Unusual traffic pattern detected', severity: 'info', timestamp: '2023-10-15 09:30', acknowledged: true, service: 'Load Balancer' },
  { id: '5', title: 'Cache Hit Ratio', description: 'Cache hit ratio below optimal level', severity: 'warning', timestamp: '2023-10-15 08:15', acknowledged: false, service: 'Cache Service' },
];

const performanceData: PerformanceDataPoint[] = [
  { time: '08:00', cpu: 32, memory: 62, network: 0.8, responseTime: 89 },
  { time: '09:00', cpu: 45, memory: 65, network: 1.1, responseTime: 102 },
  { time: '10:00', cpu: 58, memory: 70, network: 1.3, responseTime: 118 },
  { time: '11:00', cpu: 52, memory: 73, network: 1.2, responseTime: 112 },
  { time: '12:00', cpu: 61, memory: 76, network: 1.4, responseTime: 132 },
  { time: '13:00', cpu: 68, memory: 78, network: 1.6, responseTime: 145 },
  { time: '14:00', cpu: 65, memory: 75, network: 1.5, responseTime: 138 },
  { time: '15:00', cpu: 72, memory: 80, network: 1.7, responseTime: 155 },
];

export default function AdminMonitoringPage() {
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Redirect effect will handle this
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesService = selectedService === 'all' || alert.service === selectedService;
    return matchesSeverity && matchesService;
  });

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const acknowledgeAllAlerts = () => {
    setAlerts(alerts.map(alert => ({ ...alert, acknowledged: true })));
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Performance Monitoring</h1>
            <p className="text-gray-600">Monitor system health and performance metrics</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" /> Alert Settings
            </button>
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              <Download className="w-4 h-4 mr-2" /> Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className={`bg-white p-6 rounded-xl shadow-sm border ${
                metric.status === 'critical' ? 'border-red-200' : 
                metric.status === 'warning' ? 'border-yellow-200' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${
                  metric.status === 'critical' ? 'bg-red-100' : 
                  metric.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {metric.status === 'critical' ? (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  ) : metric.status === 'warning' ? (
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <Activity className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{metric.name}</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <span className="ml-2 text-sm">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center">
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : metric.changeType === 'negative' ? (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    ) : (
                      <div className="w-4 h-4 mr-1"></div>
                    )}
                    <span className={`text-sm ${
                      metric.changeType === 'positive' ? 'text-green-500' : 
                      metric.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">CPU & Memory Usage</h2>
            <div className="h-80">
              <DynamicResponsiveContainer width="100%" height="100%">
                <DynamicAreaChart
                  data={performanceData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <DynamicCartesianGrid strokeDasharray="3 3" />
                  <DynamicXAxis dataKey="time" />
                  <DynamicYAxis />
                  <DynamicTooltip />
                  <DynamicArea type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="CPU %" />
                  <DynamicArea type="monotone" dataKey="memory" stackId="2" stroke="#10b981" fill="#10b981" name="Memory %" />
                </DynamicAreaChart>
              </DynamicResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Response Time & Network Traffic</h2>
            <div className="h-80">
              <DynamicResponsiveContainer width="100%" height="100%">
                <DynamicLineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <DynamicCartesianGrid strokeDasharray="3 3" />
                  <DynamicXAxis dataKey="time" />
                  <DynamicYAxis yAxisId="left" />
                  <DynamicYAxis yAxisId="right" orientation="right" />
                  <DynamicTooltip />
                  <DynamicLine 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#8b5cf6" 
                    activeDot={{ r: 8 }} 
                    name="Response Time (ms)" 
                  />
                  <DynamicLine 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="network" 
                    stroke="#f59e0b" 
                    name="Network (Gbps)" 
                  />
                </DynamicLineChart>
              </DynamicResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold mb-4">System Alerts & Notifications</h2>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <select 
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Services</option>
                  <option value="API Gateway">API Gateway</option>
                  <option value="Database">Database</option>
                  <option value="File Server">File Server</option>
                  <option value="Load Balancer">Load Balancer</option>
                  <option value="Cache Service">Cache Service</option>
                </select>
                <button 
                  onClick={acknowledgeAllAlerts}
                  className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                >
                  <Bell className="w-4 h-4 mr-2" /> Acknowledge All
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id} 
                    className={`hover:bg-gray-50 ${
                      !alert.acknowledged ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{alert.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{alert.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.severity === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : alert.severity === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {alert.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.acknowledged 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {alert.acknowledged ? 'Acknowledged' : 'Unacknowledged'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => acknowledgeAlert(alert.id)}
                          disabled={alert.acknowledged}
                          className={`${
                            alert.acknowledged 
                              ? 'text-gray-300' 
                              : 'text-blue-500 hover:text-blue-700'
                          }`}
                        >
                          {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Service Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Server className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">API Gateway</p>
                    <p className="text-sm text-gray-500">Healthy</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-3">99.9%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <HardDrive className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-gray-500">Healthy</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-3">99.7%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Wifi className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">Cache Service</p>
                    <p className="text-sm text-gray-500">Warning</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mr-3">85.2%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Activity className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">File Storage</p>
                    <p className="text-sm text-gray-500">Healthy</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-3">98.9%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Performance Trend</h2>
            <div className="h-64">
              <DynamicResponsiveContainer width="100%" height="100%">
                <DynamicBarChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <DynamicCartesianGrid strokeDasharray="3 3" />
                  <DynamicXAxis dataKey="time" />
                  <DynamicYAxis />
                  <DynamicTooltip />
                  <DynamicBar dataKey="responseTime" fill="#8b5cf6" name="Response Time (ms)" />
                  <DynamicBar dataKey="cpu" fill="#3b82f6" name="CPU %" />
                </DynamicBarChart>
              </DynamicResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}