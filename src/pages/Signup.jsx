// // import from react 
// import { useState } from "react";

// // impor img
// import iconEventManagement from "../assets/iconEvent.png";

// // import from RRD
// import { NavLink, useNavigate } from "react-router-dom";

// // import from axios

// import axios from "axios";

// // import from rht
// import toast from "react-hot-toast";



// function Signup() {
//     // useState
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [validated, setValidated] = useState(false);
//     const [username, setUsername] = useState("")
//     const [firstName, setFirstName] = useState("")
//     const [lastName, setLastName] = useState("")
//     const [loading, setLoading] = useState(false);
//     const [loaderBtn, setLoaderBtn] = useState(true);
//     const navigate = useNavigate()

//     const axiosInstance = axios.create({
//         baseURL: "https://67ddbf11471aaaa742826b6e.mockapi.io",
//       });
    
//       const handleSubmit = async (e) => {
//         e.preventDefault();
//         const form = e.currentTarget;
        
       
//         if (form.checkValidity() === false) {
//           e.stopPropagation();
//           setValidated(true);
//           toast.error("Please enter your email or password.");
//           return;
//         }
    
//         try {
//             setLoaderBtn(false);
//             const response = await axiosInstance.post("/login", { email, password, firstName, lastName, username });
//           setEmail("");
//           setPassword("");
//           setFirstName("");
//           setLastName("");
//           setUsername("");
//           setTimeout(() => {
//             setLoading(false);
//             toast.success(response.statusText);
//             navigate("/");
//             // setLoaderBtn(false);
//           }, 0);

//         }
        
        
//         catch (err) {
//           toast.error(err.message);
//           console.log(err);
//         }
    
//         setValidated(false);
//       };


//   return (
//     <div className="container h-100 w-100">
//       <div className="row d-flex justify-content-center ">
//         <div className="col-12 col-md-8 col-lg-6 col-xl-5 my-3">
//           <form
//             noValidate
//             validated={validated}
//             onSubmit={handleSubmit}
//             className={`p-4 border rounded shadow-sm bg-light ${validated ? "was-validated" : ""}`}
//           >
//             <div className="text-center mb-3">
//               <img
//                 src={iconEventManagement}
//                 alt="Event Management"
//                 className="img-fluid rounded-circle "
//                 style={{ maxHeight: "80px", objectFit: "cover" }}
//               />
//             </div>

//             {/* Name input */}
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
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//               />
//               <div className="invalid-feedback">
//                 Please provide your first name.
//               </div>
//             </div>

//             {/* Last Name input */}
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
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//               />
//               <div className="invalid-feedback">
//                 Please provide your last name.
//               </div>
//             </div>

//             {/* user Name  */}
//             <div className="mb-3">
//               <label htmlFor="lastName" className="form-label">
//                 Username:
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="username"
//                 name="username"
//                 placeholder="Enter your last username..."
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <div className="invalid-feedback">
//                 Please provide your last name.
//               </div>
//             </div>
            

//             {/* Email input */}
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

//             {/* Password input */}
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
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <div className="invalid-feedback">
//                 Please provide a valid password.
//               </div>
//             </div>

//             <button type="submit" className="btn btn-success w-100 py-2 d-flex justify-content-center">
//                  <span>{loaderBtn ? <span>Sign Up</span> : <span className="loaderBtn"></span>}</span>
//             </button>

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

  // Экземпляр axios
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth", // Замените на реальный URL
  });

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Отправка данных на сервер
      const response = await axiosInstance.post("/register", formData); // Исправлено на /register

      // Очистка формы
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        username: "",
      });

      // Уведомление об успехе
      toast.success(response.statusText || "Registration successful!");

      // Перенаправление на страницу входа
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      console.error(err);
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
            validated={validated}
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