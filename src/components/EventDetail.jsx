import { useState, useEffect, useRef } from "react";
import useFetch from "../hook/useFetchh";
import { Carousel } from "react-bootstrap";
import "../UserLayout.css";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaPhone,
  FaHeart,
  FaRegHeart,
  FaCheck,
  FaVideo,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import "react-toastify/dist/ReactToastify.css";
import { authService } from "../api/authService";
import dayjs from "dayjs";
import maplibregl, { derefLayers } from "maplibre-gl";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = `http://localhost:8080/api/v1/events/${id}`;
  const eventsUrl = `http://localhost:8080/api/v1/events`;
  const { data: detailEvents, err, loading, refetch } = useFetch(url);
  const { data: events } = useFetch(eventsUrl);
  const token = localStorage.getItem("accessToken");

  // CONFIRMED OR UNCONFIRMED

  const { data: registrations } = useFetch("http://localhost:8080/api/v1/events/user/registrations");
  const eventIds = registrations?.map((reg) => String(reg.eventId)) || [];

  const [confirmed, setConfirmed] = useState(false);

  // id ва eventIds ўзгарганда ишга тушади
  useEffect(() => {
    if (eventIds.includes(id)) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  }, [registrations, id]);

  const imageUrl = detailEvents?.images?.[0] || `https://picsum.photos/id/${detailEvents?.id}/800/600`;
  // Состояния
  const [event, setEvent] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapLoaded, setMapLoaded] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const data = authService.getCurrentUser();
    if (data) {
      setCurrentUser(data);
    }
  }, []);

  // Текущее время
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mapRef = useRef(null); // Karta uchun ref
  const mapInstance = useRef(null); // Karta obyekti uchun ref

  useEffect(() => {
    if (!detailEvents?.address || mapInstance.current) return;

    // DOM element mavjudligini tekshiramiz
    if (mapRef.current) {
      const coordinates = detailEvents.coordinates
        ? detailEvents.coordinates.split(",").map(Number)
        : [69.2406, 41.2995]; // Standart koordinatalar (Toshkent)

      // Karta yaratish
      mapInstance.current = new maplibregl.Map({
        container: mapRef.current, // DOM element
        style: "https://api.maptiler.com/maps/streets/style.json?key=RnGN0JG3amT4NY2vFR3a ",
        center: coordinates,
        zoom: 14,
      });
    }
  }, [detailEvents]);

  // Форматирование даты и времени
  const formatDateTime = (dateString) => {
    if (!dateString) return "Дата не указана";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Стейтни инициализация qilamiz
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("refreshToken"); // Foydalanuvchi tokenini olish
        if (!token) return; // Token mavjud emas bo'lsa tekshirishni to'xtatamiz

        const response = await fetch(
          `http://localhost:8080/api/v1/events/user/registrations`, // Registratsiyalarni olish
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }, // Token bilan so'rov jo'natamiz
          }
        );

        if (!response.ok) throw new Error("Server javobi xato");

        const registrations = await response.json(); // Serverdan ma'lumotlarni olamiz
        const subscribed = registrations.some((reg) => reg.eventId === id); // Hozirgi eventga ro'yhatdan o'tganligini tekshiramiz
        setIsSubscribed(subscribed); // Agar ro'yhatdan o'tgan bo'lsa, steytga true ni o'tkazamiz
      } catch (error) {
        console.error("Tekshirishda xatolik:", error);
      }
    };

    checkSubscription();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("refreshToken"); // Пайдаланушының токенін алу
      if (!token) {
        toast.error("Авторизация қажет!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const method = isSubscribed ? "DELETE" : "POST"; // Жағдайға қарай сұрау түрін таңдаймыз
      const response = await fetch(`http://localhost:8080/api/v1/events/${id}/registrations`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`, // Токенмен сұрау жібереміз
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: id }), // Іс-шара ID-ін жібереміз
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Сұрауда қате!");
      }

      setIsSubscribed(!isSubscribed); // Статусты ауыстырамыз
      setConfirmed(true);
      toast.success(!isSubscribed ? "Сіз сәтті тіркелдіңіз!" : "Сіз тіркелуден бас тарттыңыз!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Қате:", error);
      toast.error(
        error.message === "User is already registered for this event"
          ? "Сіз бұл іс-шараға тіркелгенсіз"
          : "Іс-шараға орын қалмады",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  // favorited or unFavarites
  const handleFov = async (id, isCurrentlyFavorited) => {
    try {
      const method = isCurrentlyFavorited ? "DELETE" : "POST";
      const response = await fetch(`http://localhost:8080/api/v1/favorites/${id}`, {
        // ${id} қолдану
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log("Сервер қатесі");
      }

      const action = isCurrentlyFavorited ? "өшірілді" : "қосылды";

      refetch();
    } catch (err) {
      console.error("Қате пайда болды:", err);
      toast.error(err.message || "Өзгерту кезінде қате пайда болды");
    }
  };

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

  const filteredTags = tagIdsCategories.filter((category) => detailEvents?.tagIds?.includes(category.id));

  return (
    <div className="bg-light min-vh-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster />

      {/* Основной контент */}
      <div className="container py-4">
        {/* Кнопка назад */}
        <div className="mb-4">
          <button
            onClick={() =>
              navigate(`/${currentUser && currentUser.role === "admin" && "meneger" ? "admin" : "user"}/events`)
            }
            className="btn btn-outline-primary rounded-pill px-4 back-btn d-flex align-items-center"
          >
            <i className="bi bi-arrow-left me-2"></i>
            <span className="slide-in">Артқа</span>
          </button>
        </div>

        {/* Карточка события */}
        <div className="card event-card shadow-lg mb-4 overflow-hidden border-0 transform-on-hover transition-all">
          <div className="row g-0">
            {/* Изображение */}

            <div className="col-lg-6 position-relative">
              <div className="image-container h-90">
                {detailEvents?.images?.length > 0 ? (
                  <Carousel fade interval={3000}>
                    {detailEvents.images.map((img, index) => {
                      // Находим соответствующую регистрацию для этого события
                      const eventRegistration = registrations?.find((reg) => reg.eventId === detailEvents.id);

                      return (
                        <Carousel.Item key={img.id}>
                          <div className="position-relative">
                            <img
                              className="d-block w-100"
                              src={img.imageUrl}
                              alt={`Image ${index + 1}`}
                              style={{
                                height: "600px",
                                objectFit: "cover",
                                filter: "brightness(0.9)",
                              }}
                            />

                            {/* Остальной код карусели... */}
                            <div className="position-absolute top-0 end-0 m-3">
                              <span
                                className={`badge rounded-pill px-3 py-2 ${
                                  detailEvents?.online ? "bg-info" : "bg-danger"
                                } pulse`}
                                style={{
                                  fontSize: "0.8rem",
                                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                                }}
                              >
                                {detailEvents?.eventType || "CONFERENCE"}
                                <span className="ms-2">{detailEvents?.online ? "ONLINE" : "OFFLINE"}</span>
                              </span>
                            </div>

                            <div
                              className="position-absolute bottom-0 start-0 end-0 p-4"
                              style={{
                                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                              }}
                            >
                              <h2
                                className="mb-1 fw-bold text-white"
                                style={{
                                  fontSize: "2rem",
                                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                                }}
                              >
                                {detailEvents?.title || "Загрузка..."}
                              </h2>
                              <div className="d-flex align-items-center text-white mt-2">
                                <span
                                  style={{
                                    fontSize: "1rem",
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                                  }}
                                >
                                  {detailEvents?.online
                                    ? ""
                                    : (
                                        <span>
                                          <FaMapMarkerAlt className="me-2" style={{ fontSize: "1.2rem" }} />{" "}
                                          {detailEvents?.address}
                                        </span>
                                      ) || "Адрес не указан"}
                                </span>
                              </div>

                              {/* Дополнительная информация из регистрации */}
                              {eventRegistration && (
                                <div className="mt-2 text-white">
                                  <small>
                                    <i className="bi bi-calendar-check me-1"></i>
                                    Зарегистрирован: {dayjs(eventRegistration.registrationDate).format("DD.MM.YYYY")}
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </Carousel.Item>
                      );
                    })}
                  </Carousel>
                ) : (
                  <div className="position-relative h-100">
                    {/* Аналогично для случая без изображений */}
                    <img
                      src={`https://picsum.photos/id/${detailEvents?.id}/800/600`}
                      className="img-fluid w-100  object-cover"
                      alt={detailEvents?.title || "Событие"}
                      style={{ filter: "brightness(0.9)" }}
                    />

                    {/* Добавляем блок регистрации и здесь */}
                    {registrations?.find((reg) => reg.eventId === detailEvents?.id) && (
                      <div className="position-absolute top-0 start-0 m-3">
                        <span
                          className="badge rounded-pill px-3 py-2 bg-success pulse"
                          style={{
                            fontSize: "0.8rem",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                          }}
                        >
                          Вы зарегистрированы
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="d-flex flex-wrap gap-1 justify-content-center  mt-3">
                {filteredTags.map((tag) => (
                  <span
                    key={tag.id}
                    style={{
                      backgroundColor: tag.colorCode,
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "500",
                      fontSize: "14px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                      display: "inline-block",
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Информация о событии */}
            <div className="col-lg-6">
              <div className="card-body h-100 p-4 d-flex flex-column">
                <div className="d-flex justify-content-end mb-3 gap-2">
                  <button
                    className="btn btn-outline-info pt-2 d-flex align-items-center justify-content-center"
                    onClick={() => handleFov(detailEvents.id, detailEvents.favorited)}
                  >
                    <input
                      type="checkbox"
                      className="heart-checkbox"
                      id={`heart-${detailEvents?.id}`}
                      checked={detailEvents?.favorited || false}
                      onChange={() => {}} // React warning-тен құтылу үшін
                      readOnly // Интерактивті өзгертуге жол бермеу
                    />
                    <label htmlFor={`heart-${detailEvents?.id}`} className="heart-label">
                      <i className="bi bi-heart-fill heart-icon"></i>
                    </label>
                  </button>
                  <button
                    className={`btn rounded-pill px-3 py-2 d-flex align-items-center justify-content-center ${
                      confirmed ? "btn-danger" : "btn-outline-danger"
                    }`}
                    onClick={handleSubscribe}
                    style={{
                      transition: "all 0.3s ease",
                      borderWidth: "2px",
                      gap: "8px",
                      ...(confirmed
                        ? {
                            boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
                          }
                        : {}),
                    }}
                  >
                    {confirmed ? (
                      <>
                        <FaCheck size={16} className="text-white" />
                        <span className="text-white">Тіркелдіңіз</span>
                      </>
                    ) : (
                      <>
                        <FaRegHeart size={16} className="text-danger" />
                        <span className="text-danger">Тіркелу</span>
                      </>
                    )}
                  </button>
                  <button className="btn btn-dark">
                    <Link
                      to={`/${
                        (currentUser && currentUser?.role === "admin") || currentUser?.role === "meneger"
                          ? "admin"
                          : "user"
                      }/pay/${detailEvents?.id}`}
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      Төлеу : 56$
                    </Link>
                  </button>
                </div>

                {/* Блок с датами */}
                <div className="d-flex flex-wrap gap-4 mb-4">
                  <div className="d-flex align-items-center flex-grow-1">
                    <div className="icon-wrapper bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <FaCalendarAlt className="text-primary fs-5" />
                    </div>
                    <div>
                      <h6 className="mb-1 text-muted">Начало</h6>
                      <p className="mb-0 fw-bold">{formatDateTime(detailEvents?.startDateTime)}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center flex-grow-1">
                    <div className="icon-wrapper bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                      <FaClock className="text-warning fs-5" />
                    </div>
                    <div>
                      <h6 className="mb-1 text-muted">Окончание</h6>
                      <p className="mb-0 fw-bold">{formatDateTime(detailEvents?.endDateTime)}</p>
                    </div>
                  </div>
                </div>

                {/* Описание */}
                <div className="mb-4">
                  <h5 className="d-flex align-items-center mb-3">
                    <span className="highlight-dot bg-primary"></span>
                    <span className="ms-3">Описание события</span>
                  </h5>
                  <div className="ps-4">
                    <p className="text-muted">{detailEvents?.description || "Описание отсутствует"}</p>
                  </div>
                </div>

                {/* Контакты */}
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <a
                    href={`tel:${detailEvents?.creatorPhoneNumber}`}
                    className="btn btn-outline-primary d-flex align-items-center"
                  >
                    <FaPhone className="me-2" />
                    <span>{detailEvents?.creatorPhoneNumber || "Номер не указан"}</span>
                  </a>
                  <a
                    href={`mailto:${detailEvents?.email}`}
                    className="btn btn-outline-danger d-flex align-items-center"
                  >
                    <FaEnvelope className="me-2" />
                    <span>{detailEvents?.creatorEmail || "Email не указан"}</span>
                  </a>
                </div>

                {detailEvents?.online ? (
                  <span className="online-indicator">
                    <FaVideo className="video-icon" />
                    <span className="online-text">online</span>
                    {confirmed && detailEvents?.onlineLink && (
                      <a
                        href={detailEvents.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="online-link"
                      >
                        Join Event
                      </a>
                    )}
                  </span>
                ) : (
                  <div className="mt-auto">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                        <h6 className="mb-0 d-flex align-items-center">
                          <FaMapMarkerAlt className="text-danger me-2" />
                          Местоположение
                        </h6>
                      </div>
                      <div className="card-body p-0" style={{ height: "250px" }}>
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDXJS2MqV8-fdce6HQIZ8GvrFiKs1iPRPM&q=${encodeURIComponent(
                            detailEvents?.address || "Kazakhstan"
                          )}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Другие события */}
        <div className="mb-5">
          <h3 className="mb-4 text-center fw-bold" style={{ fontSize: "1.8rem", color: "#2c3e50" }}>
            Другие события
          </h3>
          {events?.length > 0 ? (
            <div className="row g-4">
              {events?.map((ev) => (
                <div className="col-md-6 col-lg-4" key={ev.id}>
                  <div
                    className="card h-100 shadow-sm border-0 hover-shadow transition-all cursor-pointer"
                    style={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate(
                        `/${currentUser && currentUser.role === "admin" && "meneger" ? "admin" : "user"}/${ev.id}`
                      );
                    }}
                  >
                    <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                      {ev.images?.length > 0 ? (
                        <img
                          src={ev.images[0].imageUrl}
                          className="card-img-top w-100 h-100"
                          style={{
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          alt={ev.title}
                          onError={(e) => {
                            e.target.src = `https://picsum.photos/id/${ev.id}/400/300`;
                          }}
                        />
                      ) : (
                        <img
                          src={`https://picsum.photos/id/${ev.id}/400/300`}
                          className="card-img-top w-100 h-100"
                          style={{ objectFit: "cover" }}
                          alt={ev.title}
                        />
                      )}
                      <div className="position-absolute top-0 end-0 m-2">
                        <span
                          className={`badge rounded-pill px-2 py-1 ${ev.online ? "bg-info" : "bg-danger"}`}
                          style={{
                            fontSize: "0.75rem",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                          }}
                        >
                          {ev.eventType}
                        </span>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5
                        className="card-title mb-3"
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          color: "#34495e",
                        }}
                      >
                        {ev.title}
                      </h5>

                      <div className="d-flex align-items-center text-muted mb-3">
                        <FaMapMarkerAlt className="me-2" size={14} style={{ color: "#7f8c8d" }} />
                        <small style={{ fontSize: "0.85rem" }}>
                          {ev.online ? "Online мероприятие" : ev.address || "Адрес не указан"}
                        </small>
                      </div>

                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span
                          className={`badge rounded-pill px-2 py-1 ${ev.online ? "bg-info" : "bg-danger"}`}
                          style={{
                            fontSize: "0.75rem",
                          }}
                        >
                          {ev.online ? "ONLINE" : "OFFLINE"}
                        </span>

                        <small className="text-muted d-flex align-items-center" style={{ fontSize: "0.8rem" }}>
                          <FaCalendarAlt className="me-1" style={{ color: "#7f8c8d" }} />
                          {formatDateTime(ev.startDateTime)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted" style={{ fontSize: "1rem" }}>
                Других событий пока нет
              </p>
            </div>
          )}
        </div>
      </div>
      <Outlet />

      {/* Стили */}
      <style jsx>{`
        .event-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .image-container {
          position: relative;
          overflow: hidden;
        }
        .gradient-overlay {
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        }
        .highlight-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .icon-wrapper {
          transition: transform 0.3s ease;
        }
        .icon-wrapper:hover {
          transform: scale(1.1);
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .map-popup-title {
          font-size: 16px;
          margin-bottom: 5px;
          color: #333;
        }
        .map-popup-address {
          font-size: 14px;
          color: #666;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

export default EventDetail;
