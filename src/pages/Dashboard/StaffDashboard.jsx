import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Top from '../Dashboard/Top';
import { NavLink } from 'react-router-dom';
import { FaIndustry } from 'react-icons/fa';
import { FaMoneyBills, FaRectangleList } from 'react-icons/fa6';

const navLinks = [
  { to: '/production/new', label: 'Production', icon: <FaIndustry className="" /> },
  { to: '/sales/new', label: 'Sales', icon: <FaMoneyBills className="" /> },
  { to: '/requisitions/new', label: 'Requisitions', icon: <FaRectangleList className="" /> },
];

const StaffDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const todayDate = () => {
    const date = new Date();
    return date.toDateString();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
      <p className="text-gray-500 mt-3 p-5">Today is {todayDate()}</p>
      <Top title={`Good Day, ${user.name}! 👋`} text="How's work today?" />
      <section className="grid grid-cols-2 gap-2 col-gap-6 p-5 max-w-[500px] mx-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="nav-link p-5 rounded-lg bg-ek-deep flex flex-col items-center gap-2 text-ek-nav transition-all hover:opacity-80"
          >
            <span className="text-ek-light text-2xl">
              {link.icon}
            </span>
            <span className="label text-white font-semibold">{link.label}</span>
          </NavLink>
        ))}
      </section>
    </motion.div>
  )
}

export default StaffDashboard;
