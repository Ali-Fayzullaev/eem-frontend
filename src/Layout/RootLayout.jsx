import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import iconEventManagement from "../assets/iconEvent.png";

function RootLayout() {
  const handleCloseMenu = () => {
    const offcanvasEl = document.getElementById("mobileMenu");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
  };

  return (
    <div className="d-flex flex-column  vh-100">
      {/* Header */}
      <header className="bg-light text-black py-3">
        <div className="container-fluid container-lg   d-flex justify-content-between align-items-center">
          <NavLink
            className="d-flex justify-content-center align-content-center navbar-brand"
            to="/"
          >
            <figure>
              <img
                src={iconEventManagement}
                width="50"
                height="50"
                className="rounded-circle"
                alt="EEM"
              />
            </figure>
          </NavLink>

          {/* Toggle button for small screens */}
          <button
            className="btn btn-outline-info d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          {/* Offcanvas menu for small screens */}
          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="mobileMenu"
            aria-labelledby="mobileMenuLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="mobileMenuLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body d-flex flex-column gap-3">
              <NavLink
                to="/"
                className="text-decoration-none"
                onClick={handleCloseMenu}
              >
                Home
              </NavLink>
              {/* <NavLink
                to="/create"
                className="text-decoration-none"
                onClick={handleCloseMenu}
              >
                Create
              </NavLink> */}
              <NavLink
                to="/myEvents"
                className="text-decoration-none"
                onClick={handleCloseMenu}
              >
                My Events
              </NavLink>
              <NavLink
                to="/login"
                className="btn btn-success text-white text-decoration-none"
                onClick={handleCloseMenu}
              >
                Sign in
              </NavLink>

              {/* Toggle theme (remains inactive for now) */}
              {/* <div className="d-inline-flex justify-content-center align-items-center gap-3 mt-3">
                <span onClick={toggleMode}>
                  <i
                    className={`bi text-warning ${showLight ? "" : "visually-hidden"} bi-sun-fill fs-3`}
                  ></i>
                </span>
                <span onClick={toggleMode}>
                  <i
                    className={`bi text-warning ${showLight ? "visually-hidden" : ""} bi-moon-stars-fill fs-4`}
                  ></i>
                </span>
              </div> */}
            </div>
          </div>

          {/* Navigation for large screens */}
          <nav className="d-none d-lg-flex align-items-center">
            <NavLink to="/" className="me-3 text-decoration-none">
              Home
            </NavLink>
            {/* <NavLink to="/create" className="me-3 text-decoration-none">
              Create
            </NavLink> */}
            <NavLink to="/myEvents" className="me-3 text-decoration-none">
              My Events
            </NavLink>
            <NavLink
              to="/login"
              className="btn btn-success text-white me-4 text-decoration-none"
            >
              Sign in
            </NavLink>
            {/*Toggle for dark light */}
            {/* <span className="d-inline-flex justify-content-center align-items-center">
              <span onClick={toggleMode}>
                <i className={`bi text-warning ${showLight ? "" : "visually-hidden"} bi-sun-fill fs-3`}></i>
              </span>
              <span onClick={toggleMode}>
                <i className={`bi text-warning ${showLight ? "visually-hidden" : ""} bi-moon-stars-fill fs-4`}></i>
              </span>
            </span> */}
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
