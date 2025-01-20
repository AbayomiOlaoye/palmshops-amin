import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import { toast } from 'react-toastify';
import Top from "../Dashboard/Top";
import { auth } from '../../apiCall';

const Customers = () => {
  const { employees } = useSelector((state) => state.employee);
  const userRole = useSelector((state) => state.auth.user.role);

  const [isCustomerData, setIsCustomerData] = useState([]);

  const customersWithSerial = isCustomerData && isCustomerData .length > 0 
  ? isCustomerData.map((staff, index) => {
    return { ...staff, id: index + 1 };
  })
  : [];

  const handleDelete = (id) => {
    auth.delete(`/customers/${id}`);
    setIsCustomerData(isCustomerData.filter((item) => item._id !== id));
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await auth.get('/customers/all');
        setIsCustomerData(data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message || 'Failed to fetch customers');
      }
    }
    fetchCustomers();
  }, []);

  const columns = [
    {field: "id", headerName: "S/N", width: 50},
    {
      field: "name",
      headerName: "Customer Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row?.name}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 120, height: 30, },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 120,
    },
    {
      field: "address",
      headerName: "Contact Address",
      width: 120,
    },
    { field: "businessName", headerName: "Business Name", width: 200 },
    {
      field: "createdBy",
      headerName: "Officer",
      width: 150,
      renderCell: (params) => {
        const officer = employees.find((employee) => employee._id === params.row?.createdBy);
        return (
          <div>
            <span>{officer.firstName} {officer?.lastName}</span>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center h-30'>
            <Link to={"/customers/edit/" + params.row?._id} className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
              <button className="userListEdit">Edit</button>
            </Link>
            {userRole === 'admin' && (
              <button
                type="button"
                className="userListDelete bg-ek-gray px-2 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded"
                onClick={() => handleDelete(params.row?._id)}
              >
                Delete
            </button>
            )}
          </div>
        );
      },
    },
  ];
  
  const handleGoBack = () => {
    window.history.back();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full"
    >
      <Top title="Customers" text="Manage Customers' Information" />
      <section className="">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Basic Customers&lsquo; Information</span>
          </motion.article>
          <article className="other-actions flex gap-3">
         
          <Link to="/customers/new" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">New Customer</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
        <DataGrid
          rows={customersWithSerial}
          columns={columns}
          pageSize={10}
          rowHeight={38}
        />
        </article>
      </section>
    </motion.div>
  )
}

export default Customers;
