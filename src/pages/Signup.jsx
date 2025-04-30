import iconEventManagement from "../assets/iconEvent.png";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "", // Yangi maydon qo'shildi
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Telefon raqamini validatsiya qilish
    const phoneRegex =
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Invalid phone number format.");
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("/register", formData, {
        timeout: 10000,
      });

      if (response.status >= 200 && response.status < 300) {
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          username: "",
          phoneNumber: "", // Tozalash
        });

        toast.success("Registration successful! You can now login.");
        navigate("/login", { replace: true });
      } else {
        throw new Error(response.statusText || "Registration failed");
      }
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.statusText ||
          "Registration failed";

        if (err.response.status === 409) {
          errorMessage = "User with this email already exists.";
        } else if (err.response.status === 400) {
          errorMessage = "Invalid registration data. Please check your inputs.";
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid bg-img d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="bg-white p-4 rounded shadow-sm"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="text-center mb-4">
          <img
            src={iconEventManagement}
            className="img-fluid"
            alt=""
            style={{ maxHeight: "80px", objectFit: "cover" }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label fw-bold">
                First Name:
              </label>
              <input
                type="text"
                className="form-control py-2"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                required
                value={formData.firstName}
                onChange={handleChange}
                style={{ backgroundColor: "#f8f9fa" }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="lastName" className="form-label fw-bold">
                Last Name:
              </label>
              <input
                type="text"
                className="form-control py-2"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                required
                value={formData.lastName}
                onChange={handleChange}
                style={{ backgroundColor: "#f8f9fa" }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-bold">
              Username:
            </label>
            <input
              type="text"
              className="form-control py-2"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              value={formData.username}
              onChange={handleChange}
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email address:
            </label>
            <input
              type="email"
              className="form-control py-2"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label fw-bold">
              Phone Number:
            </label>
            <input
              type="tel"
              className="form-control py-2"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+775 XX XXX-XX-XX"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{ backgroundColor: "#f8f9fa" }}
            />
            <small className="text-muted">Format: +775 XX XXX-XX-XX</small>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold">
              Password:
            </label>
            <input
              type="password"
              className="form-control py-2"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mb-3 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            Sign Up
          </button>

          {error && (
            <div className="alert alert-danger p-2 mb-3" role="alert">
              {error}
            </div>
          )}

          <div className="text-center pt-3">
            <p className="text-muted">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-primary text-decoration-none"
              >
                Sign In
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
