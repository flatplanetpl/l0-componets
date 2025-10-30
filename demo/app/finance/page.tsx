// frontend/app/finance/page.tsx (this will be created in the demo folder)

export default function AdminFinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Finance Management</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Export Report
          </button>
        </div>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm p-6">
        <p className="text-muted-foreground">Financial management tools will be displayed here.</p>
      </div>
    </div>
  );
}