import AdminRoute from "@/components/AdminRoute";
import AdminUsersPage from "@/components/pages/AdminUsersPage";

export default function Page() {
  return (
    <AdminRoute>
      <AdminUsersPage />
    </AdminRoute>
  );
}
