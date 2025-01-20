import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { useFormik } from 'formik';
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import Top from "../Dashboard/Top";
import {
  deletePayroll,
  fetchPayrolls,
  // fetchMonthlyPayrolls,
} from '../../redux/reducer/payrollAction';

const Payroll = () => {
  const { payrolls } = useSelector((state) => state.payroll);
  const userRole = useSelector((state) => state.auth.user.role)
  const payrollWithSerial = payrolls && payrolls.length > 0 
  ? payrolls.map((payroll, index) => {
      return { ...payroll, id: index + 1 };
    }) 
  : [];

  const [allPayroll, setPayroll] = useState(payrollWithSerial || []);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPayrolls());
  }, [dispatch]);

  const handleDelete = (id) => {
    const remove = payrollWithSerial.filter((pay) => pay.id === id);
    console.log(remove[0]._id);
    dispatch(deletePayroll(remove[0]._id));
    setPayroll(payrollWithSerial.filter((item) => item.id !== id));
  };
  
  const formik = useFormik({
    initialValues: {
      monthAndYear: '',
    },
  
    onSubmit: async (values) => {
      setLoading(true);
      const [year, month] = values.monthAndYear.split('-');
      const searchQuery = [year, month];
      const filteredProducts = allPayroll.filter((pay) => pay.month.toLowerCase().includes(searchQuery.toLowerCase()));
      console.log(filteredProducts);
      setLoading(false);
    }
  });

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "staffName",
      headerName: "Staff Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.staff?.firstName} {params.row?.staff?.lastName}
          </div>
        );
      },
    },
    {
      field: "jobTitle",
      headerName: "Job Title",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.staff?.jobTitle}
          </div>
        );
      },
    },
    {
      field: "salary",
      headerName: "Basic Salary (₦)",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.staff?.salary.toLocaleString()}
          </div>
        );
      },
    },
    {
      field: "allowance",
      headerName: "Allowances (₦)",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.allowances.toLocaleString()}
          </div>
        );
      },
    },
    {
      field: "deduction",
      headerName: "Deductions (₦)",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.deductions.toLocaleString()}
          </div>
        );
      },
    },
    {
      field: "netSalary",
      headerName: "Net Salary (₦)",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.netSalary.toLocaleString()}
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
            {userRole === 'admin' ? (
              <>
                <Link to={"/hr/payroll/edit/" + params.row._id} className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
                  <button className="userListEdit">Edit</button>
                </Link>
                <button
                  type="button"
                  className="userListDelete bg-ek-gray px-2 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded"
                  onClick={() => handleDelete(params.row.id)}
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="userListDelete bg-ek-gray px-2 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded"
              >
                No Access
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
            <span className="font-medium">Overview of Staff Payroll</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <form className="flex items-center relative gap-1 mr-4" onSubmit={formik.handleSubmit}>
              {!formik.values.monthAndYear && <span className="absolute left-3 bg-white w-fit pl-6">Select Month</span>}
              <input type="month"
                className="border-2 rounded-lg px-3 py-2"
                name="monthAndYear"
                value={formik.values.monthAndYear}
                required
                onChange={formik.handleChange}
              />
              <button title="Click to pull results" type="submit" className="bg-ek-green p-3"><MdArrowForward className="cursor-pointer" /></button>
            </form>
            <Link to="/hr/payroll/generate" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">Create Salary Record</Link>
            <Link to="/hr/staff/new" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">Add New Staff</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          {!loading ? (
            <DataGrid
              rows={allPayroll}
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

export default Payroll;
