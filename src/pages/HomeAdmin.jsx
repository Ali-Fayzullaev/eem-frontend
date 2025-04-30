import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import useFetch from "../hook/useFetchh";
import { useState } from "react";
import { authService } from "../api/authService";


function HomeAdmin() {
  const [searchLocation, setSearchLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");

  // Retrieve the token (e.g., from localStorage)
  const token = localStorage.getItem("token"); // Replace with your token retrieval logic

  // Fetch events with authorization header
  const {
    data: events,
    loading,
    error,
  } = useFetch(
    `http://localhost:8080/api/v1/events?title=${eventCategory}&address=${searchLocation}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    }
  );

  // Function to check if the event is happening soon (within 5 days)
  const isEventSoon = (startDate) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0; // If 0 to 5 days remain
  };



   const [currentUser, setCurrentUser] = useState(null);
  
    useEffect(() => {
      // Жорий фойдаланувчини олиш
      const data = authService.getCurrentUser();
      if (data) {
        setCurrentUser(data);
        console.log(data);
      }
    }, []);


  return (
    <div className="ms-2">
    {/* Search Container */}
    <div className="search-container">
      <div className="row search-row justify-content-center mt-4">
        {/* Search by Category */}
        <div className="col-12 col-md-5">
          <div className="custom-input-group">
            <span className="input-group-text">
              <i className="bi bi-tag-fill"></i>
            </span>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Санат бойынша іздеу..."
              onChange={(e) => setEventCategory(e.target.value)}
            />
          </div>
        </div>
  
        {/* Search by Location */}
        <div className="col-12 col-md-5">
          <div className="custom-input-group">
            <span className="input-group-text">
              <i className="bi bi-geo-alt-fill"></i>
            </span>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Орналасу бойынша іздеу..."
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  
    {/* Event List */}
    <div className="container my-3">
      <p className="fw-medium h5">Барлық оқиғалар</p>
      {loading && <div className="loader">Жүктелуде...</div>}
      {error && <div className="loaderErr">{error}</div>}
  
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {events &&
          events.map((event) => {
            const remainingSpots = event.capacity;
  
            return (
              <div className="col" key={event.id}>
                <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                  {/* Image */}
                  <div className="position-relative">
                    <img
                      src={`https://picsum.photos/id/${event.id}/800/600`}
                      className="card-img-top rounded-top"
                      style={{ height: "150px", objectFit: "cover" }}
                      alt={event.title}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-2">
                      <h6 className="text-white fw-bold text-truncate m-0">
                        {event.title}
                      </h6>
                    </div>
                  </div>
  
                  {/* "SOON" Badge */}
                  {isEventSoon(event.startDateTime) && (
                    <div className="position-absolute top-0 end-0 w-100  bg-opacity-75 p-2 text-start">
                      <span class="badge text-bg-info text-white">ЖАҚЫН АРАДА</span>
                    </div>
                  )}
                  {/* Heart Icon */}
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
  
                  <NavLink
                    className="link-offset-2 link-underline link-underline-opacity-0"
                    to={`/${currentUser && currentUser.role === "admin" || "meneger" ? "admin" : "user"}/${event.id}`}
                  >
                    {/* Card Body */}
                    <div className="card-body p-3">
                      <p className="card-text small text-muted">
                        <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                        {event.address || "Онлайн"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">
                          <i className="bi bi-calendar-date-fill me-1"></i>{" "}
                          {new Date(event.startDateTime).toLocaleDateString()}
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
                          {remainingSpots} орын қалды.
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

