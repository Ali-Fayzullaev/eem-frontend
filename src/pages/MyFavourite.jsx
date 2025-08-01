import { useState, useEffect } from "react";
import { authService } from "../api/authService";
import useFetch from "../hook/useFetch";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";

function MyFavourite() {
  const [activeIndices, setActiveIndices] = useState({});

  // event type
  const eventTypeKazakh = {
    MASTERCLASS: "Мастер-класс",
    WORKSHOP: "Воркшоп",
    MEETUP: "Кездесу",
    CONFERENCE: "Конференция",
  };

  // useState
  const [show, setShow] = useState(true);

  const token = localStorage.getItem("refreshToken"); // Яхшилаштирилган: accessToken-ни файзасиз

  // API for events
  const {
    data: eventsFav,
    loading,
    error,
    refetch,
  } = useFetch(`http://localhost:8080/api/v1/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // image next prev
  const handlePrev = (eventId) => {
    setActiveIndices((prev) => {
      const currentEvent = eventsFav?.find((e) => e.id === eventId);
      const imagesCount = currentEvent?.images?.length || 1;
      if (!currentEvent || !imagesCount) return prev;
      const newIndex = prev[eventId] === 0 ? imagesCount - 1 : prev[eventId] - 1;
      return {
        ...prev,
        [eventId]: newIndex,
      };
    });
  };

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const data = authService.getCurrentUser();
    if (data) {
      setCurrentUser(data);
    }
  }, []);

  const handleNext = (eventId) => {
    setActiveIndices((prev) => {
      if (!eventsFav) return prev;

      const event = eventsFav.find((e) => e.id === eventId);
      if (!event) return prev;

      const imagesLength = event.images?.length || 0;
      if (imagesLength === 0) return prev;

      const currentIndex = prev[eventId] || 0;

      const newIndex = currentIndex === imagesLength - 1 ? 0 : currentIndex + 1;

      return {
        ...prev,
        [eventId]: newIndex,
      };
    });
  };

  const handleDeleteFav = async (id) => {
    try {
      const method = "DELETE";
      const response = await fetch(`http://localhost:8080/api/v1/favorites/${id}`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(`Іс-шара сәтті өшірілді!`);
        refetch();
      } else {
        // throw new Error("Сервер қатесі");
        console.log("Сервер қатесі");
      }
    } catch (err) {
      console.error("Қате пайда болды:", err);
      toast.error(err.message || "Өзгерту кезінде қате пайда болды");
    }
  };

  // Add to calendar function (placeholder)
  const addToCalendar = (event) => {
    toast.info("Add to calendar functionality would go here");
  };
  const handleOpenCloseAccordion = () => {
    setShow(!show);
  };

  return (
    <div className="container py-4">
      <Toaster position="top-right" />
      <ToastContainer position="bottom-right" />

      {/* Заголовок с анимацией */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0 text-gradient">
          <i className="bi bi-heart-fill me-2"></i>
           Таңдаулылар ⭐
        </h2>
        <span className="badge bg-pill bg-primary">
          {loading ? <span className="spinner-border spinner-border-sm"></span> : eventsFav.length} events
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your favorites...</p>
        </div>
      ) : eventsFav.length > 0 ? (
        <div className="row g-4">
          {eventsFav.map((event) => {
            const remainingSpots = event.capacity - event.registeredAttendeesCount;
            const eventImages = event.images || [];
            const activeIndex = activeIndices[event.id] || 0;
            return (
              <div key={event.id} className="col-lg-4 col-md-6">
                <div className="card favorite-card h-100 border-0 shadow-sm overflow-hidden">
                  <div className="card-img-container position-relative">
                    <img
                      src={eventImages[activeIndex]?.imageUrl || `https://picsum.photos/id/${event.id}/800/600`}
                      className="img-fluid h-100 w-100 object-fit-cover"
                      alt={event.title}
                      loading="lazy"
                    />
                    {/* Carousel Controls */}
                    {eventImages.length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePrev(event.id);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            top: "50%",
                            left: "5px",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderRadius: "50%",
                            border: "none",
                          }}
                        >
                          <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button
                          className="carousel-control-next"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNext(event.id);
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            top: "50%",
                            right: "5px",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderRadius: "50%",
                            border: "none",
                          }}
                        >
                          <span className="carousel-control-next-icon"></span>
                        </button>
                      </>
                    )}
                    <div className="card-badge">
                      {event.online ? (
                        <span className="badge bg-success">
                          <i className="bi bi-wifi"></i> Online
                        </span>
                      ) : (
                        <span className="badge bg-info text-dark">
                          <i className="bi bi-geo-alt"></i> {event.address}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <div className="d-flex align-items-center text-muted mb-2"></div>

                    <div className="event-meta mb-3">
                      <div className="d-flex justify-content-between">
                        <i className="bi bi-calendar-event me-1"></i>
                        <span>
                          {new Date(event.startDateTime).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <i className="bi bi-clock-history ms-3 mx-2"></i>
                        <span>
                          {new Date(event.startDateTime).toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="event-meta mb-3 d-flex justify-content-between">
                      <div
                        className={`badge ${
                          remainingSpots >= 7
                            ? "bg-primary bg-opacity-10 text-primary"
                            : "bg-danger bg-opacity-10 text-danger"
                        }  `}
                      >
                        <i className="bi bi-ticket-perforated me-2"></i>
                        {remainingSpots > 0 ? (
                          <span>{remainingSpots} орын қалды</span>
                        ) : (
                          <span className="text-danger">Толып қалды</span>
                        )}
                      </div>
                      <div>
                        <span
                          class={`badge ${
                            event.eventType === "CONFERENCE" && "MASTERCLASS" ? "text-bg-success" : "text-bg-primary"
                          } `}
                        >
                          {eventTypeKazakh[event.eventType] || event.eventType}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <NavLink
                        to={`/${currentUser && currentUser.role === "admin" && "meneger" ? "admin" : "user"}/${
                          event.id
                        }`}
                        className="flex-grow-1"
                      >
                        <button className="btn btn-sm btn-primary w-100" onClick={() => addToCalendar(event)}>
                          <i className="bi bi-calendar-plus me-1"></i> Күнтізбеге қосу
                        </button>
                      </NavLink>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        style={{ whiteSpace: "nowrap" }}
                        data-bs-toggle="modal"
                        data-bs-target={`#unsubscribeModal-${event.id}`}
                      >
                        <i className="bi bi-heartbreak"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Модальное окно */}
                <div
                  className="modal fade"
                  id={`unsubscribeModal-${event.id}`}
                  tabIndex="-1"
                  aria-labelledby="unsubscribeModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header border-0">
                        <h5 className="modal-title text-danger">
                          <i className="bi bi-heartbreak me-2"></i>
                          Таңдаулылардан өшірілсін бе?
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Жабу"></button>
                      </div>
                      <div className="modal-body py-0">
                        <div className="alert alert-light">
                          <i class="bi bi-stars"></i>
                          <span>{event.title}</span>
                          <div>
                            <div className="d-flex justify-content-start my-3">
                              <i className="bi bi-calendar-event me-2"></i>
                              <span>
                                {new Date(event.startDateTime).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <i className="bi bi-clock-history ms-3 mx-2"></i>
                              <span>
                                {new Date(event.startDateTime).toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                          {event.online ? (
                            <span className=" text-success">
                              <i className="bi bi-wifi"></i> Online
                            </span>
                          ) : (
                            <span className="text-success">
                              <i className="bi bi-geo-alt"></i> {event.address}
                            </span>
                          )}
                        </div>
                        <p className="mt-3">
                          Бұл іс-шара таңдаулылар тізімінен өшіріледі. Кейінірек қайта қоса аласыз.
                        </p>
                      </div>
                      <div className="modal-footer border-0">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                          Бас тарту
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDeleteFav(event.id)}
                          data-bs-dismiss="modal"
                        >
                          <i className="bi bi-heartbreak me-1"></i> Өшіру
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state text-center py-5">
          <div className="empty-state-icon">
            <i className="bi bi-heart text-muted" style={{ fontSize: "4rem" }}></i>
          </div>
          <h3 className="mt-4">Таңдаулылар жоқ</h3>
          <p className="text-muted mb-4">Сіз әлі ешқандай іс-шараны таңдаулыларға қоспадыңыз. Зерттеуді бастайық!</p>
          <NavLink to="/events" className="btn btn-primary px-4">
            <i className="bi bi-search me-2"></i> Іс-шараларды шолу
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default MyFavourite;
