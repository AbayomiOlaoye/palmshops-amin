import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import { getEmployees } from "../../redux/reducer/employeeAction";
import Top from "../Dashboard/Top";
// import { auth } from '../../apiCall';
import { deleteEmployee } from '../../redux/reducer/employeeAction';
import { fetchPayrolls } from '../../redux/reducer/payrollAction';

const AllStaff = () => {
  const { employees } = useSelector((state) => state.employee);
  const userRole = useSelector((state) => state.auth.user.role);
  const staffWithSerial = employees && employees .length > 0 
  ? employees.map((staff, index) => {
    return { ...staff, id: index + 1 };
  })
  : [];


  const [isEmployeeData, setIsEmployeeData] = useState(staffWithSerial);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
    setIsEmployeeData(isEmployeeData.filter((item) => item.employeeId !== id));
  };

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(fetchPayrolls());
  }, [dispatch]);

  const columns = [
    {field: "id", headerName: "S/N", width: 50},
    {
      field: "name",
      headerName: "Staff Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser flex items-center gap-2">
            {params.row?.image && <img className="userListImg rounded-full h-8 w-8" src={params.row?.image} alt="staff headshot" />}
            {params.row.firstName} {params.row.lastName}
          </div>
        );
      },
    },
    { field: "employeeId", headerName: "Staff ID", width: 90, height: 30, },
    {
      field: "jobTitle",
      headerName: "Job Title",
      width: 150,
    },
    {
      field: "department",
      headerName: "Department",
      width: 100,
    },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center h-30'>
            <Link to={"/hr/staff/edit/" + params.row.employeeId} className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
              <button className="userListEdit">Edit</button>
            </Link>
            {userRole === 'admin' && (
              <button
                type="button"
                className="userListDelete bg-ek-gray px-2 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded"
                onClick={() => handleDelete(params.row.employeeId)}
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
            <span className="font-medium">Basic Staff Information</span>
          </motion.article>
          <article className="other-actions flex gap-3">
          <Link to="/hr/payroll" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">Payroll</Link>
          <Link to="/hr/staff/new" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">Add New Staff</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
        <DataGrid
          rows={isEmployeeData}
          columns={columns}
          pageSize={10}
          rowHeight={38}
        />
        </article>
      </section>
    </motion.div>
  )
}

export default AllStaff;
