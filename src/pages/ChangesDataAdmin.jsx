import { useState, useEffect } from "react"; // This already imports React
import axios from "axios";
import useFetch from "../hook/useFetch";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root"); // React modal uchun kerak

function ChangesDataAdmin() {
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

  // useState
  const [show, setShow] = useState(true);

  // API for events
  const {
    data: events,
    loading,
    error,
    refetch,
  } = useFetch(`https://67ddbf11471aaaa742826b6e.mockapi.io/events`);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`events/${id}`);

      console.log(`Deleted event id: ${id}`);
      refetch();
      toast.success("Cancelled !");
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleOpenCloseAccordion = () => {
    setShow(!show);
  };

  return (
    <div>
      <Toaster />
      <ToastContainer />
      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className="accordion-item my-custom-accordion">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              onClick={handleOpenCloseAccordion}
              type="button"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              <div className="w-100 h-100 my-2 text-start d-flex justify-content-between align-items-center">
                <span className="fw-medium fs-5">
                  Менің құрған іс-шараларым
                </span>
                {events?.length ? (
                  <span className="fw-bolder mx-3">
                    Сізде:
                    <code className="fs-5">
                      {" "}
                      {loading && (
                        <div className="loaderEvents d-inline-block"></div>
                      )}{" "}
                      {events?.length}{" "}
                    </code>{" "}
                    іс-шара
                  </span>
                ) : (
                  "Сіз әлі ешбір іс-шара құрмағансыз 😢"
                )}
              </div>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className={`accordion-collapse scrollable ${show ? "show" : ""}`}
          >
            <div className="accordion-body">
              {loading && <div className="loader"></div>}
              {error && <div className="loaderErr"></div>}
              <div className="row">
                {events &&
                  events.map((event) => (
                    <div key={event.id} className="col-md-4">
                      <div className="card mb-3">
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
                                className="custom-modal"
                                overlayClassName="modal-overlay"
                              >
                                <div className="modal-content">
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
                        <div className="card-body">
                          <h5 className="card-title">{event.eventName}</h5>
                          <p className="card-text">
                            📅 {event.startDate} | ⏰ {event.startTime}
                          </p>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => addToCalendar(event)}
                              className="btn btn-success"
                            >
                              📆 Күнтізбеге қосу
                            </button>
                            <button
                              data-bs-toggle="modal"
                              data-bs-target={`#${event.id}`}
                              className="btn btn-danger"
                            >
                              🗑 Жою
                            </button>
                            <div
                              className="modal fade"
                              key={event.id}
                              id={`${event.id}`}
                              tabIndex="-1"
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="exampleModalLabel"
                                    >
                                      Менің іс-шараларым
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Жабу"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    Сіз шынымен{" "}
                                    <strong>{event.eventName}</strong>{" "}
                                    іс-шарасын жойғыңыз келе ме?
                                    <h5 className="card-title">
                                      {event.eventName}
                                    </h5>
                                    <p className="card-text">
                                      📅 {event.startDate} | ⏰{" "}
                                      {event.startTime}
                                    </p>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      data-bs-dismiss="modal"
                                    >
                                      Жабу
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(event.id)}
                                      data-bs-dismiss="modal"
                                      className="btn btn-danger text-white"
                                    >
                                      🗑 Жою
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <NavLink to={`/admin/change/${event.id}`}>
                              <button className="btn btn-info mt-2 text-white">
                                Өзгертулер
                              </button>
                            </NavLink>
                            <NavLink to={`/admin/list/${event.id}`}>
                              <button className="btn btn-warning mt-2 text-white">
                                Қатысушылар
                              </button>
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangesDataAdmin;
