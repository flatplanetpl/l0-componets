// frontend/app/admin/backup/page.tsx (this will be created in the demo folder)

export default function AdminBackupPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Backup & Restore</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Create Backup
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Backup and restore tools will be displayed here.</p>
      </div>
    </div>
  );
}