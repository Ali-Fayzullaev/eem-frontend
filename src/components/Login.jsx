import toast from "react-hot-toast";
import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../api/authService";
import iconEventManagement from "../assets/iconEvent.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем предыдущий путь для редиректа после входа
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Валидация формы
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      toast.error("Please enter valid email and password.");
      return;
    }

    try {
      setLoading(true);
      await authService.login({ email, password });

      toast.success("Login successful!");
      navigate(from, { replace: true }); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container h-100 align-content-center">
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <form
            noValidate
            validated={validated.toString()}
            onSubmit={handleSubmit}
            className={`p-4 border rounded shadow-sm bg-light ${
              validated ? "was-validated" : ""
            }`}
          >
            <div className="text-center">
              <img
                src={iconEventManagement}
                alt="Event Management"
                className="img-fluid rounded-circle mb-3"
                style={{ maxHeight: "80px", objectFit: "cover" }}
              />
            </div>

           

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="invalid-feedback">
                Please provide a valid email.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password..."
                required
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="invalid-feedback">
                Password must be at least 6 characters.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
            <br /><br />
            {error && (
              <div className="alert alert-danger p-1 px-2" role="alert">
                {error}
              </div>
            )}

            <div className="text-center mt-3">
              <p className="mb-0">
                Don't have an account?{" "}
                <NavLink to="/signup" className="text-decoration-none">
                  Sign up here
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
