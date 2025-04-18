import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import iconEventManagement from "../assets/iconEvent.png";

function Signup() {
  // Состояния
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  // Экземпляр axios
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth", 
  });

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Обработка отправки формы
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const form = e.currentTarget;

  //   if (form.checkValidity() === false) {
  //     e.stopPropagation();
  //     setValidated(true);
  //     toast.error("Please fill in all required fields.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // Отправка данных на сервер
  //     const response = await axiosInstance.post("/register", formData);

  //     // Очистка формы
  //     setFormData({
  //       email: "",
  //       password: "",
  //       firstName: "",
  //       lastName: "",
  //       username: "",
  //     });

  //     // Уведомление об успехе
  //     toast.success(response.statusText || "Registration successful!");

  //     // Перенаправление на страницу входа
  //     navigate("/login");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      toast.error("Please fill in all required fields correctly.");
      return;
    }
  
    try {
      setLoading(true);
      
      // Clear any previous errors
      setError(null);
  
      // Send data to server with timeout
      const response = await axiosInstance.post("/register", formData, {
        timeout: 10000 // 10 second timeout
      });
  
      // Check for successful response (2xx status)
      if (response.status >= 200 && response.status < 300) {
        // Reset form
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          username: "",
        });
        setValidated(false);
  
        // Show success message
        toast.success("Registration successful! You can now login.");
  
        // Redirect to login
        navigate("/login", { replace: true });
      } else {
        // Handle non-2xx responses
        throw new Error(response.statusText || "Registration failed");
      }
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";
  
      // Handle different error cases
      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.response) {
        // Server responded with error status (4xx, 5xx)
        errorMessage = err.response.data?.message || 
                      err.response.statusText || 
                      "Registration failed";
        
        // Handle specific status codes
        if (err.response.status === 409) {
          errorMessage = "User with this email already exists.";
        } else if (err.response.status === 400) {
          errorMessage = "Invalid registration data. Please check your inputs.";
        }
      }
  
      // Set error state and show toast
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container h-100 w-100">
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5 my-3">
          <form
            noValidate
            onSubmit={handleSubmit}
            className={`p-4 border rounded shadow-sm bg-light ${validated ? "was-validated" : ""}`}
          >
            <div className="text-center mb-3">
              <img
                src={iconEventManagement}
                alt="Event Management"
                className="img-fluid rounded-circle"
                style={{ maxHeight: "80px", objectFit: "cover" }}
              />
            </div>

            {/* First Name */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name..."
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">Please provide your first name.</div>
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name..."
                required
                value={formData.lastName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">Please provide your last name.</div>
            </div>

            {/* Username */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter your username..."
                required
                value={formData.username}
                onChange={handleChange}
              />
              <div className="invalid-feedback">Please provide a username.</div>
            </div>

            {/* Email */}
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
                value={formData.email}
                onChange={handleChange}
              />
              <div className="invalid-feedback">Please provide a valid email.</div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password..."
                required
                value={formData.password}
                onChange={handleChange}
              />
              <div className="invalid-feedback">Please provide a valid password.</div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-success w-100 py-2 d-flex justify-content-center"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <span>Sign Up</span>
              )}
            </button>

            {/* Link to Login */}
            <div className="text-center mt-2">
              <p>
                Already have an account?{" "}
                <NavLink to="/login">Sign in here</NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;