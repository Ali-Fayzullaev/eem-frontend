import { useState, useEffect } from 'react';
import HomeAdmin from '../pages/HomeAdmin';
import SettingsUser from '../pages/SettingsUser';
import CreateEventAdmin from '../pages/CreateEventAdmin';
import ChangesDataAdmin from '../pages/ChangesDataAdmin';
import { BiHome, BiUser, 	BiPlus, BiMenu, BiCog } from 'react-icons/bi';
import { Outlet } from 'react-router-dom';
// import { CiCirclePlus } from "react-icons/ci";



function AdminLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const tabs = [
    { id: 'home', label: 'All Events', icon: <BiHome size={20} />, content: <HomeAdmin /> },
    { id: 'users', label: 'Users', icon: <BiUser size={20} />, content: <SettingsUser /> },
    { id: 'create', label: 'Create', icon: <BiPlus size={20} />, content: <CreateEventAdmin /> },
    { id: 'changes', label: 'Event Settings', icon: <BiCog size={20} />, content: <ChangesDataAdmin /> }
  ];

  return (
    <div className={`admin-container ${isMobile && menuOpen ? 'menu-open' : ''}`}>
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
        >
          <BiMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobile && !menuOpen ? 'hidden' : ''}`}>
        <div className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (isMobile) setMenuOpen(false); 
              }}
            >
              <div className="nav-icon">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="admin-content">
        {tabs.find(tab => tab.id === activeTab)?.content}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;