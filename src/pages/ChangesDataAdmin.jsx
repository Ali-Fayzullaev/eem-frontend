import { useState, useEffect } from "react"; // This already imports React
import useFetch from "../hook/useFetchh";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
function ChangesDataAdmin() {
  const [activeIndices, setActiveIndices] = useState({});

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

      const currentIndex = prev[eventId] || 0;

      const newIndex = currentIndex === imagesLength - 1 ? 0 : currentIndex + 1;

      return {
        ...prev,
        [eventId]: newIndex,
      };
    });
  };

  // useState
  const [show, setShow] = useState(true);

 

  const token = localStorage.getItem("refreshToken"); // Яхшилаштирилган: accessToken-ни файзасиз

  // API for events
  const {
    data: events,
    loading,
    error,
    refetch,
  } = useFetch(`http://localhost:8080/api/v1/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Іс-шараны жою сәтсіз аяқталды");
      }

      // Модалды жабу
      const modal = bootstrap.Modal.getInstance(document.getElementById(`deleteModal-${id}`));
      if (modal) modal.hide();

      // Сәтті жою туралы хабарлама көрсету
      toast.success("Іс-шара сәтті жойылды!");

      // Іс-шаралар тізімін жаңарту
      refetch();
    } catch (err) {
      console.error("Іс-шараны жою қатесі:", err);
      toast.error(err.message || "Іс-шараны жою кезінде қате пайда болды");
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
                <span className="fw-medium fs-5">Барлық құрылған іс-шаралар</span>
                {events?.length ? (
                  <span className="fw-bolder mx-3">
                    Сізде:
                    <code className="fs-5">
                      {" "}
                      {loading && <div className="loaderEvents d-inline-block"></div>} {events?.length}{" "}
                    </code>{" "}
                    іс-шара
                  </span>
                ) : (
                  "Сіз әлі ешбір іс-шара құрмағансыз 😢"
                )}
              </div>
            </button>
          </h2>
          <div id="panelsStayOpen-collapseOne" className={`accordion-collapse scrollable ${show ? "show" : ""}`}>
            <div className="accordion-body">
              {/* Юкланмоқда спиннер */}
              {loading && (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">loading...</span>
                  </div>
                </div>
              )}

              {/* Хато хабарномаси */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Мәліметтерді жүктеу мүмкін болмады
                </div>
              )}

              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-4">
                {events?.map((event) => {
                  const remainingSpots = event.capacity - event.registeredAttendeesCount;
                  const eventImages = event.images || [];
                  const activeIndex = activeIndices[event.id] || 0;

                  return (
                    <div className="col" key={event.id}>
                      <div className="card h-100 border-0 shadow-sm overflow-hidden hover-shadow">
                        {/* Расм блоки */}
                        <div className="position-relative" style={{ height: "240px", overflow: "hidden" }}>
                          <img
                            src={eventImages[activeIndex]?.imageUrl || `https://picsum.photos/id/${event.id}/800/600`}
                            className="img-fluid h-100 w-100 object-fit-cover"
                            alt={event.title}
                            loading="lazy"
                          />

                          {/* Действиялар менюси */}
                          <div className="position-absolute top-0 end-0 m-2">
                            <div className="dropdown">
                              <button
                                className="btn btn-light btn-icon rounded-circle shadow-sm"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
                                <li>
                                  <button onClick={() => addToCalendar(event)} className="dropdown-item py-2">
                                    <i className="bi bi-calendar-plus me-2 text-secondary"></i>
                                    Күнтізбеге қосу
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item py-2"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#deleteModal-${event.id}`}
                                  >
                                    <i className="bi bi-trash me-2 text-secondary"></i>
                                    Жою
                                  </button>
                                </li>
                                <li>
                                  <hr className="dropdown-divider my-1" />
                                </li>
                                <li>
                                  <NavLink to={`/admin/change/${event.id}`} className="dropdown-item py-2">
                                    <i className="bi bi-pencil-square me-2 text-secondary"></i>
                                    Өзгертулер
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink to={`/admin/list/${event.id}`} className="dropdown-item py-2">
                                    <i className="bi bi-people-fill me-2 text-secondary"></i>
                                    Қатысушылар
                                  </NavLink>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Карусел контроллари */}
                          {eventImages.length > 1 && (
                            <>
                              <button
                                className="position-absolute top-50 start-0 translate-middle-y btn-icon rounded-circle ms-2"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePrev(event.id);
                                }}
                              >
                                <i className="bi bi-chevron-left"></i>
                              </button>
                              <button
                                className="position-absolute top-50 end-0 translate-middle-y btn-icon rounded-circle me-2"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNext(event.id);
                                }}
                              >
                                <i className="bi bi-chevron-right"></i>
                              </button>
                            </>
                          )}
                        </div>

                        {/* Карточка контенти */}
                        <div className="card-body">
                          <h5 className="card-title mb-3 text-truncate">{event.title}</h5>

                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center text-muted">
                              <i className="bi bi-geo-alt fs-5 me-2 text-primary"></i>
                              <span className="text-truncate">{event.address || "Онлайн"}</span>
                            </div>

                            <div className="d-flex align-items-center text-muted">
                              <i className="bi bi-clock fs-5 me-2 text-primary"></i>
                              <span>
                                {new Date(event.startDateTime).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <div className="d-flex align-items-center justify-content-between">
                              <div className="badge bg-primary bg-opacity-10 text-primary">
                                <i className="bi bi-ticket-perforated me-2"></i>
                                {remainingSpots > 0 ? (
                                  <span>{remainingSpots} орын қалды</span>
                                ) : (
                                  <span className="text-danger">Толып қалды</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Жою модали */}
                      <div
                        className="modal fade"
                        id={`deleteModal-${event.id}`} // Уникал ID
                        tabIndex="-1"
                        aria-labelledby="deleteModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content border-0 shadow">
                            <div className="modal-header border-0 pb-0">
                              <h5 className="modal-title fw-bold">іс-шараны өшіру</h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Жабу"
                              ></button>
                            </div>
                            <div className="modal-body pt-0">
                              <div className="alert my-2 alert-warning d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <span>Сіз шынымен <span className="fw-bold">{event.title}</span> өшіргіңіз келе ме?</span>
                              </div>
                              <div className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-calendar2-date me-2"></i>
                                  <span>
                                    {new Date(event.startDateTime).toLocaleDateString("ru-RU", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-clock-history me-2"></i>
                                  <span>
                                    {new Date(event.startDateTime).toLocaleTimeString("ru-RU", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer border-0">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Бас тарту
                              </button>
                              <button type="button" className="btn btn-danger" onClick={() => handleDelete(event.id)}>
                                <i className="bi bi-trash me-2"></i>
                                Жою
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangesDataAdmin;
