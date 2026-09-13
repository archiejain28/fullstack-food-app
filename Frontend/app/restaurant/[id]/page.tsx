import RestaurantPage from "@/components/pages/RestaurantPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <RestaurantPage />
    </ProtectedRoute>
  );
}
