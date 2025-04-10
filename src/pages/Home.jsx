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

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div>

      {/* img  serch location and category  */}
      <div className="position-relative ">
        <img src={home} className="img-fluid" alt="Background" />
        <div className="position-absolute w-70  top-40 start-50 translate-middle text-dark p-3 rounded">
          <div className="row d-flex justify-content-center">
            <div className="col-12 col-md-6 col-lg-4     d-flex justify-content-center">
              <div className="custom-input  fs-2 rounded-1 px-5  text-center">
                Your Event
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute w-70  top-70 start-50 translate-middle text-dark p-3 rounded">
          <form>
            <div className="row ">
              <div className="col-4  ">
                <div className="row">
                  <div className="col-12 input-group">
                    <input
                      type="text"
                      className="form-control custom-input "
                      onChange={(e) => setEventCategory(e.target.value)}
                      placeholder="Search Category..."
                    />
                    <span
                      className="input-group-text   custom-input"
                      id="basic-addon1"
                    >
                      <i class="bi bi-search"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="row">
                  <div className="col-12 input-group">
                    <input
                      type="text"
                      className="form-control custom-input"
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Search Location..."
                    />
                    <span
                      className="input-group-text custom-input"
                      id="basic-addon2"
                    >
                      <i class="bi bi-search"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <button className="btn  custom-input" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </form>
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
                  className="col-12 col-md-6 border border-2 border-info rounded shadow col-lg-3 my-3 pb-3 mx-3"
                  key={event.id}
                >
                  <NavLink
                    to={`/${event.id}`}
                    className="text-dark link-underline link-underline-opacity-0"
                  >
                    <div className="row">
                      <div className="col-12 p-0">
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

                      <div className="col-12 fw-medium text-truncate">
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
