import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useFetch from "../hook/useFetchh";

function SettingsUser() {
  const { data: tableData, loading, error, refetch } = useFetch(`/users`);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "Aa12345+",
    phoneNumber: "",
    roles: [],
  });

  const adminAxios = axios.create({
    baseURL: "http://localhost:8080/api/v1/admin",
  });

  // Хар бир суровга токен қўшадиган интерсептор
  adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Учириш функцияси
  const handleDeleteUser = async (userId) => {
    try {
      await adminAxios.delete(`/users/${userId}`);
      toast.success("User has been deleted");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error :(");
    }
  };

  // Таҳрирлашни бошлаш
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: "Aa12345+",
      phoneNumber: user.phoneNumber,
      roles: user.roles,
    });
  };

  // Формани ўзгартириш
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Валидация
  const validateForm = () => {
    const errors = [];
    if (!editFormData.firstName || editFormData.firstName.length < 3) {
      errors.push("The name must be at least 3 characters long");
    }
    if (!editFormData.lastName || editFormData.lastName.length < 3) {
      errors.push("The last name must be at least 3 characters long");
    }
    if (!editFormData.username) {
      errors.push("Username is required");
    }
    if (!editFormData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      errors.push("Incorrect email format");
    }
    if (!Array.isArray(editFormData.roles) || editFormData.roles.length === 0) {
      errors.push("Role not selected");
    }
    return errors;
  };

  // Янгилаш
  const handleUpdateUser = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      // Prepare payload in the exact required format
      const payload = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        username: editFormData.username,
        email: editFormData.email,
        password: editFormData.password, // Always include password
        phoneNumber: editFormData.phoneNumber || null, // Include phoneNumber even if null
        roles: editFormData.roles.map((role) => ({
          id: role.id,
          name: role.name,
        })),
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      await adminAxios.put(`/users/${editingUser.id}`, payload);
      toast.success("Updated successfully!");
      setEditingUser(null);
      refetch();
    } catch (err) {
      console.error("Full error details:", {
        message: err.message,
        responseData: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          data: err.config?.data,
        },
      });

      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        "Failed to update user";

      toast.error(`Update failed: ${serverMessage}`);
    }
  };

  return (
    <div className="p-5">
      {" "}
      <div className="card shadow-sm border-0">
        {" "}
        <div className="card-header bg-white border-0 pt-3">
          {" "}
          <h5 className="fw-bold mb-0">Пайдаланушылар</h5>{" "}
          <p className="text-muted small mb-0"> Барлығы: {tableData?.length || 0} </p>{" "}
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th width="50">№</th>
                  <th>Аты</th>
                  <th>Тегі</th>
                  <th>Пайдаланушы аты</th>
                  <th>Электрондық пошта</th>
                  <th>Рөлі</th>
                  <th width="120" className="text-end">
                    Өңдеу
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Жүктелуде...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center text-danger py-4">
                      Қате: {error.message}
                    </td>
                  </tr>
                ) : (
                  tableData?.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        {user ? (
                          user.roles.includes("ROLE_ADMIN") ? (
                            <span class="badge fw-medium text-white text-bg-warning">админ</span>
                          ) : user.roles.includes("ROLE_MANAGER") ? (
                            <span class="badge fw-medium text-white text-bg-info">менеджер</span>
                          ) : (
                            <span class="badge fw-medium text-white text-bg-secondary">пайдаланушы</span>
                          )
                        ) : (
                          ""
                        )}
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-lg-1 my-1 my-md-0"
                          onClick={() => handleEditClick(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          data-bs-toggle="modal"
                          data-bs-target={`#deleteModal-${user.id}`}
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                        {/* Жою модальдық терезесі */}
                        <div className="modal fade" id={`deleteModal-${user.id}`} tabIndex="-1" aria-hidden="true">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">{user.firstName} жою</h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Жабу"
                                ></button>
                              </div>
                              <div className="modal-body">
                                <p>
                                  Сіз шынымен жойғыңыз келе ме?
                                  <strong> {user.firstName}</strong>
                                </p>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                  Бас тарту
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  data-bs-dismiss="modal"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Жою
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
      {/* Өңдеу модальдық терезесі */}
      {editingUser && (
        <div
          className="modal fade show"
          id="editUserModal"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Пайдаланушыны өңдеу</h5>
                <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Аты</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Тегі</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Пайдаланушы аты</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Электрондық пошта</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">phoneNumber</label>
                  <input
                    type="phoneNumber"
                    className="form-control"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleEditFormChange}
                  />
                </div>
                <select
                  className="form-select"
                  value={editFormData.roles[0]?.id || ""}
                  onChange={(e) => {
                    const roleId = parseInt(e.target.value);
                    const roleName = `ROLE_${e.target.options[e.target.selectedIndex].text.toUpperCase()}`;
                    setEditFormData({
                      ...editFormData,
                      roles: [{ id: roleId, name: roleName }],
                    });
                  }}
                >
                  <option value="1">USER</option>
                  <option value="2">MANAGER</option>
                  <option value="3">ADMIN</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                  Бас тарту
                </button>
                <button type="button" className="btn bg-primary text-white " onClick={handleUpdateUser}>
                  Сақтау
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsUser;
