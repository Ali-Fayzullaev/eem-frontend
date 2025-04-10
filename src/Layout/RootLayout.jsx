import { Outlet, NavLink } from "react-router-dom";

import iconEventManagement from "../assets/iconEvent.png";

function RootLayout() {
  return (
    <div className="d-flex flex-column  vh-100">
      {/* Header */}
      <header className=" bg-light text-black py-3">
        <div className=" container  d-flex justify-content-between align-items-center">
          <NavLink
            className=" d-flex  justify-content-center align-content-center navbar-brand"
            to="/"
          >
            <figure>
              <img
                src={iconEventManagement}
                width="50"
                height="50"
                className="rounded-circle"
                alt="Event"
              />
            </figure>
          </NavLink>
          <nav className=" text-white">
            <NavLink to="/" className=" me-3 text-decoration-none">
              Home
            </NavLink>
            <NavLink to="/create" className=" me-3 text-decoration-none">
              Create
            </NavLink>

            <NavLink to="/myEvents" className=" me-3 text-decoration-none">
              My events
            </NavLink>

            <NavLink
              to="/login"
              className="text-white btn btn-success me-lg-2 text-decoration-none"
            >
              Sign in
            </NavLink>
          </nav>
        </div>
      </header>
      {/* main */}
      <main className="container-fluid m-0 p-0 flex-grow-1 d-flex align-items-start justify-content-center">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className=" bg-dark text-white text-center py-3 mt-auto">
        <p className="m-0">© 2025 My Website</p>
      </footer>
    </div>
  );
}

export default RootLayout;
