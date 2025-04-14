// import  react
import { useState, useEffect } from "react";

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

function MyEvents() {
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
  const [showTwo, setShowTwo] = useState(true);

  const handleOpenCloseAccordionTwo = () => {
    setShowTwo(!showTwo);
  };

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
      <h2 className="text-center my-4 text-info">📅 My Events</h2>
      <div className="accordion" id="accordionPanelsStayOpenExample">

        {/* accordion two */}
        {subscribedEvents && (
          <div className="accordion-item my-custom-accordion">
            <h2 className="accordion-header">
              <button
                className="accordion-button "
                onClick={handleOpenCloseAccordionTwo}
                type="button"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseTwo"
              >
                <div className="w-100 h-100 my-2 text-start d-flex justify-content-between align-items-center">
                  <span className="fw-medium fs-5">My Registered Events </span>
                  {subscribedEvents.length ? (
                    <span className="fw-bolder mx-3">
                      You have:
                      <code className="fs-5 ">
                        {" "}
                        {loading && (
                          <div className="loaderEvents d-inline-block"></div>
                        )}{" "}
                        {subscribedEvents.length}{" "}
                      </code>{" "}
                      events
                    </span>
                  ) : (
                    "You are not subscribed to any events 😢"
                  )}
                </div>

                <p></p>
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTwo"
              className={`accordion-collapse scrollable ${
                showTwo ? "show" : ""
              }`}
            >
              <div className="accordion-body ">
                {loading && <div className="loader"></div>}
                {error && <div className="loaderErr"></div>}
                <div className="row">
                  {subscribedEvents.map((event) => (
                    <div key={event.id} className="col-md-4">
                      <div className="card mb-3 ">
                        {event.imgUrl && (
                          <img
                            src={event.imgUrl}
                            className=" img-fluid rounded-3"
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                            }}
                            alt={event.eventName}
                          />
                        )}
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
                              📆 Add to Calendar
                            </button>

                            <button
                              data-bs-toggle="modal"
                              data-bs-target={`#modal-${event.id}`}
                              className="btn btn-danger"
                            >
                              Unsubscribe
                            </button>

                            <div
                              className="modal fade"
                              key={event.id}
                              id={`modal-${event.id}`}
                              tabIndex="-1"
                              data-bs-backdrop="false"
                              aria-labelledby="unsubscribeModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="unsubscribeModalLabel"
                                    >
                                      Unsubscribe from Event
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <p>
                                      Do you really want to unsubscribe from the
                                      event <strong>{event.eventName}</strong>?
                                    </p>
                                    <p>
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
                                      Close
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUnsubscribe(event.id)
                                      }
                                      className="btn btn-danger"
                                    >
                                      Unsubscribe
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;
