import React from 'react'

function SettingsUser() {


  const tableData = [
    { id: 1, firstName: 'Mark', lastName: 'Otto', handle: '@mdo', status: 'active' },
    { id: 2, firstName: 'Jacob', lastName: 'Thornton', handle: '@fat', status: 'inactive' },
    { id: 3, firstName: 'John', lastName: 'Doe', handle: '@social', status: 'active' },
    { id: 4, firstName: 'Jane', lastName: 'Smith', handle: '@jsmith', status: 'pending' }
  ];

  // Стили для разных статусов
  const statusStyles = {
    active: 'bg-success bg-opacity-10 text-success',
    inactive: 'bg-secondary bg-opacity-10 text-secondary',
    pending: 'bg-warning bg-opacity-10 text-warning'
  };

  return (
    <div className="p-4">
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white border-0 pt-3">
        <h5 className="fw-bold mb-0">Пользователи системы</h5>
        <p className="text-muted small mb-0">Всего записей: {tableData.length}</p>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{width: '50px'}}>#</th>
                <th scope="col">Имя</th>
                <th scope="col">Фамилия</th>
                <th scope="col">Email</th>
                <th scope="col">Статус</th>
                <th scope="col" className="text-end">Действия</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((user) => (
                <tr key={user.id}>
                  <th scope="row" className="fw-normal">{user.id}</th>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <a href={`https://example.com/${user.handle}`} className="text-decoration-none">
                      {user.handle}
                    </a>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${statusStyles[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-1">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SettingsUser