import { useState, useEffect, useRef } from "react";
import useFetch from "../hook/useFetch";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaPhone,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { Outlet, useParams, NavLink, useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = `http://localhost:8080/api/v1/events/${id}`;
  const eventsUrl = `http://localhost:8080/api/v1/events`;
  const { data: detailEvents, err, loading } = useFetch(url);

  // Состояния
  const [event, setEvent] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const mapRef = useRef(null);

  useEffect(() => {
  const token = localStorage.getItem("authToken"); // Токенни локал сақлашдан олинади
  fetch(eventsUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Токенни сарлавҳага қўшамиз
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      const filteredEvents = Array.isArray(data)
        ? data.filter((ev) => ev.id !== id)
        : [];
      setEvent(filteredEvents);
    })
    .catch((err) => console.error("Error fetching events:", err));
}, [id]);

  // Текущее время
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Инициализация карты
  useEffect(() => {
    if (!detailEvents?.address || !mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapRef.current,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=RnGN0JG3amT4NY2vFR3a",
      center: [69.2406, 41.2995], // Координаты по умолчанию (Тошкент)
      zoom: 12,
    });

    // Добавление маркера
    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([69.2165, 41.3405]) // Замените на координаты из detailEvents
      .setPopup(
        new maplibregl.Popup().setHTML(`
        <h4>${detailEvents?.title || "Загрузка..."}</h4>
        ${detailEvents?.address && `<p>${detailEvents.address}</p>`}
      `)
      )
      .addTo(map);
    return () => map.remove();
  }, [detailEvents]);

  const formattedDate = currentTime
    .toLocaleDateString("ru-RU")
    .replace(/\//g, ".");
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="bg-light min-vh-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster />
      {/* Основной контент */}
      <div className="container py-4">
        {/* Кнопка назад */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-primary rounded-pill px-4 back-btn"
          >
            <i className="bi bi-arrow-left me-2"></i>
            <span className="slide-in">Назад к событиям</span>
          </button>
        </div>

        {/* Карточка события с hover-эффектом */}
        <div className="card event-card shadow-lg mb-4 overflow-hidden border-0 transform-on-hover">
          <div className="row g-0">
            {/* Изображение с параллакс-эффектом */}
            <div className="col-md-6 position-relative image-parallax">
            <img
                  src={`https://picsum.photos/id/${detailEvents?.id}/800/600`}
                  className="img-fluid h-100 object-fit-cover"
                  alt={"Загрузка..."}
                  style={{ minHeight: "400px" }}
                />
              <div className="position-absolute top-0 end-0 m-3">
                <span
                  className={`badge rounded-pill px-3 py-2 badge-pulse ${
                    detailEvents?.online ? "bg-info" : "bg-danger"
                  }`}
                >
                  {detailEvents?.eventType || "CONFERENCE"}
                </span>
              </div>
              <div className="position-absolute bottom-0 start-0 end-0 p-4 event-title-overlay">
                <h2 className="mb-1 fw-bold text-white title-animate">
                  {detailEvents?.title || "Загрузка..."}
                </h2>
                <div className="d-flex align-items-center location-animate">
                  <FaMapMarkerAlt className="me-2" />
                  <span>{detailEvents?.address || "Адрес не указан"}</span>
                </div>
              </div>
            </div>

            {/* Информация с плавным появлением */}
            <div className="col-md-6">
              <div className="card-body h-100 p-4 d-flex flex-column content-fade-in">
                <div className="mb-4">
                  {/* Блок с датами */}
                  <div className="d-flex flex-wrap gap-4 mb-4 date-blocks">
                    <div className="d-flex align-items-center date-block">
                      <div className="icon-wrapper bg-light p-3 rounded-circle me-3 shine">
                        <FaCalendarAlt className="text-primary fs-5" />
                      </div>
                      <div>
                        <h6 className="mb-1 text-muted">Начало</h6>
                        <p className="mb-0 fw-bold date-text">
                          {new Date(detailEvents?.startDateTime).toLocaleString() ||
                            "Дата не указана"}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center date-block">
                      <div className="icon-wrapper bg-light p-3 rounded-circle me-3 shine">
                        <FaClock className="text-warning fs-5" />
                      </div>
                      <div>
                        <h6 className="mb-1 text-muted">Окончание</h6>
                        <p className="mb-0 fw-bold date-text">
                          {new Date(detailEvents?.endDateTime).toLocaleString() ||
                            "Дата не указана"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Описание с плавным появлением */}
                  <div className="mb-4 description-animate">
                    <h5 className="d-flex align-items-center mb-3 section-title">
                      <span className="highlight-dot"></span>
                      <span className="ms-3">Описание события</span>
                    </h5>
                    <div className="ps-4">
                      <p className="lead description-text">
                        {detailEvents?.description || "Описание отсутствует"}
                      </p>
                    </div>
                  </div>

                  {/* Контакты */}
                  <div className="d-flex flex-wrap gap-3 mb-4 contact-buttons">
                    <a
                      href={`tel:${detailEvents?.phoneNumber}`}
                      className="btn btn-outline-primary d-flex align-items-center contact-btn"
                    >
                      <FaPhone className="me-2" />
                      <span>{detailEvents?.phoneNumber || "Номер не указан"}</span>
                    </a>
                    <a
                      href={`mailto:${detailEvents?.email}`}
                      className="btn btn-outline-danger d-flex align-items-center contact-btn"
                    >
                      <FaEnvelope className="me-2" />
                      <span>{detailEvents?.email || "Email не указан"}</span>
                    </a>
                  </div>
                </div>

                {/* Интерактивная карта */}
                <div className="mt-auto map-container">
                  <div className="card border-0 shadow-sm map-card">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                      <h6 className="mb-0 d-flex align-items-center">
                        <FaMapMarkerAlt className="text-danger me-2 pulse-icon" />
                        Местоположение
                      </h6>
                      {detailEvents?.address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            detailEvents.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center map-link"
                        >
                          <i className="bi bi-box-arrow-up-right me-1"></i>{" "}
                          Открыть в Картах
                        </a>
                      )}
                    </div>
                    <div
                      className="card-body p-0"
                      style={{ height: "250px" }}
                    >
                      <div
                        ref={mapRef}
                        className="h-100 w-100 interactive-map"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Другие события */}
        <div className="mb-5">
          <h3 className="mb-4 text-center">Другие события</h3>
          <div className="row g-4">
            {event.map((ev) => (
              <div className="col-md-6 col-lg-4" key={ev.id}>
                <div
                  className="card h-100 shadow-sm border-0 hover-shadow transition-all cursor-pointer"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    navigate(`/${ev.id}`);
                  }}
                >
                  {ev.img && (
                    <img
                      src={ev.img}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt={ev.title}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{ev.title}</h5>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FaMapMarkerAlt className="me-2" size={14} />
                      {ev.address && <small>{ev.address}</small>}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`badge ${
                          ev.online ? "bg-info" : "bg-danger"
                        }`}
                      >
                        {ev.eventType}
                      </span>
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {new Date(ev.startDateTime).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default EventDetail;