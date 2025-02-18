import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import Top from "../../Dashboard/Top";
import { auth } from '../../../apiCall';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [status, setStatus] = useState('pending');
  const requestsWithSerial = requests && requests?.length > 0 
  ? requests.map((req, index) => {
      return { ...req, id: index + 1 };
    }) 
  : [];

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchReqs = async () => {
      const { data } = await auth.get('/request/all/admin');
      const sortData = data?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
      setRequests(sortData);
      setLoading(false);
    }
    fetchReqs();
  }, []);

  const getDate = (date) => {
    return new Date(date).toDateString();
  }

  const openModal = (id) => {
    setSelectedRequestId(id);
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };


  const handleUpdate = async () => {
    try {
      await auth.put(`/request/update/${selectedRequestId}`, { status: status });

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === selectedRequestId ? { ...req, status: status } : req
        )
      );

      closeModal();

    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

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
      field: "requester",
      headerName: "Buyer's Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.requester?.name}
          </div>
        );
      },
    },
    {
      field: "product",
      headerName: "Product Name",
      width: 150,
    },
    {
      field: "description",
      headerName: "Description",
      width: 180,
    },
    {field: "phone", headerName: "Phone", width: 150},
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row?.status === 'pending' && <span className='capitalize bg-slate-600 rounded text-white p-2 py-1'>Pending</span>}
            {params.row?.status === 'approved' && <span className='capitalize bg-green-700 text-white p-2 rounded py-1'>Approved</span>}
            {params.row?.status === 'rejected' && <span className='capitalize bg-ek-red rounded text-white p-2 py-1'>Rejected</span>}
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
              <button type="button" onClick={() => openModal(params.row?._id)} className="bg-ek-green text-white px-2 py-1 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">Edit</button>
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
      <Top title="HR" text="Manage Staff Information" />
      <section className="">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">All Requests</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/products/orders" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Manage Orders</Link>
            <Link to="/products/sales-lease-requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Sell/Lease Orders</Link>
            <Link to="/products/new" className="border-2 rounded-lg px-3 py-2 focus:bg-ek-light focus:text-ek-nav hover:bg-ek-green hover:text-ek-white">New Product</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          {!loading ? (
            <DataGrid
              rows={requestsWithSerial}
              columns={columns}
              pageSize={10}
              rowHeight={38}
            />
          ) : (<p>Loading data...</p>)}
        </article>
      </section>
      {
        open && (
          <motion.section
        initial={{ x: '100vw' }}
        animate={{ x: open ? 0 : '100vw' }}
        transition={{ type: 'spring', stiffness: 60 }}
        className="fixed top-0 right-0 h-full bg-white w-30vw z-50 p-20"
      >
        <select
          name="status"
          className="border-2 border-ek-light rounded-lg w-full p-2"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex gap-2 justify-between mt-4">
          <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 transition-all">Cancel</button>
          <button type="button" onClick={handleUpdate} className="bg-ek-green text-white px-3 py-2 rounded hover:bg-opacity-75 transition-all">Update</button>
        </div>
      </motion.section> 
      )}
    </motion.section>
  )
}

export default Requests;
