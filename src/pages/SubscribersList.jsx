import { useParams, NavLink } from "react-router-dom";
import useFetch from "../hook/useFetch";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

function SubscribersList() {
  const { userList } = useParams();

  const token = localStorage.getItem("accessToken");

  const { data: registrations, loading } = useFetch(
    `http://localhost:8080/api/v1/events/${userList}/registrations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data: event } = useFetch(
    `http://localhost:8080/api/v1/events/${userList}`
  );


  const events = registrations?.content;

  if (!event) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const progressValue = Math.round(
    (event?.registeredAttendeesCount / event.capacity) * 100
  );
  const isOnline = event?.online;
  const isOffline = !event?.online && event.address;

  return (
    <div className="container-fluid m-0 p-0">
      <Toaster />
      <ToastContainer />
      <div className="card shadow-sm rounded-0 ">
        <div className="card-header rounded-0 bg-info text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Қатысушылар тізімі:</h5>
          <div className="d-flex gap-2">
            <span className="badge text-bg-success">
              Қатысады: {events?.length}
            </span>
            
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="card-body p-0">
              {loading ? (
                <div className="p-3">Loading...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table border border-3 table-hover m-0 mb-0">
                    <thead className="table table-info">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Аты</th>
                        <th scope="col"> Username</th>
                        <th scope="col">Күні</th>
                       

                      </tr>
                    </thead>
                    <tbody>
                      {events.length > 0 ? (
                        events.map((user, index) => (
                          <tr key={user.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.userFullName}</td>
                            <td>{user.username}</td>
                            <td>
                              {new Date(
                                user.registrationTime
                              ).toLocaleDateString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </td>
                            
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-3">
                            No participants found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          {event && (
            <div className="col-12 col-lg-4 mb-5" key={event.id}>
              <div className="event-card-wrapper">
                {/* Прогресс-жолақ */}
                <div className="eb-progress-bar-wrapper">
                  <div
                    className="eb-progress-bar html"
                    style={{
                      "--value": progressValue,
                      "--col": isOnline ? "#0DCAF0" : "#20C997",
                    }}
                  >
                    <progress
                      id="html"
                      min="0"
                      max={event.capacity}
                      value={event.registeredAttendeesCount}
                    ></progress>
                  </div>
                  <label htmlFor="html" className="eb-progress-bar-title mt-3">
                    <h3 className="mb-0">{event.title}</h3>
                    <span className="badge bg-light text-dark mt-2">
                      {event.eventType === "MEETUP" ? "Кездесу" : "Іс-шара"}
                    </span>
                  </label>
                </div>

                {/* Іс-шара туралы мәліметтер */}
                <div className="event-details">
                  <div className="detail-item">
                    <i className="bi bi-card-text"></i>
                    <p>{event.description}</p>
                  </div>

                  <div className="detail-item">
                    <i className="bi bi-calendar-date"></i>
                    <div>
                      <span>
                        {new Date(event.startDateTime).toLocaleDateString(
                          "kk-KZ"
                        )}
                      </span>
                      <small className="text-muted d-block">
                        {new Date(event.startDateTime).toLocaleTimeString(
                          "kk-KZ",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(event.endDateTime).toLocaleTimeString(
                          "kk-KZ",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </small>
                    </div>
                  </div>

                  <div className="detail-item">
                    <i className="bi bi-people"></i>
                    <span>
                      Орындар: {event.registeredAttendeesCount || 0}/
                      {event.capacity}
                    </span>
                  </div>

                  {isOnline && (
                    <div className="detail-item">
                      <i className="bi bi-link-45deg"></i>
                      <a href={event.onlineLink} target="_blank" rel="noopener">
                        Онлайн-қатысу
                      </a>
                    </div>
                  )}

                  {isOffline && (
                    <div className="detail-item">
                      <i className="bi bi-geo-alt"></i>
                      <span>{event.address}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <i className="bi bi-calendar-check"></i>
                    <div>
                      <span>
                        Жасалған күн:{" "} <br />
                        {new Date(event.createdAt).toLocaleDateString("kk-KZ")}
                      </span>
                    </div>
                  </div>

                  <NavLink to={`/admin/${userList}`}>
                    <button className="btn btn-primary mt-1 w-100">
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Тіркелу
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscribersList;
