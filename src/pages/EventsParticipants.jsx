import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../hook/useFetchh";
import { authService } from "../api/authService";
import "../EventsParticipants.css";
function EventsParticipants() {
  const [activeIndices, setActiveIndices] = useState({});
  const token = localStorage.getItem("token");

  const {
    data: events,
    loading,
    error,
  } = useFetch(`http://localhost:8080/api/v1/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const isEventSoon = (startDate) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  };

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const data = authService.getCurrentUser();
    if (data) {
      setCurrentUser(data);
    }
  }, []);

  const handlePrev = (eventId) => {
    setActiveIndices((prev) => {
      const currentEvent = events?.find((e) => e.id === eventId);
      const imagesCount = currentEvent?.images?.length || 1;
      if (!currentEvent || !imagesCount) return prev;
      const newIndex =
        prev[eventId] === 0 ? imagesCount - 1 : prev[eventId] - 1;
      return {
        ...prev,
        [eventId]: newIndex,
      };
    });
  };

  const handleNext = (eventId) => {
    setActiveIndices((prev) => {
      if (!events) return prev;

      const event = events.find((e) => e.id === eventId);
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

  const goToImage = (eventId, index) => {
    setActiveIndices((prev) => ({
      ...prev,
      [eventId]: index,
    }));
  };

  // Initialize active indices when events load
  useEffect(() => {
    if (events) {
      const initialIndices = {};
      events.forEach((event) => {
        initialIndices[event.id] = 0;
      });
      setActiveIndices(initialIndices);
    }
  }, [events]);

  return (
    <div className="ms-2">
      {/* Event List */}
      <div className="container my-3">
        <p className="fw-medium h5">Барлық оқиғалар</p>
        {loading && <div className="loader">Жүктелуде...</div>}
        {error && <div className="loaderErr">{error}</div>}

        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-2 row-cols-xl-4 g-3">
          {events &&
            events.map((event) => {
              const remainingSpots =
                event.capacity - event.registeredAttendeesCount;
              const eventImages = event.images || [];
              const activeIndex = activeIndices[event.id] || 0;

              return (
                <div className="col-md-6 mb-4" key={event.id}>
                  <div className="card h-100 border-0 shadow-sm hover-card">
                    {/* Изображение события */}
                    <div
                      className="position-relative"
                      style={{ height: "160px", overflow: "hidden" }}
                    >
                      <img
                       src={
                                eventImages[activeIndex]?.imageUrl ||
                                `https://picsum.photos/id/${event.id}/800/600`
                              }
                              className="card-img-top rounded-top"
                              alt="Event"
                              style={{ height: "180px", objectFit: "cover" }}
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
                    

                      {/* Бейдж "Скоро" */}
                      {isEventSoon(event.startDateTime) && (
                        <span className="position-absolute top-2 end-2 badge bg-warning text-dark">
                          <i className="bi bi-clock me-1"></i> Скоро
                        </span>
                      )}

                      {/* Счетчик мест */}
                      <span className="position-absolute bottom-2 start-2 badge bg-dark">
                        <i className="bi bi-people me-1"></i> {remainingSpots}{" "}
                        мест
                      </span>
                    </div>

                    {/* Контент карточки */}
                    <div className="card-body p-3">
                      <h6 className="card-title mb-2 text-truncate">
                        {event.title}
                      </h6>

                      <div className="d-flex align-items-center mb-2 text-muted small">
                        <i className="bi bi-geo-alt text-primary me-2"></i>
                        <span className="text-truncate">
                          {event.address || "Онлайн"}
                        </span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mb-3 text-muted small">
                        <span>
                          <i className="bi bi-calendar text-primary me-2"></i>
                          {new Date(event.startDateTime).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>

                        <span
                          className={`fw-bold ${
                            remainingSpots <= 7 ? "text-danger" : "text-success"
                          }`}
                        >
                          <i className="bi bi-people-fill text-primary me-1 "></i>
                          {remainingSpots > 0 ? <span>{remainingSpots} орын бар</span> : "орын жок"} 
                        </span>
                      </div>
                    </div>

                    {/* Футер карточки */}
                    <div className="card-footer bg-transparent border-0 p-3 pt-0">
                      <NavLink
                        to={`/admin/list/${event.id}`}
                        className="btn btn-sm btn-outline-primary w-100"
                      >
                        <i className="bi bi-list-ul me-1"></i> Қатысушылар
                      </NavLink>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default EventsParticipants;
