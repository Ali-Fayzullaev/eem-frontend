import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../hook/useFetchh";
import { authService } from "../api/authService";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

function HomeAdmin() {
  const [searchLocation, setSearchLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [activeIndices, setActiveIndices] = useState({});
  const token = localStorage.getItem("refreshToken");

  const {
    data: events,
    loading,
    error,
    refetch,
  } = useFetch(`http://localhost:8080/api/v1/events?title=${eventCategory}&address=${searchLocation}`, {
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

  // image next prev
  const handlePrev = (eventId) => {
    setActiveIndices((prev) => {
      const currentEvent = events?.find((e) => e.id === eventId);
      const imagesCount = currentEvent?.images?.length || 1;
      if (!currentEvent || !imagesCount) return prev;
      const newIndex = prev[eventId] === 0 ? imagesCount - 1 : prev[eventId] - 1;
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

      // Получаем текущий индекс
      const currentIndex = prev[eventId] || 0;

      // Вычисляем новый индекс
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

  // favorited or unFavarites
  const handleFov = async (id, isFavorited) => {
    try {
      const method = isFavorited ? "DELETE" : "POST"; // favorited=true болса DELETE, әйтпесе POST
      const response = await fetch(`http://localhost:8080/api/v1/favorites/${id}`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const action = isFavorited ? "өшірілді" : "қосылды";
        console.log(`Іс-шара сәтті ${action}!`);
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

  return (
    <div className="ms-2">
      <Toaster />
      <ToastContainer />
      {/* Search Container */}
      <div className="search-container">
        <div className="row search-row justify-content-center mt-4">
          <div className="col-12 col-md-5">
            <div className="custom-input-group">
              <span className="input-group-text">
                <i className="bi bi-tag-fill"></i>
              </span>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Санат бойынша іздеу..."
                onChange={(e) => setEventCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-5">
            <div className="custom-input-group">
              <span className="input-group-text">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Орналасу бойынша іздеу..."
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="container my-3">
        <p className="fw-medium h5">Барлық оқиғалар</p>
        {loading && <div className="loader">Жүктелуде...</div>}
        {error && <div className="loaderErr">{error}</div>}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {events &&
            events.map((event) => {
              const remainingSpots = event.capacity - event.registeredAttendeesCount;
              const eventImages = event.images || [];
              const activeIndex = activeIndices[event.id] || 0;

              return (
                <div className="col" key={event.id}>
                  <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                    {/* Image Carousel */}
                    <div className="position-relative">
                      {eventImages.length > 0 ? (
                        <>
                          <div className="carousel-inner">
                            <img
                              src={eventImages[activeIndex]?.imageUrl || `https://picsum.photos/id/${event.id}/800/600`}
                              className="card-img-top rounded-top"
                              alt="Event"
                              style={{ height: "180px", objectFit: "cover" }}
                            />
                          </div>

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
                        </>
                      ) : (
                        <img
                          src={`https://picsum.photos/id/${event.id}/800/600`}
                          className="card-img-top rounded-top"
                          alt="Event"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                      )}

                      {/* Event title overlay */}
                      <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-2">
                        <h6 className="text-white fw-bold text-truncate m-0">{event.title}</h6>
                      </div>
                    </div>

                    {/* Indicators for carousel */}
                    {eventImages.length > 1 && (
                      <div className="position-absolute top-50 mt-4 start-0 w-100 d-flex justify-content-center mb-2">
                        <span class="badge text-bg-light">
                          <div className="d-flex ">
                            {eventImages.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                className={`mx-1 p-1 ${
                                  index === activeIndex ? "bg-primary" : "bg-secondary"
                                } border-0 rounded-circle`}
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  padding: "0",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  goToImage(event.id, index);
                                }}
                                aria-label={`Slide ${index + 1}`}
                              ></button>
                            ))}
                          </div>
                        </span>
                      </div>
                    )}

                    {/* "SOON" Badge */}
                    {isEventSoon(event.startDateTime) && (
                      <div className="position-absolute top-0 end-0 w-100 bg-opacity-75 p-2 text-start">
                        <span className="badge text-bg-info text-white">ЖАҚЫН АРАДА</span>
                      </div>
                    )}

                    {/* Heart Icon */}
                    <div className="position-absolute top-0 end-0 p-3">
                      <input
                        onClick={() => handleFov(event.id, event.favorited)} // favorited мәнін беру
                        type="checkbox"
                        className="heart-checkbox"
                        id={`heart-${event.id}`}
                        checked={event.favorited || false} // undefined болмас үшін
                      />
                      <label htmlFor={`heart-${event.id}`} className="heart-label">
                        <i className="bi bi-heart-fill heart-icon"></i>
                      </label>
                    </div>

                    <NavLink
                      className="link-offset-2 link-underline link-underline-opacity-0"
                      to={`/${currentUser && currentUser.role === "admin" && "meneger" ? "admin" : "user"}/${event.id}`}
                    >
                      {/* Card Body */}
                      <div className="card-body p-3">
                        <p className="card-text small text-muted">
                          <i className="bi bi-geo-alt-fill me-1"></i> {event.address || "Онлайн"}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">
                            <i className="bi bi-calendar-date-fill me-1"></i>{" "}
                            {new Date(event.startDateTime).toLocaleDateString()}
                          </span>
                          <span className="badge bg-primary">{event.eventType}</span>
                        </div>
                        <div className="mt-2 d-flex align-items-center">
                          <i className="bi bi-people-fill text-primary me-1 "></i>
                          <span className={`fw-bold ${remainingSpots <= 7 ? "text-danger" : "text-success"}`}>
                            {remainingSpots > 0 ? <span>{remainingSpots} орын бар</span> : "орын жок"}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
