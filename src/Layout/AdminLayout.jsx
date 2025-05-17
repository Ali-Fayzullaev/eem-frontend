//AdminDashboard.jsx;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTokenExpiration } from "../utils/jwt";
import { authService } from "../api/authService";
import {
  BiUser,
  BiPlus,
  BiMenu,
  BiCog,
  BiLogOut,
  BiHeart,
  BiBell,
  BiSolidCalendar,
  BiBarChartAlt2,
  BiClipboard,
  BiGroup

  
} from "react-icons/bi";
import { FaUsers } from "react-icons/fa"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import iconEventManagement from "../assets/iconEvent.png";

function AdminDashboard() {
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

  const tabs = [
    {
      id: "statistics",
      label: "Dashboard",
      icon: <BiBarChartAlt2 size={20} />,
      to: "/admin",
    },
    {
      id: "allEvents",
      label: "Барлық іс-шаралар",
      icon: <BiClipboard size={20} />,
      to: "/admin/events",
    },
    ...(currentUser?.role === "admin"
      ? [
          {
            id: "users",
            label: "Пайдаланушылар",
            icon: <BiUser size={20} />,
            to: "/admin/users",
          },
        ]
      : []),
      ...(currentUser?.role === "admin"
        ? [
            {
              id: "eventParticipants",
              label: "Іс-шараға тіркелгендер",
              icon: <FaUsers size={20} />,
              to: "/admin/eventsParticipants",
            },
          ]
        : []),
    {
      id: "create",
      label: "Жаңа жасау",
      icon: <BiPlus size={20} />,
      to: "/admin/create",
    },
    {
      id: "changes",
      label: "Іс-шара параметрлері",
      icon: <BiCog size={20} />,
      to: "/admin/changes",
    },
    {
      id: "subscribed",
      label: "Жазылғандар",
      icon: <BiBell size={20} />,
      to: "/admin/subscribed",
    },
    {
      id: "favourite",
      label: "Таңдаулылар",
      icon: <BiHeart size={20} />,
      to: "/admin/favourite",
    },
    {
      id: "calendar",
      label: "Менің күнтізбем",
      icon: <BiSolidCalendar size={20} />,
      to: "/admin/calendar",
    },
  ];
  
  // Шығу бөлімі (негізгі бөлімнен бөлек)
  const logoutTab = {
    id: "logOut",
    label: "Шығу",
    icon: <BiLogOut size={20} />,
    action: handleLogout,
  };

  // Форматируем время (мм:сс)
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  const displayTime = `${minutes}  : ${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`admin-container ${isMobile && menuOpen ? "menu-open" : ""}`}
    >
      {/* Мобильдік мәзір түймесі */}
      {isMobile && (
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <BiMenu size={24} />
        </button>
      )}

      {/* Бүйірлік мәзір */}
      <div className={`admin-sidebar ${isMobile && !menuOpen ? "hidden" : ""}`}>
        <div className="sidebar-logo">
          <img src={iconEventManagement} alt="Logo" />
        </div>
        <div className="sidebar-nav">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.to} // Сілтеме арқылы өту
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

        {/* Шығу бөлімі (Бөлек секция) */}
        <div className="sidebar-logout mx-3 mb-2">
          <button className="nav-item logout-item" onClick={logoutTab.action}>
            <div className="nav-icon">{logoutTab.icon}</div>
            <span>{logoutTab.label}</span>
          </button>
        </div>
      </div>

      {/* Негізгі мазмұн */}
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
                  className={`bi  bi-person-circle fs-3  ${
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
                {currentUser ? currentUser.id : "Жүктелуде..."}
              </div>
              <div className="col-12 p-0 m-0 fw-lighter fs-8">
                {currentUser ? currentUser.role : "Жүктелуде..."}
              </div>
            </div>
          </div>
        </div>
        {tabs.find((tab) => tab.id === activeTab)?.content}
        <Outlet />
      </div>

      {/* Шығуға растау терезесі */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modall">
            <h3>Шынымен шығғыңыз келе ме?</h3>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmLogout}>
                Иә
              </button>
              <button className="btn-cancel" onClick={cancelLogout}>
                Болдырмау
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
