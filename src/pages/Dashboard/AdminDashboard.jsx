import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdPeopleAlt } from 'react-icons/md';
import { FaMoneyBills, FaRectangleList } from 'react-icons/fa6';
import Top from '../Dashboard/Top';
import { fetchUsers } from '../../redux/reducer/authActions';
import { auth } from '../../apiCall';
import PalmOrders from './contents/ProShot';
import PalmTrack from './contents/InvenShot';
import PalmSchool from './contents/ReqShot';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);

  const API_ENDPOINTS = ['/trackcrop/all', '/trackfarm/all', '/trackequipment/all'];

    useEffect(() => {
      const fetchData = async () => {
        try {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const allData = [];

          for (const endpoint of API_ENDPOINTS) {
            const { data: endpointData } = await auth.get(endpoint);

            if (endpointData && Array.isArray(endpointData)) {
              const recentData = endpointData.filter(item => {
                const itemDate = new Date(item.createdAt);
                return itemDate >= thirtyDaysAgo;
              });
              allData.push(...recentData);
            }
          }

          setData(allData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await auth.get('/orders');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let revenue = 0;
        if (data && Array.isArray(data)) {
          data.forEach(order => {
            if (order.status === 'paid') {
              const orderDate = new Date(order.createdAt);
              if (orderDate >= thirtyDaysAgo) {
                revenue += order.totalAmount;
              }
            }
          });
        }

      setOrders(revenue);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
    fetchOrders();
  }, []);

  // Show today's date
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
      <p className="text-gray-500 text-center mt-3 p-5">Today is {todayDate()}</p>
      <Top title="Good day, 👋" text="Welcome to the admin dashboard" />
      <section className="">
        <div className="action-nav flex justify-around items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 bg-white p-3 rounded-lg shadow-lg"
          >
            <div className="flex flex-col gap-2 p-3">
              <h2 className="text-3xl font-extrabold">{users?.length}</h2>
              <span className="text-gray-500">Total Users</span>
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
              <h2 className="text-3xl font-extrabold">{`₦${orders.toLocaleString()}`}</h2>
              <span className="text-gray-500">Total Revenue (30 Days)</span>
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
              <h2 className="text-3xl font-extrabold">{data?.length || 0}</h2>
              <span className="text-gray-500">Total Request (30 Days)</span>
            </div>
            <div className="flex flex-col bg-[#B3E870] rounded-full p-3 gap-2">
              <FaRectangleList className="text-ek-gray" />
            </div>
          </motion.article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl grid grid-cols-2 gap-6 shadow-lg bg-white py-10 p-8">
          <PalmOrders />
          <PalmTrack />
          <PalmSchool />
        </article>
      </section>
    </motion.div>
  )
}

export default AdminDashboard;
