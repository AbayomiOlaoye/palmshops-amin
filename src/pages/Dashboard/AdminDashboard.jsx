import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdPeopleAlt, MdLocalGroceryStore } from 'react-icons/md';
import { FaMoneyBills, FaRectangleList } from 'react-icons/fa6';
import Top from '../Dashboard/Top';
// import { getUsers } from '../../redux/reducer/authActions';
import { auth } from '../../apiCall';
// import Records from './contents/ProShot';
// import Overview from './contents/StockShot';
// import Inventory from './contents/InvenShot';
// import Sales from './contents/SalesShot';

const AdminDashboard = () => {
  // const dispatch = useDispatch();
  // const { employees } = useSelector((state) => state.employee);
  // const { purchases } = useSelector((state) => state.purchases);
  // const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  // const { name } = useSelector((state) => state.auth.user);
  // const { requisitions } = useSelector((state) => state.requisition);
  
  // const pendingReq = requisitions.find((req) => req.status === 'pending');
  
  // const today = new Date();
  // const sevenDaysAgo = new Date();
  // sevenDaysAgo.setDate(today.getDate() - 7);

  // const weeklyPurchases = purchases?.filter(purchase => {
  //     const purchaseDate = new Date(purchase.purchaseDate);
  //     return purchaseDate >= sevenDaysAgo && purchaseDate <= today;
  // });

  // const cumulativeTotal = weeklyPurchases.reduce((total, purchase) => total + purchase.totalCost, 0);

  // useEffect(() => {
  //   dispatch(getEmployees());
  // }, [dispatch]);

  // useEffect(() => {
  //   const fetchWeeklyRevenue = async () => {
  //     try {
  //       const { data } = await auth.get('/sales/weekly-revenue');
  //       setWeeklyRevenue(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchWeeklyRevenue();
  // }, []);

  // // Show today's date
  // const todayDate = () => {
  //   const date = new Date();
  //   return date.toDateString();
  // }

  return (
    <motion.div
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
    Welcome to the admin dashboard
    </motion.div>
  )
}

export default AdminDashboard;
{/* <p className="text-gray-500 text-center mt-3 p-5">Today is {todayDate()}</p>
      <Top title={`Good morning, ${name}! 👋`} text="Welcome to the admin dashboard" />
      <section className="">
        <div className="action-nav flex justify-around items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 bg-white p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col gap-2 p-3">
              <h2 className="text-3xl font-extrabold">{employees?.length}</h2>
              <span className="text-gray-500">Total Employees</span>
            </div>
            <div className="flex flex-col bg-[#B3E870] rounded-full p-3 gap-2">
              <MdPeopleAlt className="text-ek-gray" />
            </div>
          </motion.article>
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 bg-white p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col gap-2 p-3">
              <h2 className="text-3xl font-extrabold">{`₦${weeklyRevenue?.totalRevenue?.toLocaleString()}`}</h2>
              <span className="text-gray-500">Total Daily Revenue</span>
            </div>
            <div className="flex flex-col bg-[#B3E870] rounded-full p-3 gap-2">
              <FaMoneyBills className="text-ek-gray" />
            </div>
          </motion.article>
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 bg-white p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col gap-2 p-3">
              <h2 className="text-3xl font-extrabold">{`₦${cumulativeTotal?.toLocaleString()}`}</h2>
              <span className="text-gray-500">Total Weekly Purchases</span>
            </div>
            <div className="flex flex-col bg-[#B3E870] rounded-full p-3 gap-2">
              <MdLocalGroceryStore className="text-ek-gray" />
            </div>
          </motion.article>
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 bg-white p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col gap-2 p-3">
              <h2 className="text-3xl font-extrabold">{pendingReq?.length || 0}</h2>
              <span className="text-gray-500">Pending Requisitions</span>
            </div>
            <div className="flex flex-col bg-[#B3E870] rounded-full p-3 gap-2">
              <FaRectangleList className="text-ek-gray" />
            </div>
          </motion.article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl grid grid-cols-2 gap-6 shadow-lg bg-white py-10 p-8">
          <Records />
          <Overview />
          <Sales />
          <Inventory />
        </article>
      </section> */}
