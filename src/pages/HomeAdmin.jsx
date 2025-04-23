// import from rrd
import { NavLink } from "react-router-dom";

// import hooks
import useFetch from "../hook/useFetch";

// import from react
import { useState } from "react";

function HomeAdmin() {
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
    <div className=" ms-2">
      <div className="search-container">
        <div className="row search-row justify-content-center mt-4">
          {/* Search Category */}
          <div className="col-12 col-md-5">
            <div className="custom-input-group">
              <span className="input-group-text">
                <i className="bi bi-tag-fill"></i>
              </span>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Search by category..."
                onChange={(e) => setEventCategory(e.target.value)}
              />
            </div>
          </div>

          {/* Search Location */}
          <div className="col-12 col-md-5">
            <div className="custom-input-group">
              <span className="input-group-text">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Search by location..."
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category */}

      <div className="container  my-3">
        <p className="fw-medium h5">All Events</p>
        {loading && <div className="loader"></div>}
        {error && <div className="loaderErr"></div>}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {events &&
            events.map((event) => {
              const joinedCount = eventsData
                ? eventsData.filter((data) => data.eventId === event.id).length
                : 0;
              const remainingSpots = event.participant - joinedCount;

              return (
                <div className="col" key={event.id}>
                  <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                    {/* Rasm */}
                    <div className="position-relative">
                      <img
                        src={event.imgUrl}
                        className="card-img-top rounded-top"
                        style={{ height: "150px", objectFit: "cover" }}
                        alt={event.eventName}
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-2">
                        <h6 className="text-white fw-bold text-truncate m-0">
                          {event.eventName}
                        </h6>
                      </div>
                    </div>
                    <NavLink
                      className="link-offset-2 link-underline link-underline-opacity-0"
                      to={`/${event.id}`} // Remove the slash before ${event.id}
                    >
                      {/* Heart ikonasi */}
                      <div className="position-absolute top-0 end-0 p-3">
                        <input
                          type="checkbox"
                          className="heart-checkbox"
                          id={`heart-${event.id}`}
                        />
                        <label
                          htmlFor={`heart-${event.id}`}
                          className="heart-label"
                        >
                          <i className="bi bi-heart-fill heart-icon"></i>
                        </label>
                      </div>

                      {/* Matn qismi */}
                      <div className="card-body p-3">
                        <p className="card-text small text-muted">
                          <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                          {event.location}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">
                            <i className="bi bi-calendar-date-fill me-1"></i>{" "}
                            {event.startDate}
                          </span>
                          <span className="badge bg-primary">
                            {event.eventType}
                          </span>
                        </div>
                        <div className="mt-2 d-flex align-items-center">
                          <i className="bi bi-people-fill me-1 text-secondary"></i>
                          <span
                            className={`fw-bold ${
                              remainingSpots <= 7
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {remainingSpots} spots left.
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
