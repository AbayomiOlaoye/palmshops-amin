import { Outlet, NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdPeopleAlt,
  MdLocalGroceryStore,
  // MdNotificationAdd,
  // MdVideoCameraFront,
  // MdAnalytics,
  // MdAdminPanelSettings,
} from "react-icons/md";
import { FaIndustry } from "react-icons/fa";
import { FaMoneyBills, FaRectangleList } from "react-icons/fa6";
// import { RiFolderReceivedFill } from "react-icons/ri";
import { GiBuyCard } from "react-icons/gi";
import logo from '../assets/logo_im.svg';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <MdDashboard className="" /> },
  { to: '/courses', label: 'Palm School', icon: <MdPeopleAlt className="" /> },
  { to: '/track', label: 'Palm Track', icon: <FaIndustry className="" /> },
  { to: '/products', label: 'Palm Store', icon: <FaMoneyBills className="" /> },
  { to: '/palm-vest', label: 'Palm Vest', icon: <FaRectangleList className="" /> },
  { to: '/users', label: 'User Mgt', icon: <MdLocalGroceryStore className="" /> },
  { to: '/feedback', label: 'Feedback', icon: <GiBuyCard className="" /> },
];

const AdminLayout = () => (
  <div className="admin-layout flex min-h-screen bg-ek-back max-w-[100vw] gap-5">
    <aside className="sidebar fixed z-[500] top-0 left-0 h-full bg-ek-light py-[100px] min-w-[14vw] flex flex-col">
      <img src={logo} alt="Palmshops Logo" className="logo max-w-[80%] self-center mb-6" />
      <nav className="nav mt-5 flex flex-col gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="nav-link h-[40px] flex gap-2 text-ek-nav transition-all"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`bar-nav w-2 rounded-r-md h-full transition-all ${
                    isActive ? 'bg-ek-green' : ''
                  }`}
                />
                <div
                  className={`w-full h-full p-2 flex pl-2 items-center gap-1 text-ek-nav transition-all hover:bg-ek-white ${
                    isActive ? 'bg-ek-white' : ''
                  }`}
                >
                  <span className={`${isActive ? 'text-ek-green' : ''}`}>
                    {link.icon}
                  </span>
                  <span className="label">{link.label}</span>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>

    <main className="main-content ml-[14vw] bg-[#F2F9F1] px-10 pt-10 w-full">
      <Outlet />
      <footer className="footer py-4 flex justify-center items-center gap-2">
        <span className="text-ek-deep">{`© ${new Date().getFullYear()} Palmshops.`}</span>
        <span className="text-ek-deep">All Rights Reserved</span>
      </footer>
    </main>
  </div>
);

export default AdminLayout;
