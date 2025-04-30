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
        <Outlet />
    </div>
  );
}

export default RootLayout;
