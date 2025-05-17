//AdminDashboard.jsx;
import { useState, useEffect } from "react";
import { getTokenExpiration } from "../utils/jwt";
import { authService } from "../api/authService";
import { Link } from "react-router-dom";
import {
  BiHome,
  BiMenu,
  BiLogOut,
  BiHeart,
  BiBell,
  BiSolidCalendar,
  BiMap,
  BiBarChartAlt2,
  BiClipboard

} from "react-icons/bi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import iconEventManagement from "../assets/iconEvent.png";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "admin") setActiveTab("home");
    else if (["users", "create", "changes"].includes(path)) setActiveTab(path);
  }, [location]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    setIsModalOpen(true); // Open the modal
  };

  const confirmLogout = () => {
    setIsModalOpen(false); // Close the modal
    navigate("/login"); // Redirect to login page (or wherever logout should lead)
  };

  const cancelLogout = () => {
    setIsModalOpen(false); // Close the modal without logging out
  };

  // Regular tabs (excluding Logout)
  const tabs = [
    {
      id: "allEvents",
      label: "Барлық іс-шаралар",
      icon: <BiClipboard size={20} />,
      to: "/user",
    },
    {
      id: "subscribed",
      label: "Жазылғандар",
      icon: <BiBell size={20} />,
      to: "/user/subscribed",
    },
    {
      id: "favourite",
      label: "Таңдаулылар",
      icon: <BiHeart size={20} />,
      to: "/user/favourite",
    },
    {
      id: "calendar",
      label: "Менің күнтізбем",
      icon: <BiSolidCalendar size={20} />,
      to: "/user/calendar",
    }    

    
  ];

  // Logout tab (separate from the main tabs)
  const logoutTab = {
    id: "logOut",
    label: "Logout",
    icon: <BiLogOut size={20} />,
    action: handleLogout,
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

  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // refreshToken
    const expTime = getTokenExpiration(token);

    if (!expTime) {
      setRemainingTime(null);
      return;
    }

    // Обновляем время каждую секунду
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = expTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setRemainingTime(0);
      } else {
        setRemainingTime(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Форматируем время (мм:сс)
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  const displayTime = `${minutes}  : ${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`admin-container ${isMobile && menuOpen ? "menu-open" : ""}`}
    >
      {/* Mobile menu button */}
      {isMobile && (
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <BiMenu size={24} />
        </button>
      )}


      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobile && !menuOpen ? "hidden" : ""}`}>
        <div className="sidebar-logo">
          <img src={iconEventManagement} alt="Logo" />
        </div>
        {/* <div className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (isMobile) setMenuOpen(false);
              }}
            >
              <div className="nav-icon">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div> */}
         <div className="sidebar-nav">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.to} // Ссылка билан ўтиш
              className={`nav-item  link-underline link-underline-opacity-0 ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                if (isMobile) setMenuOpen(false);
              }}
            >
              <div className="nav-icon">{tab.icon}</div>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>

        {/* Logout Tab (Separate Section) */}
        <div className="sidebar-logout mx-3 mb-2">
          <button className="nav-item logout-item" onClick={logoutTab.action}>
            <div className="nav-icon">{logoutTab.icon}</div>
            <span>{logoutTab.label}</span>
          </button>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="admin-content">
        <div className="row">
          <div className="col-12 bg-white  py-1 d-flex justify-content-end align-items-center ">
            <div className="row me-1 d-flex justify-content-center align-items-center">
              <div className="col-12">
                <strong
                  className={`badge ${
                    remainingTime <= 60000 ? "bg-danger" : "bg-info"
                  }`}
                >
                  {displayTime}
                </strong>
              </div>
            </div>
            <div className="row  me-0">
              <div className="col-12 ">
                <i
                  class={`bi  bi-person-circle fs-3  ${
                    currentUser && currentUser.role === "admin"
                      ? "text-warning"
                      : ""
                  }  ${
                    currentUser && currentUser.role === "manager"
                      ? "text-info"
                      : " text-primary"
                  }`}
                ></i>
              </div>
            </div>
            <div className="row p-0 m-0 ">
              <div className="col-12 p-0 m-0 fw-medium fs-8">
                {currentUser ? currentUser.id : "Loading..."}
              </div>
              <div className="col-12 p-0 m-0 fw-lighter fs-8">
                {currentUser ? currentUser.role : "Loading..."}
              </div>
            </div>
          </div>
        </div>
        {tabs.find((tab) => tab.id === activeTab)?.content}
        <Outlet />
      </div>

      {/* Modal for Logout Confirmation */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modall">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes
              </button>
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
