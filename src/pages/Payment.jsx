import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { authService } from "../api/authService";
import { useState, useEffect } from "react";
import useFetch from "../hook/useFetchh";
import "../Pay.css";
function Payment() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [activeIndices, setActiveIndices] = useState({});

  useEffect(() => {
    const data = authService.getCurrentUser();
    if (data) {
      setCurrentUser(data);
    }
  }, []);

  const { data: event } = useFetch(`http://localhost:8080/api/v1/events/${id}`);

  const isEventSoon = (startDate) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  };

  const eventsArray = Array?.isArray(event) ? event : [event];

  return (
    <>
      {eventsArray &&
        eventsArray?.map((e) => {
          const remainingSpots = e?.capacity - e?.registeredAttendeesCount;
          const eventImages = e?.images || [];
          const activeIndex = activeIndices[e?.id] || 0;
          return (
            <div className="card-pay" key={e?.id}>
              <div className="card-top border-bottom text-center">
                <Link
                  to={`/${
                    currentUser && (currentUser?.role === "admin" || currentUser?.role === "meneger") ? "admin" : "user"
                  }/events`}
                >
                  Бас тарту
                </Link>
                <span id="logo">{e?.title}</span>
              </div>

              <div className="card-body-pay">
                <div className="row upper">
                  <span>
                    <i className="fa fa-check-circle-o"></i> Сатып алу себеті
                  </span>
                  <span>
                    <i className="fa fa-check-circle-o"></i> Тапсырыс мәліметтері
                  </span>
                  <span id="payment">
                    <span id="three">$</span>Төлем
                  </span>
                </div>

                <div className="row">
                  <div className="col-md-7">
                    <div className="left border">
                      <div className="row">
                        <span className="header">Төлем</span>
                        <div className="icons">
                          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
                          <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="MasterCard" />
                          <img src="https://img.icons8.com/color/48/000000/maestro.png" alt="Maestro" />
                        </div>
                      </div>
                      <form>
                        <span>Карта иесінің аты:</span>
                        <input placeholder="Линда Уильямс" />
                        <span>Карта нөмірі:</span>
                        <input placeholder="0125 6780 4567 9909" />
                        <div className="row">
                          <div className="col-4">
                            <span>Мерзімі:</span>
                            <input placeholder="YY/MM" />
                          </div>
                          <div className="col-4">
                            <span>CVV:</span>
                            <input id="cvv" />
                          </div>
                        </div>
                        <input type="checkbox" id="save_card" className="align-left" />
                        <label htmlFor="save_card">Карта мәліметтерін сақтау</label>
                      </form>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="right border">
                      <div className="header">Тапсырыс шолуы</div>
                      <p>2 өнім</p>

                      <div className="col" key={e?.id}>
                        <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                          {/* Image Carousel */}
                          <div className="position-relative">
                            {eventImages.length > 0 ? (
                              <>
                                <div className="carousel-inner">
                                  <img
                                    src={
                                      eventImages[activeIndex]?.imageUrl || `https://picsum.photos/id/${e?.id}/800/600`
                                    }
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
                                src={`https://picsum.photos/id/${e?.id}/800/600`}
                                className="card-img-top rounded-top"
                                alt="Event"
                                style={{ height: "180px", objectFit: "cover" }}
                              />
                            )}

                            {/* Event title overlay */}
                            <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-2">
                              <h6 className="text-white fw-bold text-truncate m-0">{e?.title}</h6>
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
                                        goToImage(e?.id, index);
                                      }}
                                      aria-label={`Slide ${index + 1}`}
                                    ></button>
                                  ))}
                                </div>
                              </span>
                            </div>
                          )}

                          {/* "SOON" Badge */}
                          {isEventSoon(e?.startDateTime) && (
                            <div className="position-absolute top-0 end-0 w-100 bg-opacity-75 p-2 text-start">
                              <span className="badge text-bg-info text-white">ЖАҚЫН АРАДА</span>
                            </div>
                          )}
                            {/* Card Body */}
                            <div className="card-body p-3">
                              <p className="card-text small text-muted">
                                <i className="bi bi-geo-alt-fill me-1"></i> {e?.address || "Онлайн"}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">
                                  <i className="bi bi-calendar-date-fill me-1"></i>{" "}
                                  {new Date(e?.startDateTime).toLocaleDateString()}
                                </span>
                                <span className="badge bg-primary">{e?.eventType}</span>
                              </div>
                              <div className="mt-2 d-flex align-items-center">
                                <i className="bi bi-people-fill text-primary me-1 "></i>
                                <span className={`fw-bold ${remainingSpots <= 7 ? "text-danger" : "text-success"}`}>
                                  {remainingSpots > 0 ? <span>{remainingSpots} орын бар</span> : "орын жок"}
                                </span>
                              </div>
                            </div>
                        </div>
                      </div>

                      <hr />
                      <div className="row lower">
                        <div className="col text-left">Аралық жиынтық</div>
                        <div className="col text-right">$46.98</div>
                      </div>
                      <div className="row lower  mt-3">
                        <button className="btn btn-primary btn-block"> Pay</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}

export default Payment;
