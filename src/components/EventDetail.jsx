// import react
import { useState, useEffect } from "react";

// import hooks
import useFetch from "../hook/useFetch";

// import icon
import { FaEnvelope } from "react-icons/fa";

// import axios
import axios from "axios";

// import toasts
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

// import bootstrap

// import react-router-dom
import { Outlet, useParams, NavLink } from "react-router-dom";

function EventDetail() {
  // URL FOR DETAIL

  const { id } = useParams();
  const url = `https://67ddbf11471aaaa742826b6e.mockapi.io/events/${id}`;

  // useFetch
  const { data: detailEvents, err, louding } = useFetch(url);


  // useState
  const [isVisible, setIsVisible] = useState(false);
  const [loaderBtn, setLoaderBtn] = useState(true);

  // delete id
  const [event, setEvent] = useState([]);
  useEffect(() => {
    fetch("https://67ddbf11471aaaa742826b6e.mockapi.io/events")
      .then((res) => res.json())
      .then((data) => {
        const filteredEvents = data.filter((event) => event.id !== `${id}`);
        setEvent(filteredEvents);
      });
  }, [id]);

  // BackToTop

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // BackToTop


  // baseURL
  const axiosInstance = axios.create({
    baseURL: "https://67ddbf11471aaaa742826b6e.mockapi.io",
  });


  //useState
  const [validated, setValidated] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [detailEvent, setDetailEvent] = useState({});



  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `https://67ddbf11471aaaa742826b6e.mockapi.io/events/${id}`
      );
      setDetailEvent(res.data);
    } catch (err) {
      console.error("Not found", err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);


  // join user
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nameUser.trim() || !idNumber.trim()) {
      toast.error("Please enter all details.");
      setValidated(true);
      return;
    }
    try {
      setLoaderBtn(false)
      const response = await axiosInstance.post("/join", {
        nameUser,
        idNumber,
        eventId: detailEvent.id,
      });

      await axios
        .put(
          `https://67ddbf11471aaaa742826b6e.mockapi.io/events/${detailEvent.id}`,
          {
            subscrib: true,
          }
        )
        .then((res) => console.log("Ism o'zgартirildi:", res.data))
        .catch((error) => console.error("Xatolik yuz berdi:", error));

      console.log(response);
      toast.success("Joined!");
      setShowForm(false);
      setNameUser("");
      setIdNumber("");
      setValidated(false);

      fetchDetails();
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(err);
    } finally {
      setLoaderBtn(true);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime
    .toLocaleDateString("ru-RU")
    .replace(/\//g, ".");
  const formattedTime = currentTime.toLocaleTimeString();

  if (!detailEvents) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Toaster />
      <ToastContainer />
      {louding && <div className="loader"></div>}
      {err && <div className="loaderErr"></div>}

      {detailEvents ? (
        <div
          className="container bg-info-subtle rounded-3 mb-3 p-3"
          key={detailEvents.id}
        >
          <div className="row">
            <div className="col-12">
              <button className="btn btn-info position-fixed z-3">
                {" "}
                <NavLink
                  className="link-offset-2 text-white link-underline link-underline-opacity-0"
                  to="/"
                >
                  {" "}
                  <i class="bi bi-arrow-left text-white"></i> BACK
                </NavLink>{" "}
              </button>
            </div>
            <div className="col-12 position-relative">
              <img
                src={detailEvents.imgUrl}
                className="img-fluid rounded-3"
                style={{ width: "100%", height: "50vh", objectFit: "cover" }}
                alt={detailEvents.eventName}
              />

              <span
                className={`badge position-absolute top-0 end-0 m-3 ${
                  detailEvents.eventType === "ONLINE" ? "bg-info" : "bg-danger"
                }`}
              >
                {detailEvents.eventType}
              </span>

              <div className="position-absolute bottom-0 end-0 m-4 px-4 py-2 rounded-4 bg-info ">
                <span className="fw-bold text-white">📅 {formattedDate}</span>
                <br />
                <span className="fw-bold text-white">⏰ {formattedTime}</span>
              </div>
            </div>

            <div className="col-12 col-md-8 col-lg-6 ">
              <div className="col-12">
                <h2 className="text-primary fw-bold">
                  {detailEvents.eventName},
                </h2>
                <p className=" fs-6 fw-medium">
                  <i class="bi bi-geo-alt-fill text-danger"></i>Location:{" "}
                  {detailEvents.location}
                </p>
                <p className="fw-bold">
                  <i class="bi bi-translate text-primary"></i> Language:{" "}
                  {detailEvents.language}
                </p>
                <p>
                  <i class="bi bi-calendar-date-fill text-success"></i> Start:{" "}
                  {detailEvents.startDate} , {detailEvents.startTime}
                </p>
                <p>
                  ⌛ End: {detailEvents.endDate} , {detailEvents.endTime}
                </p>
              </div>
              <div className="col-12 mt-4">
                <h5>DISCRIPTION:</h5>
                <p
                  className="fw-medium text-muted"
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.4",
                    textAlign: "justify",
                  }}
                >
                  {detailEvents.description
                    ? detailEvents.description
                    : "No Description 😢"}
                </p>
              </div>
              <div className="col-12 my-2 d-flex gap-3 ">
                <a
                  href={`tel:${detailEvents.phone}`}
                  className="btn btn-primary"
                >
                  <i class="bi bi-telephone-fill"></i> {detailEvents.phone}
                </a>
                <a
                  href={`mailto:${detailEvents.email}`}
                  className="btn btn-danger"
                >
                  <FaEnvelope /> {detailEvents.email}
                </a>
              </div>
              <div className="col-12">
                <div className="d-flex gap-3 ">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${detailEvents.location}`}
                    className="btn btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i class="bi bi-geo-alt-fill text-danger"></i> Open in Maps
                  </a>
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${detailEvents.eventName}&dates=${detailEvents.startDate}T${detailEvents.startTime}/${detailEvents.endDate}T${detailEvents.endTime}&details=${detailEvents.description}`}
                    className="btn btn-success"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📅 Add to Calendar
                  </a>
                </div>
              </div>
            </div>
            {/* <div className="col-6">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/wFolN58l8Oc?si=jcaKMwXQPMu3jnhT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
         
          </div> */}
            <div className="col-12">
              <div className="row d-flex justify-content-end ">
                {detailEvent && detailEvent.subscrib === false ? (
                  <div className={`col-12 col-md-8 col-lg-4 my-3 `}>
                    <div
                      className="accordion my-custom-accordion "
                      id="accordionExample"
                    >
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            onClick={() => setShowForm(!showForm)}
                            type="button"
                            data-bs-target="#collapseOne"
                            aria-expanded={showForm ? "true" : "false"}
                            aria-controls="collapseOne"
                          >
                            
                            JOIN EVENT
                          </button>
                        </h2>
                        <div
                          id="collapseOne"
                          className={`accordion-collapse    ${
                            showForm ? "show" : ""
                          }`}
                        >
                          <div className="accordion-body ">
                            <form
                              className={`needs-validation ${
                                validated ? "was-validated" : ""
                              }`}
                              onSubmit={handleSubmit}
                              noValidate
                            >
                              <div className="mb-3">
                                <label
                                  htmlFor="fullName"
                                  className="form-label"
                                >
                                  Full Name (L.F.M.)
                                </label>
                                <input
                                  type="text"
                                  value={nameUser}
                                  onChange={(e) => setNameUser(e.target.value)}
                                  className="form-control"
                                  id="fullName"
                                  placeholder="Enter your full name..."
                                  required
                                />
                                <div className="invalid-feedback">
                                  Please enter your full name.
                                </div>
                              </div>

                              <div className="mb-3">
                                <label
                                  htmlFor="idNumber"
                                  className="form-label"
                                >
                                  ID Number
                                </label>
                                <input
                                  type="text"
                                  value={idNumber}
                                  onChange={(e) => setIdNumber(e.target.value)}
                                  className="form-control"
                                  id="idNumber"
                                  placeholder="Enter your ID number..."
                                  required
                                />
                                <div className="invalid-feedback">
                                  Please enter your ID number.
                                </div>
                                <div id="passwordHelpBlock" class="form-text">
                                  Enter your ID number (e.g., Passport, INN, or
                                  License Number).
                                </div>
                              </div>

                              <div className="d-flex justify-content-end">
                                <button
                                  type="submit"
                                  className="btn btn-success px-5 d-flex justify-content-center"
                                >
                                   <span>{loaderBtn ? <span>Join</span> : <span className="loaderBtn"></span>}</span>
                                 
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-12 col-md-8 col-lg-4 my-3 d-flex justify-content-end">
                    <button className="btn btn-info  px-5 text-white py-2">
                      <i class="bi bi-check-circle-fill color-custom"></i>{" "}
                      JOINED:{" "}
                      <span className=" fw-bold">{detailEvents.eventName}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>louding...</h1>
      )}

      <Outlet />
      {/* Other events  */}
      <div className="container">
        Other events <br />
        <div className="row d-flex justify-content-center">
          {louding && <div className="loader"></div>}
          {err && <div className="loaderErr"></div>}
          {event &&
            event.map((event) => {
              return (
                <>
                  <div
                    className="col-12 col-md-6  border border-2 border-info rounded shadow  col-lg-3  rounded-3 my-3 pb-3 mx-3"
                    key={event.id}
                  >
                    <NavLink
                      onClick={scrollToTop}
                      to={`/${event.id}`}
                      className="text-dark link-underline link-underline-opacity-0"
                    >
                      <div className="row">
                        <div className="col-12 p-0">
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
                        </div>
                        <div className="col-12 fw-medium text-truncate ">
                          <i className="bi bi-bookmark-check-fill text-primary"></i>
                          {event.eventName} ,
                          <span className="fw-bold">
                            <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                            {event.location}
                          </span>
                        </div>

                        <div className="col-12">
                          <i className="bi bi-calendar-date-fill text-warning"></i>{" "}
                          {event.startDate} ,
                          <i className="bi bi-alarm-fill text-info"></i>{" "}
                          {event.startTime}
                        </div>

                        <div className="col-12">
                          <span className="badge bg-info">
                            {event.eventType}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
