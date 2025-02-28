import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { auth } from '../../../apiCall';

const PalmOrders = () => {
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

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "orderNumber",
      headerName: "Order Number",
      width: 80,
    },
    {
      field: "status",
      headerName: "Pay Status",
      width: 100,
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
      field: "name",
      headerName: "Buyer's Name",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.user?.name}
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
  ];

  return (
    <motion.section
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full overflow-scroll h-[350px]"
    >
      <h2 className="text-2xl font-semibold text-ek-black mb-2">Palm Store (Orders)</h2>
      {!loading ? (
        <DataGrid
          rows={ordersWithSerial}
          columns={columns}
          pageSize={10}
          rowHeight={38}
        />
      ) : (<p>Loading data...</p>)}
    </motion.section>
  )
}

export default PalmOrders;