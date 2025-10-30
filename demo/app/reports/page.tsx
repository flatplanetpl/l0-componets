// frontend/app/reports/page.tsx (this will be created in the demo folder)

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Generate Report
          </button>
        </div>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm p-6">
        <p className="text-muted-foreground">Reports and analytics tools will be displayed here.</p>
      </div>
    </div>
  );
}