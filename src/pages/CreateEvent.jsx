import { authService } from "../api/authService";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    cityId: "",
    address: "",
    eventType: "",
    capacity: "",
    online: false,
    onlineLink: "",
    tagIds: [],
  });

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1", // Yangi API manzili
  });

  const navigate = useNavigate();

  // State variables
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cities of Kazakhstan with IDs
  const cities = [
    { id: 1, name: "Алматы" },
    { id: 2, name: "Нур-Султан" },
    { id: 3, name: "Шымкент" },
    { id: 4, name: "Караганда" },
    { id: 5, name: "Актобе" },
    { id: 6, name: "Тараз" },
    { id: 7, name: "Павлодар" },
    { id: 8, name: "Усть-Каменогорск" },
    { id: 9, name: "Семей" },
    { id: 10, name: "Атырау" },
    { id: 11, name: "Кокшетау" },
    { id: 12, name: "Талдыкорган" },
    { id: 13, name: "Экибастуз" },
    { id: 14, name: "Кызылорда" },
    { id: 15, name: "Жезказган" },
    { id: 16, name: "Рудный" },
    { id: 17, name: "Кентау" },
    { id: 18, name: "Темиртау" },
    { id: 19, name: "Туркестан" },
  ];

  // Категории для тегов
  const tagIdsCategories = [
    { id: 1, name: "Технология", colorCode: "#FF5733" },
    { id: 2, name: "Денсаулық", colorCode: "#33FF57" },
    { id: 3, name: "Білім", colorCode: "#3357FF" },
    { id: 4, name: "Спорт", colorCode: "#FF33A1" },
    { id: 5, name: "Өнер", colorCode: "#FF8C33" },
    { id: 6, name: "Музыка", colorCode: "#33FFA1" },
    { id: 7, name: "Тамақ", colorCode: "#A133FF" },
    { id: 8, name: "Саяхат", colorCode: "#FF33A1" },
    { id: 9, name: "Бизнес", colorCode: "#FF5733" },
    { id: 10, name: "Қоршаған орта", colorCode: "#33FF57" },
    { id: 11, name: "Мәдениет", colorCode: "#3357FF" },
    { id: 12, name: "Қоғам", colorCode: "#FF33A1" },
    { id: 13, name: "Өмір салты", colorCode: "#FF8C33" },
    { id: 14, name: "Ғылым", colorCode: "#33FFA1" },
];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      toast.error("Пожалуйста, заполните все обязательные поля.");
      setValidated(true);
      return;
    }

    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      toast.error("Вы не авторизованы! Пожалуйста, войдите в систему.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Используем данные из formData
      const requestData = {
        ...formData,
        capacity: parseInt(formData.capacity), // Преобразуем в число
        cityId: formData.online ? null : formData.cityId, // Если онлайн, cityId = null
        address: formData.online ? null : formData.address, // Если онлайн, address = null
        onlineLink: formData.online ? formData.onlineLink : null, // Если онлайн, добавляем ссылку
        tagIds: formData.tagIds.map((id) => parseInt(id)), // Преобразуем tagIds в массив чисел
      };

      // Отправляем данные на API
      const response = await axiosInstance.post("/events", requestData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTimeout(() => {
        setLoading(false);
        toast.success("Мероприятие успешно создано!");
        navigate("/admin");
        // Сброс полей формы
        setFormData({
          title: "",
          description: "",
          startDateTime: "",
          endDateTime: "",
          cityId: "",
          address: "",
          eventType: "",
          capacity: "",
          online: false,
          onlineLink: "",
          tagIds: [],
        });
        setValidated(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 401) {
        toast.error("Сессия истекла! Пожалуйста, войдите снова.");
        authService.logout();
        navigate("/login");
      } else {
        toast.error("Ошибка при создании мероприятия: " + err.message);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Обработчик изменения тегов
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      let updatedTags = [...prevData.tagIds];
      if (checked) {
        updatedTags.push(value); // Добавляем тег
      } else {
        updatedTags = updatedTags.filter((id) => id !== value); // Удаляем тег
      }
      return { ...prevData, tagIds: updatedTags };
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 text-center">
          <h2 className="h4 mb-0 text-primary">Жаңа іс-шара құру</h2>
          <p className="text-muted mb-0">
            Іс-шараны құру үшін төмендегі деректерді толтырыңыз.
          </p>
        </div>
        <div className="card-body p-3 p-lg-4">
          <form
            noValidate
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            onSubmit={handleSubmit}
          >
            {/* Негізгі ақпарат */}
            <div className="mb-4">
              <h5 className="mb-3 text-info">Негізгі ақпарат</h5>
              <div className="row g-3">
                <div className="col-12 col-lg-6">
                  <label htmlFor="title" className="form-label fw-medium">
                    Атауы <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    id="title"
                    onChange={handleChange}
                    placeholder="Іс-шара атауын енгізіңіз"
                    required
                  />
                  <div className="invalid-feedback">Атауы міндетті.</div>
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="capacity" className="form-label fw-medium">
                    Қатысушылар саны <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    id="capacity"
                    placeholder="Қатысушылар санын енгізіңіз"
                    required
                    min="1"
                  />
                  <div className="invalid-feedback">
                    Қатысушылар санын көрсетіңіз.
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="description" className="form-label fw-medium">
                    Сипаттама <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Іс-шараны сипаттаңыз..."
                    rows="4"
                  ></textarea>
                  <div className="invalid-feedback">
                    Іс-шара сипаттамасын қосыңыз.
                  </div>
                </div>
              </div>
            </div>

            {/* Іс-шара түрі */}
            <div className="mb-4">
              <h5 className="mb-3 text-info">Іс-шара түрі</h5>
              <div className="row g-3">
                <div className="col-12 col-lg-6">
                  <select
                    className="form-select"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    id="eventType"
                    required
                  >
                    <option value="">Іс-шара түрін таңдаңыз</option>
                    <option value="CONFERENCE">Конференция</option>
                    <option value="MEETUP">Кездесу</option>
                    <option value="WORKSHOP">Жұмысшы орталық</option>
                    <option value="MASTERCLASS">Шеберлік сабағы</option>
                  </select>
                  <div className="invalid-feedback">Түрі міндетті.</div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="online"
                      checked={formData.online}
                      onChange={handleChange}
                      id="online"
                    />
                    <label htmlFor="online" className="form-check-label">
                      Онлайн іс-шара
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Күні мен уақыты */}
            <div className="mb-4">
              <h5 className="mb-3 text-info">Күні мен уақыты</h5>
              <div className="row g-3">
                <div className="col-12 col-lg-6">
                  <label
                    htmlFor="startDateTime"
                    className="form-label fw-medium"
                  >
                    Басталу күні мен уақыты <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="startDateTime"
                    value={formData.startDateTime}
                    onChange={handleChange}
                    id="startDateTime"
                    required
                  />
                  <div className="invalid-feedback">
                    Басталу күні мен уақыты міндетті.
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <label htmlFor="endDateTime" className="form-label fw-medium">
                    Аяқталу күні мен уақыты <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="endDateTime"
                    value={formData.endDateTime}
                    onChange={handleChange}
                    id="endDateTime"
                    required
                  />
                  <div className="invalid-feedback">
                    Аяқталу күні мен уақыты міндетті.
                  </div>
                </div>
              </div>
            </div>

            {/* Орналасқан жері */}
            {!formData.online && (
              <div className="mb-4">
                <h5 className="mb-3 text-info">Орналасқан жері</h5>
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label htmlFor="cityId" className="form-label fw-medium">
                      Қала <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleChange}
                      id="cityId"
                      required={!formData.online}
                    >
                      <option value="">Қаланы таңдаңыз</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">Қала міндетті.</div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="address" className="form-label fw-medium">
                      Мекен-жай <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      id="address"
                      placeholder="Мекен-жайды енгізіңіз"
                      required={!formData.online}
                    />
                    <div className="invalid-feedback">Мекен-жай міндетті.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Онлайн мәліметтер */}
            {formData.online && (
              <div className="mb-4">
                <h5 className="mb-3 text-info">Онлайн мәліметтер</h5>
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label
                      htmlFor="onlineLink"
                      className="form-label fw-medium"
                    >
                      Онлайн іс-шара сілтемесі
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      name="onlineLink"
                      value={formData.onlineLink}
                      onChange={handleChange}
                      id="onlineLink"
                      placeholder="Сілтемені енгізіңіз (мысалы, Zoom URL)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Тегтер */}
            <div className="mb-4">
              <h5 className="mb-3 text-info">Санаттар</h5>
              <div className="row g-3">
                <div className="col-12 d-flex flex-wrap gap-2">
                  {tagIdsCategories.map((tag) => (
                    <div key={tag.id} className="form-check form-check-inline">
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className={`btn rounded-pill py-2 px-3 ${
                          formData.tagIds.includes(tag.id.toString())
                            ? "active-tag"
                            : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          backgroundColor: tag.colorCode,
                          color: "#fff",
                          transition: "all 0.3s ease",
                          boxShadow: formData.tagIds.includes(tag.id.toString())
                            ? "0 6px 12px rgba(247, 5, 5, 0.2)"
                            : "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: formData.tagIds.includes(tag.id.toString())
                            ? "4px solid #544545"
                            : "none",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="d-none"
                          id={`tag-${tag.id}`}
                          value={tag.id}
                          checked={formData.tagIds.includes(tag.id.toString())}
                          onChange={handleTagChange}
                        />
                        {tag.name}
                      </label>
                    </div>
                  ))}
                  <div className="invalid-feedback">
                    Кем дегенде бір санатты таңдаңыз.
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p
                  className="text-muted small mb-0"
                  style={{
                    fontSize: "0.875rem",
                  }}
                >
                  Іс-шараға бірнеше санат таңдай аласыз.
                </p>
              </div>
            </div>

            {/* Форма әрекеттері */}
            <div className="d-flex justify-content-between flex-column flex-lg-row pt-3 border-top">
              <NavLink
                to="/admin"
                className="btn btn-outline-danger mx-2 w-100 w-lg-auto my-2 my-lg-0"
              >
                Бас тарту
              </NavLink>
              <button
                type="submit"
                className="btn btn-primary mx-2 w-100 w-lg-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Құрылуда...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Іс-шараны құру
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
