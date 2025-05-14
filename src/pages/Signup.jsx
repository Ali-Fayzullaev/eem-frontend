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
    phoneNumber: "", // Жаңа өріс қосылды
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

    // Телефон нөмірін тексеру
    const phoneRegex =
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Телефон нөмірінің форматы дұрыс емес.");
      toast.error("Дұрыс телефон нөмірін енгізіңіз.");
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
          phoneNumber: "", // Тазалау
        });

        toast.success("Тіркелу сәтті! Енді кіре аласыз.");
        navigate("/login", { replace: true });
      } else {
        throw new Error(response.statusText || "Тіркелу сәтсіз аяқталды");
      }
    } catch (err) {
      let errorMessage = "Қандай да бір қате орын алды. Қайталап көріңіз.";

      if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Серверге қосылу мүмкін емес. Интернет қосылымыңызды тексеріңіз.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Сұраныс уақыты асып кетті. Қайталап көріңіз.";
      } else if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.statusText ||
          "Тіркелу сәтсіз аяқталды";

        if (err.response.status === 409) {
          errorMessage = "Осы электрондық пошта мекенжайымен тіркелген пайдаланушы бар.";
        } else if (err.response.status === 400) {
          errorMessage = "Тіркелу деректері дұрыс емес. Енгізілген мәліметтерді тексеріңіз.";
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Тіркелу қатесі:", err);
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
                Аты:
              </label>
              <input
                type="text"
                className="form-control py-2"
                id="firstName"
                name="firstName"
                placeholder="Атыңызды енгізіңіз"
                required
                value={formData.firstName}
                onChange={handleChange}
                style={{ backgroundColor: "#f8f9fa" }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="lastName" className="form-label fw-bold">
                Тегі:
              </label>
              <input
                type="text"
                className="form-control py-2"
                id="lastName"
                name="lastName"
                placeholder="Тегіңізді енгізіңіз"
                required
                value={formData.lastName}
                onChange={handleChange}
                style={{ backgroundColor: "#f8f9fa" }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-bold">
              Пайдаланушы аты:
            </label>
            <input
              type="text"
              className="form-control py-2"
              id="username"
              name="username"
              placeholder="Пайдаланушы атыңызды енгізіңіз"
              required
              value={formData.username}
              onChange={handleChange}
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Электрондық пошта:
            </label>
            <input
              type="email"
              className="form-control py-2"
              id="email"
              name="email"
              placeholder="Электрондық поштаңызды енгізіңіз"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label fw-bold">
              Телефон нөмірі:
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
            <small className="text-muted">Формат: +775 XX XXX-XX-XX</small>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold">
              Құпия сөз:
            </label>
            <input
              type="password"
              className="form-control py-2"
              id="password"
              name="password"
              placeholder="Құпия сөзіңізді енгізіңіз"
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
            Тіркелу
          </button>

          {error && (
            <div className="alert alert-danger p-2 mb-3" role="alert">
              {error}
            </div>
          )}

          <div className="text-center pt-3">
            <p className="text-muted">
              Тіркелгіңіз бар ма?{" "}
              <NavLink
                to="/login"
                className="text-primary text-decoration-none"
              >
                Кіру
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;