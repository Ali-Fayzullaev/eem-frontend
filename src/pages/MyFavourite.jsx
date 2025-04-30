import { useState, useEffect } from "react";
import axios from "axios";
import useFetch from "../hook/useFetch";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";

function MyFavourite() {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const axiosInstance = axios.create({
    baseURL: "https://67ddbf11471aaaa742826b6e.mockapi.io/",
  });

  const {
    data: events,
  } = useFetch(`https://67ddbf11471aaaa742826b6e.mockapi.io/events`);

  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscribedEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://67ddbf11471aaaa742826b6e.mockapi.io/events",
        {
          params: {
            subscrib: true,
          },
        }
      );
      setSubscribedEvents(res.data);
    } catch (err) {
    //   toast.error("Failed to fetch events");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async (id) => {
    try {
      await axios.put(
        `https://67ddbf11471aaaa742826b6e.mockapi.io/events/${id}`,
        {
          subscrib: false,
        }
      );
      toast.success("Unsubscribed successfully!");
      fetchSubscribedEvents();
    } catch (error) {
      toast.error("Failed to unsubscribe");
      console.error("Error:", error);
    }
  };

  const addToCalendar = (event) => {
    toast.success(`Added "${event.eventName}" to calendar`);
    // Здесь можно добавить реальную логику добавления в календарь
  };

  useEffect(() => {
    fetchSubscribedEvents();
  }, [events]);

  return (
    <div className="container py-4">
      <Toaster position="top-right" />
      <ToastContainer position="bottom-right" />

      {/* Заголовок с анимацией */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0 text-gradient">
          <i className="bi bi-heart-fill me-2"></i>
          My Favorites
        </h2>
        <span className="badge bg-pill bg-primary">
          {isLoading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            subscribedEvents.length
          )}{" "}
          events
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your favorites...</p>
        </div>
      ) : subscribedEvents.length > 0 ? (
        <div className="row g-4">
          {subscribedEvents.map((event) => (
            <div key={event.id} className="col-lg-4 col-md-6">
              <div className="card favorite-card h-100 border-0 shadow-sm overflow-hidden">
                <div className="card-img-container position-relative">
                  <img
                    src={event.imgUrl || "https://via.placeholder.com/400x200?text=No+Image"}
                    className="card-img-top"
                    alt={event.eventName}
                  />
                  <div className="card-badge">
                    {event.eventType === "ONLINE" ? (
                      <span className="badge bg-success">
                        <i className="bi bi-wifi"></i> Online
                      </span>
                    ) : (
                      <span className="badge bg-info text-dark">
                        <i className="bi bi-geo-alt"></i> {event.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <h5 className="card-title">{event.eventName}</h5>
                  <div className="d-flex align-items-center text-muted mb-2">
                    <i className="bi bi-translate me-2"></i>
                    <small>{event.language}</small>
                  </div>
                  
                  <div className="event-meta mb-3">
                    <div className="d-flex justify-content-between">
                      <span>
                        <i className="bi bi-calendar-event me-1"></i>
                        {event.startDate}
                      </span>
                      <span>
                        <i className="bi bi-clock me-1"></i>
                        {event.startTime}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary flex-grow-1"
                      onClick={() => addToCalendar(event)}
                    >
                      <i className="bi bi-calendar-plus me-1"></i> Add to Calendar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
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
                        Remove from Favorites?
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body py-0">
                      <div className="alert alert-light">
                        <h6 className="mb-1">{event.eventName}</h6>
                        <p className="mb-1 small">
                          <i className="bi bi-calendar me-1"></i>
                          {event.startDate} at {event.startTime}
                        </p>
                        {event.location && (
                          <p className="mb-0 small">
                            <i className="bi bi-geo-alt me-1"></i>
                            {event.location}
                          </p>
                        )}
                      </div>
                      <p className="mt-3">
                        This event will be removed from your favorites. You can always add it back later.
                      </p>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleUnsubscribe(event.id)}
                        data-bs-dismiss="modal"
                      >
                        <i className="bi bi-heartbreak me-1"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state text-center py-5">
          <div className="empty-state-icon">
            <i className="bi bi-heart text-muted" style={{ fontSize: "4rem" }}></i>
          </div>
          <h3 className="mt-4">No favorites yet</h3>
          <p className="text-muted mb-4">
            You haven't added any events to your favorites. Start exploring!
          </p>
          <NavLink
            to="/events"
            className="btn btn-primary px-4"
          >
            <i className="bi bi-search me-2"></i> Browse Events
          </NavLink>
        </div>
      )}

     
    </div>
  );
}

export default MyFavourite;