import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import Top from "../../Dashboard/Top";
import { auth } from '../../../apiCall';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const ordersWithSerial = orders && orders?.length > 0 
  ? orders.map((order, index) => {
      return { ...order, id: index + 1 };
    }) 
  : [];

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await auth.get('/orders');
      const sortData = data.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
      setOrders(sortData);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const getDate = (date) => {
    return new Date(date).toDateString();
  }

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {getDate(params.row?.createdAt)}
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Buyer's Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.user?.name}
          </div>
        );
      },
    },
    {
      field: "orderNumber",
      headerName: "Order Number",
      width: 100,
    },
    {
      field: "payment",
      headerName: "Method",
      width: 100,
    },
    {
      field: "status",
      headerName: "Pay Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row?.status === 'pending' && <span className='capitalize bg-slate-600 rounded text-white p-2 py-1'>Pending</span>}
            {params.row?.status === 'paid' && <span className='capitalize bg-green-700 text-white p-2 rounded py-1'>Paid</span>}
            {params.row?.status === 'cancelled' && <span className='capitalize bg-ek-red rounded text-white p-2 py-1'>Cancelled</span>}
          </div>
        );
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row?.deliveryStatus === 'processing' && <span className='capitalize bg-slate-500 rounded text-white p-2 py-1'>Processing</span>}
            {params.row?.deliveryStatus === 'shipped' && <span className='capitalize bg-green-200 text-ek-nav p-2 rounded py-1'>Shipped</span>}
            {params.row?.deliveryStatus === 'delivered' && <span className='capitalize bg-green-700 text-white p-2 rounded py-1'>Delivered</span>}
            {params.row?.deliveryStatus === 'cancelled' && <span className='capitalize bg-ek-red rounded text-white p-2 py-1'>Cancelled</span>}
          </div>
        );
      },
    },
    {
      field: "totalAmount",
      headerName: "Total Order (₦)",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.totalAmount.toLocaleString()}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center h-30'>
            <Link to={"/products/orders/" + params.row?._id} className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
              <button className="userListEdit">Edit</button>
            </Link>
          </div>
        );
      },
    },
  ];

  const handleGoBack = () => {
    window.history.back();
  }

  return (
    <motion.section
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full overflow-auto"
    >
      <Top title="Palm Store" text="Managing and Monitoring Sales" />
      <section className="">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Orders Management</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/products/requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Manage Requests</Link>
            <Link to="/products/sales-lease-requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Sell/Lease Orders</Link>
            <Link to="/products/new" className="border-2 rounded-lg px-3 py-2 focus:bg-ek-light focus:text-ek-nav hover:bg-ek-green hover:text-ek-white">New Product</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          {!loading ? (
            <DataGrid
              rows={ordersWithSerial}
              columns={columns}
              pageSize={10}
              rowHeight={38}
            />
          ) : (<p>Loading data...</p>)}
        </article>
      </section>
    </motion.section>
  )
}

export default Orders;
