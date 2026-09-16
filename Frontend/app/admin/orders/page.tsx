import AdminRoute from "@/components/AdminRoute";
import AdminOrdersPage from "@/components/pages/AdminOrdersPage";

export default function Page() {
  return (
    <AdminRoute>
      <AdminOrdersPage />
    </AdminRoute>
  );
}
