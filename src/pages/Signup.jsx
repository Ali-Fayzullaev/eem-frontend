// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import iconEventManagement from "../assets/iconEvent.png";

// function Signup() {
//   // Состояния
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//     username: "",
//   });
//   const [validated, setValidated] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);
//   // Экземпляр axios
//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:8080/api/v1/auth", 
//   });

//   // Обработка изменения полей формы
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;
  
//     // Form validation
//     if (form.checkValidity() === false) {
//       e.stopPropagation();
//       setValidated(true);
//       toast.error("Please fill in all required fields correctly.");
//       return;
//     }
  
//     try {
//       setLoading(true);
      
//       // Clear any previous errors
//       setError(null);
  
//       // Send data to server with timeout
//       const response = await axiosInstance.post("/register", formData, {
//         timeout: 10000 // 10 second timeout
//       });
  
//       // Check for successful response (2xx status)
//       if (response.status >= 200 && response.status < 300) {
//         // Reset form
//         setFormData({
//           email: "",
//           password: "",
//           firstName: "",
//           lastName: "",
//           username: "",
//         });
//         setValidated(false);
  
//         // Show success message
//         toast.success("Registration successful! You can now login.");
  
//         // Redirect to login
//         navigate("/login", { replace: true });
//       } else {
//         // Handle non-2xx responses
//         throw new Error(response.statusText || "Registration failed");
//       }
//     } catch (err) {
//       let errorMessage = "Something went wrong. Please try again.";
  
//       // Handle different error cases
//       if (err.code === "ERR_NETWORK") {
//         errorMessage = "Cannot connect to server. Please check your internet connection.";
//       } else if (err.code === "ECONNABORTED") {
//         errorMessage = "Request timeout. Please try again.";
//       } else if (err.response) {
//         // Server responded with error status (4xx, 5xx)
//         errorMessage = err.response.data?.message || 
//                       err.response.statusText || 
//                       "Registration failed";
        
//         // Handle specific status codes
//         if (err.response.status === 409) {
//           errorMessage = "User with this email already exists.";
//         } else if (err.response.status === 400) {
//           errorMessage = "Invalid registration data. Please check your inputs.";
//         }
//       }
  
//       // Set error state and show toast
//       setError(errorMessage);
//       toast.error(errorMessage);
//       console.error("Registration error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="container h-100 w-100">
//       <div className="row d-flex justify-content-center">
//         <div className="col-12 col-md-8 col-lg-6 col-xl-5 my-3">
//           <form
//             noValidate
//             onSubmit={handleSubmit}
//             className={`p-4 border rounded shadow-sm bg-light ${validated ? "was-validated" : ""}`}
//           >
//             <div className="text-center mb-3">
//               <img
//                 src={iconEventManagement}
//                 alt="Event Management"
//                 className="img-fluid rounded-circle"
//                 style={{ maxHeight: "80px", objectFit: "cover" }}
//               />
//             </div>

//             {/* First Name */}
//             <div className="mb-3">
//               <label htmlFor="firstName" className="form-label">
//                 First Name:
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="firstName"
//                 name="firstName"
//                 placeholder="Enter your first name..."
//                 required
//                 value={formData.firstName}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">Please provide your first name.</div>
//             </div>

//             {/* Last Name */}
//             <div className="mb-3">
//               <label htmlFor="lastName" className="form-label">
//                 Last Name:
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="lastName"
//                 name="lastName"
//                 placeholder="Enter your last name..."
//                 required
//                 value={formData.lastName}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">Please provide your last name.</div>
//             </div>

//             {/* Username */}
//             <div className="mb-3">
//               <label htmlFor="username" className="form-label">
//                 Username:
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="username"
//                 name="username"
//                 placeholder="Enter your username..."
//                 required
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">Please provide a username.</div>
//             </div>

//             {/* Email */}
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
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">Please provide a valid email.</div>
//             </div>

//             {/* Password */}
//             <div className="mb-3">
//               <label htmlFor="password" className="form-label">
//                 Password:
//               </label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="password"
//                 name="password"
//                 placeholder="Enter your password..."
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               <div className="invalid-feedback">Please provide a valid password.</div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="btn btn-success w-100 py-2 d-flex justify-content-center"
//               disabled={loading}
//             >
//               {loading ? (
//                 <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//               ) : (
//                 <span>Sign Up</span>
//               )}
//             </button>

//             {/* Link to Login */}
//             <div className="text-center mt-2">
//               <p>
//                 Already have an account?{" "}
//                 <NavLink to="/login">Sign in here</NavLink>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;


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
    
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("/register", formData, {
        timeout: 10000
      });

      if (response.status >= 200 && response.status < 300) {
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          username: "",
        });
        
        toast.success("Registration successful! You can now login.");
        navigate("/login", { replace: true });
      } else {
        throw new Error(response.statusText || "Registration failed");
      }
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";
  
      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.response) {
        errorMessage = err.response.data?.message || 
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
    <div className="container-fluid bg-img d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="bg-white p-4 rounded shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
           <div className="text-center mb-4">
                    <img src={iconEventManagement} className="img-fluid"  alt="" style={{ maxHeight: "80px", objectFit: "cover" }} />
                  </div>



        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label fw-bold">First Name:</label>
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
              <label htmlFor="lastName" className="form-label fw-bold">Last Name:</label>
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
            <label htmlFor="username" className="form-label fw-bold">Username:</label>
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
            <label htmlFor="email" className="form-label fw-bold">Email address:</label>
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

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold">Password:</label>
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
            <p className="text-muted">Already have an account? <NavLink to="/login" className="text-primary text-decoration-none">Sign In</NavLink></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;