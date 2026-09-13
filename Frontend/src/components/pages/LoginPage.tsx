import { AUTH_URL, DEV_AUTH_URL } from "@/lib/api";

export default function LoginPage() {
  return (
    <div className="page-center login-page">
      <div className="card login-card">
        <div className="login-icon">🍕</div>
        <h1>Welcome to FoodApp</h1>
        <p className="muted">
          Order delicious food from your favorite restaurants.
        </p>

        <div className="login-actions">
          <a href={AUTH_URL} className="btn btn-primary btn-block">
            Continue with Google
          </a>
        </div>
      </div>
    </div>
  );
}
