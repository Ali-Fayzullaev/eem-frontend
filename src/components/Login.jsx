//
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

  // login.jsx
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const form = e.currentTarget;
  
  //   if (form.checkValidity() === false) {
  //     e.stopPropagation();
  //     setValidated(true);
  //     toast.error("Please enter valid email and password.");
  //     return;
  //   }
  
  //   try {
  //     setLoading(true);
  //     setError("");
  
  //     if (email.toLowerCase() === 'admin1@gmail.com') {
  //       if (currentUser.role !== 'admin') {
  //         const validation = await authService.validateToken();
  //         if (validation.success && validation.user?.role === 'admin') {
  //           // Токенни янгилаш
  //           await authService.refreshTokens(); 
  //           // Янги токен билан фойдаланувчини қайта олиш
  //           currentUser = authService.getCurrentUser(); 
  //         } else {
  //           throw new Error('Admin privileges not granted');
  //         }
  //       }
  //       redirectPath = '/admin';
  //     }

  //     // 1. Выполняем вход
  //     const result = await authService.login({ email, password });
  //     console.log('Login result:', result);
      
  //     if (!result.success) {
  //       throw new Error(result.error || "Authentication failed");
  //     }
  
  //     // 2. Искусственная задержка для синхронизации состояния
  //     await new Promise(resolve => setTimeout(resolve, 100));
  
  //     // 3. Получаем обновленные данные пользователя
  //     const currentUser = authService.getCurrentUser();
  //     console.log('Current user:', currentUser);
      
  //     if (!currentUser) {
  //       throw new Error("Failed to retrieve user data");
  //     }
  
  //     // 4. Определяем путь для перенаправления
  //     let redirectPath = from || '/';
      
  //     // 5. Специальная обработка для админа
  //     if (email.toLowerCase() === 'admin1@gmail.com') {
  //       if (currentUser.role !== 'admin') {
  //         // Если в токене нет роли админа, проверяем через сервер
  //         const validation = await authService.validateToken();
  //         if (!validation.success || validation.user?.role !== 'admin') {
  //           throw new Error('Admin privileges not granted');
  //         }
  //         currentUser.role = 'admin'; // Обновляем роль из ответа сервера
  //       }
  //       redirectPath = '/admin';
  //     }
  
  //     // 6. Перенаправляем пользователя
  //     navigate(redirectPath, { 
  //       replace: true,
  //       state: { from: location }
  //     });
      
  
  //     toast.success("Login successful!");
  
  //   } catch (err) {
  //     console.error('Login error:', err);
  //     const errorMessage = err.message || "Login failed";
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //     authService.logout();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      toast.error("Please enter valid email and password.");
      return;
    }
  
    try {
      setLoading(true);
      setError("");
  
      let currentUser = null; // currentUser ни бошланғич ҳолда инициализациялаш
  
      // 1. Выполняем вход
      const result = await authService.login({ email, password });
      console.log('Login result:', result);
  
      if (!result.success) {
        throw new Error(result.error || "Authentication failed");
      }
  
      // 2. Искусственная задержка для синхронизации состояния
      await new Promise(resolve => setTimeout(resolve, 100));
  
      // 3. Получаем обновленные данные пользователя
      currentUser = authService.getCurrentUser(); // currentUser ни янгилаш
      console.log('Current user:', currentUser);
  
      if (!currentUser) {
        throw new Error("Failed to retrieve user data");
      }
  
      // 4. Определяем путь для перенаправления
      let redirectPath = from || '/';
  
      // 5. Специальная обработка для админа
      if (email.toLowerCase() === 'admin1@gmail.com') {
        if (currentUser.role !== 'admin') {
          const validation = await authService.validateToken();
          if (validation.success && validation.user?.role === 'admin') {
            // Токенни янгилаш
            await authService.refreshTokens();
            currentUser = authService.getCurrentUser(); // Янги токен билан фойдаланувчини қайта олиш
          } else {
            throw new Error('Admin privileges not granted');
          }
        }
        redirectPath = '/admin';
      }
  
      // 6. Перенаправляем пользователя
      navigate(redirectPath, {
        replace: true,
        state: { from: location }
      });
  
      toast.success("Login successful!");
  
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      authService.logout();
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