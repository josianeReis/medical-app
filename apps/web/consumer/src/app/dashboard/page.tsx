import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurrentUser } from "@/services/auth";

export default async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-gray-700 mb-4">
            This is your secure dashboard. You&apos;re seeing this page because
            you&apos;ve been successfully authenticated.
          </p>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-2">Your Profile</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p>
                <strong>ID:</strong> {user?.id}
              </p>
              <p>
                <strong>Name:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
