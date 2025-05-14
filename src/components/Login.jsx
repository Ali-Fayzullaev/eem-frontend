// login.jsx
import iconEventManagement from "../assets/iconEvent.png";
import toast from "react-hot-toast";
import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../api/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Электрондық пошта мен құпия сөзді енгізіңіз.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await authService.login({ email, password });

      if (!result.success) {
        throw new Error(result.error || "Авторизация сәтсіз аяқталды.");
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const currentUser = authService.getCurrentUser();

      if (!currentUser) {
        throw new Error("Пайдаланушы деректерін алу мүмкін емес.");
      }

      let redirectPath = from || "/";

      if (["admin", "manager"].includes(currentUser.role)) {
        redirectPath = "/admin";
      } else if (currentUser.role === "user") {
        redirectPath = "/user";
      }

      navigate(redirectPath, {
        replace: true,
        state: { from: location },
      });

      toast.success("Кіру сәтті!");

    } catch (err) {
      console.error('Қате 😥', err);
      const errorMessage = err.message || "Қате 😥";
      setError(errorMessage);
      toast.error(errorMessage);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-img d-flex justify-content-center align-items-center bg-info" style={{ minHeight: "100vh" }}>
      <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <img src={iconEventManagement} className="img-fluid" alt="" style={{ maxHeight: "80px", objectFit: "cover" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Электрондық пошта:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Электрондық поштаны енгізіңіз..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Құпия сөз:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Құпия сөзді енгізіңіз..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Кіру...
              </>
            ) : (
              "Кіру"
            )}
          </button>

          {error && (
            <div className="alert alert-danger p-2 mb-3" role="alert">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="mb-0">
              Тіркелгіңіз жоқ па?{" "}
              <NavLink to="/signup" className="text-decoration-none">
                Тіркелу
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;