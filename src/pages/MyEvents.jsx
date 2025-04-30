// import  react
import { useState, useEffect } from "react";
import "../Admin.css";
// import from axios
import axios from "axios";
// import hooks
import useFetch from "../hook/useFetch";

// import toasts
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

// import from RRD
import { NavLink } from "react-router-dom";
import Modal from "react-modal";

function MyEvents() {
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

  // // API for events
  const {
    data: events,
    loading,
    error,
    refetch,
  } = useFetch(`https://67ddbf11471aaaa742826b6e.mockapi.io/events`);

  const [subscribedEvents, setSubscribedEvents] = useState([]);

  const fetchSubscribedEvents = async () => {
    try {
      const res = await axios.get(
        "https://67ddbf11471aaaa742826b6e.mockapi.io/events",
        {
          params: {
            subscrib: true, // only subscrib === true
          },
        }
      );

      setSubscribedEvents(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleUnsubscribe = async (id) => {
    try {
      const res = await axios.put(
        `https://67ddbf11471aaaa742826b6e.mockapi.io/events/${id}`,
        {
          subscrib: false,
        }
      );
      console.log("Subscrib change to false:", res.data);

      fetchSubscribedEvents(); // ✅ Обновление подписанных событий
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  useEffect(() => {
    fetchSubscribedEvents();
  }, [events]);

  return (
    <div className="container m-0 p-0">
      <Toaster />
      <ToastContainer />
      {subscribedEvents && (
        <div className="container py-2">
          {/* Тақырып және статистика */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0 text-primary">
              <i className="bi bi-bookmark-check-fill me-2"></i>
              Менің жазылған іс-шараларым
            </h5>
            <span className="badge bg-primary rounded-pill">
              {subscribedEvents.length} іс-шара
            </span>
          </div>

          {/* Іс-шаралар тізімі */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {subscribedEvents.map((event) => (
              <div key={event.id} className="col">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  {/* Іс-шара суреті */}
                  <div className="position-relative">
                    <div className="event-card-img">
                      {event.imgUrl && (
                        <div className="image-card">
                          <img
                            src={event.imgUrl}
                            className="event-image"
                            alt={event.eventName}
                          />
                          <button
                            onClick={() => openModal(event.imgUrl)}
                            className="view-btn"
                          >
                            <i class="	bi bi-aspect-ratio fs-4"></i>
                          </button>

                          <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            contentLabel="Kattalashtirilgan surat"
                            className="custom-modal-img"
                            overlayClassName="modal-overlay-img"
                          >
                            <div className="modal-content-img">
                              <img
                                src={selectedImage}
                                alt="Kattalashtirilgan"
                                className="modal-image"
                              />
                              <button
                                onClick={closeModal}
                                className="close-btn"
                              >
                                ×
                              </button>
                            </div>
                          </Modal>
                        </div>
                      )}
                    </div>
                    <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 small">
                      {event.eventType}
                    </span>
                  </div>

                  {/* Карточка мазмұны */}
                  <div className="card-body p-3">
                    <h6 className="card-title mb-1 text-truncate">
                      {event.eventName}
                    </h6>
                    <p className="small text-muted mb-2">
                      <i className="bi bi-geo-alt"></i> {event.location} •{" "}
                      {event.language}
                    </p>

                    <div className="d-flex justify-content-between small mb-2">
                      <span>
                        <i className="bi bi-calendar"></i> {event.startDate}
                      </span>
                      <span>
                        <i className="bi bi-clock"></i> {event.startTime}
                      </span>
                    </div>

                    {/* Әрекеттер батырмалары */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary flex-grow-1"
                        onClick={() => addToCalendar(event)}
                      >
                        <i className="bi bi-calendar-plus"></i> Қосу
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        data-bs-toggle="modal"
                        data-bs-target={`#unsubscribeModal-${event.id}`}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Жазылудан бас тарту модальды терезесі */}
                <div
                  className="modal fade"
                  id={`unsubscribeModal-${event.id}`}
                  tabIndex="-1"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-light">
                        <h5 className="modal-title text-danger">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          Жазылудан бас тартуды растау
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Сіз шынымен осы іс-шарадан жазылудан бас тартқыңыз
                          келе ме?
                        </p>
                        <div className="alert alert-light">
                          <h6 className="mb-1">{event.eventName}</h6>
                          <small className="text-muted">
                            <i className="bi bi-calendar"></i> {event.startDate}{" "}
                            • {event.startTime}
                            <br />
                            <i className="bi bi-geo-alt"></i> {event.location}
                          </small>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Болдырмау
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleUnsubscribe(event.id)}
                          data-bs-dismiss="modal"
                        >
                          <i className="bi bi-trash me-1"></i> Жазылудан бас
                          тарту
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Бос күй */}
          {subscribedEvents.length === 0 && (
            <div className="text-center py-5">
              <i
                className="bi bi-calendar-x text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3">Жазылған іс-шаралар жоқ</h5>
              <p className="text-muted">
                Сіз әлі ешбір іс-шараға жазылмағансыз
              </p>
              <button className="btn btn-primary">
                <NavLink className="link-offset-2 link-underline link-underline-opacity-0 text-white">
                  {" "}
                  <i className="bi bi-plus-circle"></i> Іс-шараларды қарау
                </NavLink>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
