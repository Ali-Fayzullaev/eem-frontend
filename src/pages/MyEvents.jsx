import { useEffect, useState } from "react";
import "../Admin.css";
import "../MyEvents.css";
import useFetch from "../hook/useFetchh";
import dayjs from "dayjs";
import { FaBoxOpen } from "react-icons/fa";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import QRCode from "react-qr-code";
import logo from "../assets/iconEvent.png";
function MyEvents() {
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [unsubscribeModalIsOpen, setUnsubscribeModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const token = localStorage.getItem("refreshToken");

  const { data: registrations } = useFetch("http://localhost:8080/api/v1/events/user/registrations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data: allEvents } = useFetch("http://localhost:8080/api/v1/events");

  const [hasCancelledEvents, setHasCancelledEvents] = useState(false);

  useEffect(() => {
    const hasCancelled = allEvents?.some((event) => registrations?.some((reg) => reg.eventId === event.id));
    setHasCancelledEvents(hasCancelled);
  }, [allEvents, registrations]);

  const registeredEvents = allEvents?.filter((event) => registrations?.some((reg) => reg.eventId === event.id)) || [];

  const handleUnsubscribe = async (eventId) => {
    if (!token) {
      toast.error("Авторизация қажет!", { position: "top-right" });
      return;
    }

    try {
      const registration = registrations.find((reg) => reg.eventId === eventId);

      if (!registration) {
        toast.error("Тіркелу табылмады", { position: "top-right" });
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/events/${eventId}/registrations/${registration.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Жазылудан бас тарту кезінде қате пайда болды");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmUnsubscribe = async () => {
    if (!selectedEventId) return;

    try {
      setLoading(true);
      await handleUnsubscribe(selectedEventId);
      toast.success("Іс-шарадан сәтті бас тартылды", { position: "top-right" });
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Қате пайда болды", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
      setUnsubscribeModalIsOpen(false);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalIsOpen(true);
  };

  const openUnsubscribeModal = (eventId) => {
    setSelectedEventId(eventId);
    setUnsubscribeModalIsOpen(true);
  };

  return (
    <div className="container m-0 p-0">
      <Toaster />
      <ToastContainer />

      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 text-primary">
            <i className="bi bi-bookmark-check-fill me-2"></i>
            Менің іс-шараларым
          </h5>
          <span className="badge bg-primary rounded-pill">{registeredEvents.length} іс-шара</span>
        </div>

        {registeredEvents.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {registeredEvents.map((event) => {
              // Находим соответствующую регистрацию для текущего события
              const registration = registrations.find((reg) => reg.eventId === event.id);

              return (
                <div key={event.id} className="col">
                  <div className="card h-100 border-0 shadow-sm hover-shadow">
                    <div className="position-relative">
                      {event.images?.length > 0 && (
                        <div className="image-card position-relative">
                          <img
                            src={event.images[0].imageUrl}
                            className="event-image w-100"
                            alt={event.title}
                            style={{ height: "200px", objectFit: "cover" }}
                          />

                          <button
                            onClick={() => openImageModal(event.images[0].imageUrl)}
                            className="view-btn position-absolute top-75 end-0 m-2 rounded-circle p-2 border-0"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="bi bi-aspect-ratio fs-6"></i>
                          </button>
                        </div>
                      )}
                      <span className="position-absolute top-0 end-0 bg-primary text-white px-2 py-1 small">
                        {event.eventType}
                      </span>
                    </div>

                    <div className="card-body p-3">
                      <h6 className="card-title mb-1">{event.title}</h6>

                      <p className="small text-muted mb-2">
                        <i className="bi bi-geo-alt"></i> {event.address || "Онлайн"}
                      </p>

                      <div className="d-flex justify-content-between small mb-2">
                        <span>
                          <i className="bi bi-calendar"></i> {dayjs(event.startDateTime).format("DD.MM.YYYY")},{" "}
                          <i className="bi bi-clock ms-2"></i> {dayjs(event.startDateTime).format("HH:mm")}
                        </span>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          data-bs-toggle="modal"
                          data-bs-target={`#showQrCode-${event?.id}`}
                        >
                          Кіру үшін QR код
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => openUnsubscribeModal(event.id)}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <>
                              <i className="bi bi-x-circle me-2"></i>
                              Бас тарту
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* QR код арқылы кіру үшін модальды терезе */}
                  <div
                    className="modal fade"
                    id={`showQrCode-${event?.id}`}
                    tabIndex="-1"
                    aria-labelledby="qrCodeModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-fullscreen">
                      <div className="modal-content">
                        <div className="modal-header border-0 pb-0">
                          <h5 className="modal-title text-primary">
                            <i className="bi bi-qr-code me-2"></i>
                            Кіру үшін QR код
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Жабу"
                          ></button>
                        </div>
                        <div className="modal-body text-center py-0">
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: "75vh" }}
                          >
                            <div
                              style={{
                                position: "relative",
                                width: "360px",
                                height: "360px",
                                padding: "30px",
                                backgroundColor: "#ffffff",
                                borderRadius: "16px",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                              }}
                            >
                              {/* Асосий QR код */}
                              <QRCode
                                value={registration.registrationCode}
                                size={300}
                                level="H"
                                fgColor="#000000"
                                bgColor="#ffffff"
                              />

                              {/* Логотип (ўртада) */}
                              <img
                                src={logo}
                                alt="Logo"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: "70px",
                                  height: "70px",
                                  backgroundColor: "#ffffff",
                                  padding: "8px",
                                  borderRadius: "12px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                              />
                            </div>
                          </div>
                          <p className="mt-4 mb-0 text-muted fs-5">
                            <i className="bi bi-info-circle me-2"></i>
                            Төмендегі QR кодты көрсетіп, іс-шараға кіре аласыз.
                          </p>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                          <button type="button" className="btn btn-primary w-100 py-2 fs-5" data-bs-dismiss="modal">
                            Түсіндім
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
          <div className="text-center py-5">
            <FaBoxOpen className="text-muted" style={{ fontSize: "3rem" }} />
            <h5 className="mt-3">Жазылған іс-шаралар жоқ</h5>
            <p className="text-muted">Сіз әлі ешбір іс-шараға жазылмағансыз</p>
            <NavLink to="/events" className="btn btn-primary">
              <i className="bi bi-plus-circle"></i> Іс-шараларды қарау
            </NavLink>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={imageModalIsOpen}
        onRequestClose={() => setImageModalIsOpen(false)}
        className="custom-modal-img"
        overlayClassName="modal-overlay-img"
      >
        <div className="modal-content-img">
          <button
            className="btn-close position-absolute top-0 end-0 m-2"
            onClick={() => setImageModalIsOpen(false)}
          ></button>
          <img src={selectedImage} alt="Event" className="img-fluid" style={{ maxHeight: "90vh" }} />
        </div>
      </Modal>

      {/* Unsubscribe Confirmation Modal */}
      <Modal
        isOpen={unsubscribeModalIsOpen}
        onRequestClose={() => setUnsubscribeModalIsOpen(false)}
        className="unsubscribe-modal"
        overlayClassName="unsubscribe-modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Сіз шынымен бас тартқыңыз келе ме?
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setUnsubscribeModalIsOpen(false)}
              disabled={loading}
            />
          </div>

          <div className="modal-body text-center py-4">
            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "3rem" }}></i>
            <p className="mt-3 mb-0">Бұл іс-шарадан бас тартқаннан кейін, сіз қайта тіркелуіңіз қажет болады</p>
          </div>

          <div className="modal-footer justify-content-center border-top-0">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => setUnsubscribeModalIsOpen(false)}
              disabled={loading}
            >
              <i className="bi bi-arrow-left-circle me-2"></i>
              Болдырмау
            </button>
            <button className="btn btn-danger rounded-pill px-4" onClick={handleConfirmUnsubscribe} disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-check-circle-fill me-2"></i>
              )}
              Растау
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MyEvents;
