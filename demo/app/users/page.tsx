// frontend/app/users/page.tsx (this will be created in the demo folder)

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add User
          </button>
        </div>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm p-6">
        <p className="text-muted-foreground">User management tools will be displayed here.</p>
      </div>
    </div>
  );
}