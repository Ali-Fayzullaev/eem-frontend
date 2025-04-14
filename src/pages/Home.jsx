// import css
import "../App.css";

// import img
import home from "../assets/imgForHome.svg";
// import from rrd
import { NavLink } from "react-router-dom";

// import hooks
import useFetch from "../hook/useFetch";

// import from react
import { useState } from "react";

function Home() {
  // useState
  const [searchLocation, setSearchLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");

  // search location and Category
  const {
    data: events,
    loading,
    error,
  } = useFetch(
    `https://67ddbf11471aaaa742826b6e.mockapi.io/events?eventName=${eventCategory}&location=${searchLocation}`
  );

  const { data: eventsData } = useFetch(
    "https://67ddbf11471aaaa742826b6e.mockapi.io/join"
  );

  return (
    <div>
      {/* img  serch location and category  */}
      {/* <div className="row d-flex justify-content-center border border-2">
              <div className="col-5">
                <div className="row">
                  <div className="col-12 input-group">
                    <input
                      type="text"
                      className="form-control custom-input p-2"
                      onChange={(e) => setEventCategory(e.target.value)}
                      placeholder="Search Category..."
                    />
                    <span
                      className="input-group-text   custom-input"
                      id="basic-addon1"
                    >
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-5">
                <div className="row">
                  <div className="col-12 input-group">
                    <input
                      type="text"
                      className="form-control custom-input p-2"
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Search Location..."
                    />
                    <span
                      className="input-group-text custom-input"
                      id="basic-addon2"
                    >
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
              </div>
      </div> */}
      <div className="row justify-content-center mt-4">
          {/* Search Category */}
          <div className="col-10 col-md-5 mb-3 mb-md-0">
            <div className="input-group custom-input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control custom-input border-start-0"
                placeholder="Search Category..."
                onChange={(e) => setEventCategory(e.target.value)}
              />
            </div>
          </div>

          {/* Search Location */}
          <div className="col-10 col-md-5">
            <div className="input-group custom-input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control custom-input border-start-0"
                placeholder="Search Location..."
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

      {/* Category */}

      <div className="container  my-3">
        <p className=" fw-medium h5">Browse By Category</p>

        {loading && <div className="loader"></div>}
        {error && <div className="loaderErr"></div>}
        <div className="row d-flex justify-content-center ">
          {events &&
            events.map((event) => {
              const joinedCount = eventsData
                ? eventsData.filter((data) => data.eventId === event.id).length
                : 0;
              const remainingSpots = event.participant - joinedCount;

              return (
                <div
                  className="col-5 bg-white border-custom rounded shadow col-lg-3 mx-3 my-3  pb-3 "
                  key={event.id}
                >
                  <NavLink
                    to={`/${event.id}`}
                    className="text-dark link-underline link-underline-opacity-0"
                  >
                    <div className="row">
                      <div className="col-12  p-0">
                        <img
                          src={event.imgUrl}
                          className="img-fluid rounded-3"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                          alt={event.eventName}
                        />
                      </div>

                      <div className="col-12 mt-2 fw-medium text-truncate">
                        <i className="bi bi-bookmark-check-fill text-primary"></i>{" "}
                        {event.eventName},
                        <span className="fw-bold">
                          <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                          {event.location}
                        </span>
                      </div>

                      <div className="col-12">
                        <i className="bi bi-calendar-date-fill text-warning"></i>{" "}
                        {event.startDate},
                        <i className="bi bi-alarm-fill text-info"></i>{" "}
                        {event.startTime},
                        {remainingSpots !== undefined ? (
                          <span className="text-danger fw-bold ms-2">
                            <i className="bi bi-people-fill text-primary"></i>
                            <span
                              className={
                                remainingSpots <= 7
                                  ? "text-danger mx-1"
                                  : "text-success mx-1"
                              }
                            >
                              {remainingSpots}
                            </span>
                          </span>
                        ) : (
                          <span className=" fs-6">{loading}</span>
                        )}
                      </div>

                      <div className="col-12">
                        <span className="badge bg-info">{event.eventType}</span>
                      </div>
                    </div>
                  </NavLink>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Home;
