import HomePage from "@/components/pages/HomePage";

import ProtectedRoute from "@/components/ProtectedRoute";



export default function Page() {

  return (

    <ProtectedRoute>

      <HomePage />

    </ProtectedRoute>

  );

}


