// // import from rht
// import toast from "react-hot-toast";
// // import from react
// import { useState } from "react";

// // import axios
// import axios from "axios";

// // import RRD
// import { NavLink, useNavigate } from "react-router-dom";

// import { authService } from "../api/authService";

// // import img
// import iconEventManagement from "../assets/iconEvent.png";

// function Login() {

//   // useState
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [validated, setValidated] = useState(false);
//   const [loading, setLoading] = useState(false)
//   const [loaderBtn, setLoaderBtn] = useState(true);
//   const navigate = useNavigate();

//   // baseURL
//   // const axiosInstance = axios.create({
//   //   baseURL: "https://67ddbf11471aaaa742826b6e.mockapi.io",
//   // });

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await authService.register(formData);
//       navigate('/login');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const form = e.currentTarget;
//   //   if (form.checkValidity() === false) {
//   //     e.stopPropagation();
//   //     toast.error("Please enter your email or password.");
//   //     setValidated(true);
//   //     return;
//   //   }

//   //   try {
//   //     setLoaderBtn(false);
//   //     const response = await axiosInstance.post("/login", { email, password });
//   //     setEmail("");
//   //     setPassword("");
//   //     setTimeout(() => {
//   //       setLoading(false);
//   //       toast.success("Good Job");
//   //       navigate("/");
//   //     }, 0);
//   //   } catch (err) {
//   //     toast.error(err.message);
//   //     console.log(err);
//   //   }

//   //   setValidated(false);
//   // };
//   return (
//     <div className="container h-100  align-content-center ">
//       <div className="row d-flex justify-content-center ">
//         <div className="col-4">
//           <form
//             noValidate
//             validated={validated}
//             onSubmit={handleSubmit}
//             className={`p-4 border rounded shadow-sm bg-light ${validated ? "was-validated" : ""}`}
//           >
//             <div className="text-center">
//               <img
//                 src={iconEventManagement}
//                 alt="Event Management"
//                 className="img-fluid rounded-circle mb-3"
//                 style={{ maxHeight: "80px", objectFit: "cover" }}
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="email" className="form-label">
//                 Email address:
//               </label>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="email"
//                 name="email"
//                 placeholder="Enter your email..."
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <div className="invalid-feedback">
//                 Please provide a valid email.
//               </div>
//             </div>

//             <div className="mb-3">
//               <label htmlFor="password" className="form-label">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="password"
//                 name="password"
//                 placeholder="Enter your password..."
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <div className="invalid-feedback">
//                 Please provide a valid password.
//               </div>
//             </div>

//             <button type="submit" className="btn btn-success w-100 py-2 d-flex justify-content-center">
//             <span>{loaderBtn ? <span>Sign in</span> : <span className="loaderBtn"></span>}</span>
//             </button>

//             <div className="text-center mt-2">
//               <p>
//                 Don't have an account?{" "}
//                 <NavLink to="signup">Sign up here</NavLink>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

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
      navigate(from, { replace: true }); // Редирект на предыдущую страницу или главную
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

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

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
