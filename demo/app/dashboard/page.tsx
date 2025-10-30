// frontend/app/dashboard/page.tsx (this will be created in the demo folder)

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <div className="flex space-x-2">
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            Quick Action
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-card p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-600 transition-colors dark:text-slate-300">
          Dashboard content will be displayed here.
        </p>
      </div>
    </div>
  );
}
