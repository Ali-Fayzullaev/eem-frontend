import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useFetch from "../hook/useFetchh";

function SettingsUser() {
  const { 
    data: tableData, 
    loading, 
    error, 
    refetch 
  } = useFetch(`http://localhost:8080/api/v1/admin/users`);


  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nameUser: "",
    idNumber: "",
    email: "",
  });

  const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1/admin",
});

// Хар бир суровга токен қўшадиган интерсептор
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

  // delete users
  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      console.log(axiosInstance);
      toast.success("User delete");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Error");
    }
  };

  // edit user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      nameUser: user.nameUser,
      idNumber: user.idNumber,
      email: user.email,
    });
  };

  // change form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // refetch
  const handleUpdateUser = async () => {
    try {
      await axiosInstance.put(`/users/${editingUser.id}`, editFormData);
      toast.success("User updated successfully!");
      setEditingUser(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  return (
    <div className="p-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-3">
          <h5 className="fw-bold mb-0">Пользователи системы</h5>
          <p className="text-muted small mb-0">
            Всего записей:{" "}
            {tableData && tableData.length ? tableData.length : "0"}
          </p>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "50px" }}>
                    #
                  </th>
                  <th scope="col">Имя</th>
                  <th scope="col">ID</th>
                  <th scope="col">Email</th>
                  <th scope="col" className="text-end">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Update...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center text-danger py-4">
                      Error...
                    </td>
                  </tr>
                ) : (
                  tableData &&
                  tableData.map((user) => (
                    <tr key={user.id}>
                      <th scope="row" className="fw-normal text-center">
                        {user.id}
                      </th>
                      <td>{user.nameUser}</td>
                      <td>
                        <a
                          href={`https://example.com/${user.id}`}
                          className="text-decoration-none"
                        >
                          {user.idNumber}
                        </a>
                      </td>
                      <td>
                        <span className="">{user.email}</span>
                      </td>
                      <td className="text-end">
                        {/* Таҳрирлаш тугмаси */}
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          data-bs-toggle="modal"
                          data-bs-target="#editUserModal"
                          onClick={() => handleEditClick(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* Учириш тугмаси */}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          data-bs-toggle="modal"
                          data-bs-target={`#deleteModal-${user.id}`}
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                        {/* Учириш модали */}
                        <div
                          className="modal fade"
                          id={`deleteModal-${user.id}`}
                          tabIndex="-1"
                          aria-labelledby="deleteModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="deleteModalLabel"
                                >
                                  Delete user {user.nameUser}
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                Do you really want to Delete user
                                <strong> {user.nameUser}</strong>{" "}
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Cansel
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  data-bs-dismiss="modal"
                                  onClick={() => handleDeleteUser(user.id)}
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
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Таҳрирлаш модали */}
      <div
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
        aria-labelledby="editUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserModalLabel">
                Фойдаланувчини таҳрирлаш
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="nameUser" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameUser"
                    name="nameUser"
                    value={editFormData.nameUser}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="idNumber" className="form-label">
                    Фамилияси
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="idNumber"
                    name="idNumber"
                    value={editFormData.idNumber}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Бекор қилиш
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleUpdateUser}
              >
                Сақлаш
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsUser;
