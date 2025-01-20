import { NavLink, Outlet } from 'react-router-dom';
import { FaIndustry } from "react-icons/fa";
import { FaMoneyBills, FaRectangleList } from "react-icons/fa6";
// import logo from '../assets/erd_logo.svg';

const navLinks = [
  { to: '/production/new', label: 'Production', icon: <FaIndustry className="" /> },
  { to: '/sales/new', label: 'Sales', icon: <FaMoneyBills className="" /> },
  { to: '/requisitions/new', label: 'Requisitions', icon: <FaRectangleList className="" /> },
];


const StaffLayout = () => (
  <div className="staff-layout flex flex-col gap-6 pt-10 min-h-screen bg-ek-back max-w-[100vw]">
    <nav className="nav flex gap-2 mx-auto self-center">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className="nav-link p-2 rounded-lg bg-ek-deep flex md:flex-col items-center gap-2 text-ek-nav transition-all hover:opacity-80"
        >
          <span className="text-ek-light text-2xl">
            {link.icon}
          </span>
          <span className="label text-white font-semibold">{link.label}</span>
        </NavLink>
      ))}
    </nav>
    <Outlet />
    <main className="main-content">
      <footer className="footer py-4 flex justify-center items-center gap-4">
        <span className="text-ek-deep">{`© ${new Date().getFullYear()} El-kanis Agro.`}</span>
        <span className="text-ek-deep">All Rights Reserved</span>
      </footer>
    </main>
  </div>
);

export default StaffLayout;
