import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { authService } from "../api/authService";

function EditEvent() {
  const { idEvent } = useParams();
  const navigate = useNavigate();
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
    images: [], // Массив объектов
    coverImageIndex: 0,
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Cities и tagIdsCategories остаются как в оригинале
  const cities = [
    { id: 1, name: "Алматы" },
    { id: 2, name: "Астана" },
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

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`http://localhost:8080/api/v1/events/${idEvent}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eventData = response.data;
        setFormData({
          ...eventData,
          startDateTime: eventData.startDateTime.slice(0, 16),
          endDateTime: eventData.endDateTime.slice(0, 16),
          cityId: eventData.city?.id?.toString() || "",
          tagIds: eventData.tagIds.map((id) => id.toString()),
          images: eventData.images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            description: img.description,
            coverImage: img.coverImage,
          })),
          coverImageIndex: eventData.images.findIndex((img) => img.coverImage),
        });
        setInitialLoad(false);
      } catch (error) {
        toast.error("Іс-шара жүктеу кезінде қате орын алды");
        navigate("/admin/changes");
      }
    };

    if (idEvent) fetchEventData();
  }, [idEvent, navigate]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "events");

      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dmnx1jyqq/image/upload ", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        uploadedImages.push({
          id: null, // Новые изображения не имеют id
          imageUrl: data.secure_url,
          description: null,
          coverImage: false,
        });
      } catch (error) {
        console.error("Сурет жүктеу кезінде қате:", error);
        toast.error("Сурет жүктеу кезінде қате!");
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedTags = checked ? [...prev.tagIds, value] : prev.tagIds.filter((id) => id !== value);
      return { ...prev, tagIds: updatedTags };
    });
  };

  const validateUrl = (url) => {
    if (!formData.online || !url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Проверка валидности формы
    if (!form.checkValidity() || !validateUrl(formData.onlineLink)) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Проверка обязательных полей
    if (!formData.title || !formData.description || !formData.startDateTime || !formData.endDateTime) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (!formData.eventType) {
      toast.error("Выберите тип события");
      return;
    }

    if (isNaN(formData.capacity) || formData.capacity <= 0) {
      toast.error("Вместимость должна быть положительным числом");
      return;
    }

    if (formData.tagIds.length === 0) {
      toast.error("Добавьте хотя бы один тег");
      return;
    }

    // Проверка cityId и address для офлайн-событий
    if (!formData.online && (!formData.cityId || !formData.address)) {
      toast.error("Заполните город и адрес для офлайн-события");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      // Формирование данных для отправки
      const requestData = {
        title: formData.title,
        description: formData.description,
        startDateTime: `${formData.startDateTime}:00`,
        endDateTime: `${formData.endDateTime}:00`,
        eventType: formData.eventType,
        capacity: parseInt(formData.capacity),
        cityId: formData.online ? null : parseInt(formData.cityId),
        address: formData.online ? null : formData.address,
        online: formData.online,
        onlineLink: formData.onlineLink,
        tagIds: formData.tagIds.map((id) => parseInt(id)),
        images: formData.images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          description: img.description,
          coverImage: img.coverImage,
        })),
      };

      // Логирование данных перед отправкой
      console.log("Request Data:", requestData);

      // Отправка PUT-запроса
      await axios.put(`http://localhost:8080/api/v1/events/${idEvent}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Іс-шара сәтті жаңартылды!");
      navigate("/admin/changes");
    } catch (error) {
      console.error("Error Response:", error.response?.data); // Логирование ошибки

      // Извлечение детальной информации об ошибке
      if (error.response?.data?.details) {
        const errorMessages = error.response.data.details.join(", ");
        toast.error(`Ошибка: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || "Произошла ошибка при обновлении события");
      }

      if (error.response?.status === 401) {
        authService.logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return <div>Жүктелуде...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 text-center">
          <h2 className="h4 mb-0 text-primary">Іс-шараны өңдеу</h2>
          <p className="text-muted mb-0">Іс-шара параметрлерін төменде өзгертуге болады</p>
        </div>

        <div className="card-body p-3 p-lg-4">
          <form noValidate className={`needs-validation ${validated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
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
                  <div className="invalid-feedback">Қатысушылар санын көрсетіңіз.</div>
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
                  <div className="invalid-feedback">Іс-шара сипаттамасын қосыңз.</div>
                </div>
              </div>
            </div>

            {/* Расмлар */}
            <div className="mb-4">
              <h5 className="mb-3 text-info">Расмлар</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="images" className="form-label fw-medium">
                    Жаңа суреттер қосу
                  </label>
                  <input type="file" className="form-control" id="images" multiple onChange={handleImageUpload} />
                  <div className="mt-3">
                    {formData.images.length > 0 && (
                      <div className="d-flex flex-wrap gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={image}
                              alt={`Preview ${index}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                border: formData.coverImageIndex === index ? "3px solid #0d6efd" : "1px solid #dee2e6",
                              }}
                              className="rounded"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index),
                                  coverImageIndex:
                                    prev.coverImageIndex === index
                                      ? 0
                                      : prev.coverImageIndex > index
                                      ? prev.coverImageIndex - 1
                                      : prev.coverImageIndex,
                                }));
                              }}
                            >
                              ×
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                formData.coverImageIndex === index ? "btn-primary" : "btn-outline-primary"
                              } position-absolute bottom-0 start-0`}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.map((img, i) => ({
                                    ...img,
                                    coverImage: i === index,
                                  })),
                                  coverImageIndex: index,
                                }));
                              }}
                            >
                              <i className="bi bi-star-fill"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                  <label htmlFor="startDateTime" className="form-label fw-medium">
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
                  <div className="invalid-feedback">Басталу күні мен уақыты міндетті.</div>
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
                  <div className="invalid-feedback">Аяқталу күні мен уақыты міндетті.</div>
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
                    <label htmlFor="onlineLink" className="form-label fw-medium">
                      Онлайн сілтеме <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      className={`form-control ${validated && !validateUrl(formData.onlineLink) ? "is-invalid" : ""}`}
                      name="onlineLink"
                      value={formData.onlineLink}
                      onChange={handleChange}
                      id="onlineLink"
                      placeholder="Zoom, Google Meet ссылкасы"
                      required={formData.online}
                    />
                    <div className="invalid-feedback">Жарамды URL мекенжайын енгізіңіз</div>
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
                          formData.tagIds.includes(tag.id.toString()) ? "active-tag" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          backgroundColor: tag.colorCode,
                          color: "#fff",
                          transition: "all 0.3s ease",
                          boxShadow: formData.tagIds.includes(tag.id.toString())
                            ? "0 6px 12px rgba(247, 5, 5, 0.2)"
                            : "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: formData.tagIds.includes(tag.id.toString()) ? "4px solid #544545" : "none",
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
                  <div className="invalid-feedback">Кем дегенде бір санатты таңдаңыз.</div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-muted small mb-0" style={{ fontSize: "0.875rem" }}>
                  Іс-шараға бірнеше санат таңдай аласыз.
                </p>
              </div>
            </div>

            {/* Кнопки */}
            <div className="d-flex justify-content-between flex-column flex-lg-row pt-3 border-top">
              <NavLink to="/admin/events" className="btn btn-outline-danger mx-2 w-100 w-lg-auto my-2 my-lg-0">
                Бас тарту
              </NavLink>
              <button type="submit" className="btn btn-primary mx-2 w-100 w-lg-auto" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Сақтау...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    Өзгерістерді сақтау
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

export default EditEvent;
