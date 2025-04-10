import { useParams } from "react-router-dom";
import useFetch from "../hook/useFetch";
import { useEffect, useState, createContext } from "react";
import axios from "axios";

// import toasts
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

function SubscribersList() {
  const { userList } = useParams(); // bu eventId
  const [subscribedEvents, setSubscribedEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const { data: events } = useFetch(
    `https://67ddbf11471aaaa742826b6e.mockapi.io/events`
  );

  const axiosInstance = axios.create({
    baseURL: "https://67ddbf11471aaaa742826b6e.mockapi.io/",
  });

  const fetchSubscribedEvents = async () => {
    try {
      const res = await axios.get(
        "https://67ddbf11471aaaa742826b6e.mockapi.io/join",
        {
          params: { eventId: userList }, // ✅
        }
      );
      setSubscribedEvents(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosInstance.delete(`join/${id}`);

      console.log(`Deleted event id: ${id}`);
      toast.success("Cancelled !");
      fetchSubscribedEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  useEffect(() => {
    fetchSubscribedEvents();
  }, [userList]);

  const currentEvent = events?.find((event) => event.id === Number(userList));

  const totalParticipants = currentEvent?.participant || 10;

  const progressValue = Math.min(
    (subscribedEvents.length / totalParticipants) * 100,
    100
  );

  console.log(subscribedEvents.length);
  return (
    <div className="container-fluid m-0 p-0">
      <Toaster />
      <ToastContainer />
      <div className="card shadow-sm rounded-0 ">
        <div className="card-header rounded-0 bg-info text-white">
          <h5 className="mb-0">List of Participants</h5>
        </div>
        <div className="row">
          <div className="col-12  col-lg-8">
            <div className="card-body  p-0">
              {loading ? (
                <div className="p-3">Loading...</div>
              ) : (
                <table className="table border border-3 table-hover m-0 mb-0">
                  <thead className=" table table-info">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Ism</th>
                      <th scope="col">Email</th>
                      <th scope="col">ID number</th>
                      <th scope="col">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribedEvents.length > 0 ? (
                      subscribedEvents.map((user, index) => (
                        <tr key={user.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.nameUser}</td>
                          <td>{user.email}</td>
                          <td>{user.idNumber}</td>
                          <td className=" d-flex gap-2">
                            <button className="btn btn-primary">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button
                              data-bs-toggle="modal"
                              data-bs-target={`#modal-${user.id}`}
                              className="btn btn-danger"
                            >
                              <i class="bi bi-trash3-fill"></i>
                            </button>

                            <div
                              className="modal fade"
                              key={user.id}
                              id={`modal-${user.id}`}
                              tabIndex="-1"
                              data-bs-backdrop="false"
                              aria-labelledby="deleteUserModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog ">
                                <div className="modal-content">
                                  <div className="modal-body">
                                    <p>
                                      Do you really want to Delete from the
                                      event <strong>, {user.nameUser}</strong>?
                                    </p>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      data-bs-dismiss="modal"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      data-bs-dismiss="modal"
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="btn btn-danger"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
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
              )}
            </div>
          </div>
          <div className="col-12  col-lg-4 align-items-center d-flex justify-content-center">
            <div className="eb-progress-bar-wrapper align-items-center   d-flex justify-content-center">
              <div className="row align-items-center  d-flex justify-content-center">
                <div className="col-12 align-items-center  d-flex justify-content-center">
                  <div
                    className="eb-progress-bar html"
                    style={{ "--value": progressValue, "--col": "#0DCAF0" }}
                  >
                    <progress
                      id="html"
                      min="0"
                      max="100"
                      value={100}
                    ></progress>
                  </div>
                </div>
                <div className="col-12 align-items-center d-flex justify-content-center">
                  <label htmlFor="html" className="eb-progress-bar-title ">
                    <h2>Name event</h2>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscribersList;
