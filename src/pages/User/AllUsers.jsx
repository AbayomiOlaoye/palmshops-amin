import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import Top from "../Dashboard/Top";
// import { auth } from '../../apiCall';
import { deleteUser } from '../../redux/reducer/authActions';
import { fetchUsers } from '../../redux/reducer/authActions';

const AllStaff = () => {
  const { users } = useSelector((state) => state.auth);
  const userWithSerial = users && users.length > 0 
  ? users.map((staff, index) => {
    return { ...staff, id: index + 1 };
  })
  : [];

  const [userData, setUserData] = useState(userWithSerial);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    setUserData(userData.filter((item) => item._id !== id));
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = [
    {field: "id", headerName: "S/N", width: 50},
    {
      field: "name",
      headerName: "Name",
      width: 300,
    },
    {
      field: "isVerified",
      headerName: "Verification Status",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser flex items-center h-30">
            <span className={`h-[28px] items-center flex rounded px-2 mt-1 self-center ${params.row?.isVerified ? 'bg-ek-light text-ek-black' : 'bg-red-700 text-ek-white'}`}>
              <p>{params.row?.isVerified ? 'Verified' : 'Unverified'}</p>
            </span>
          </div>
        );
      },
    },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center h-30'>
            <Link to={"/users/" + params.row?._id} className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
              <button className="userListEdit mt-1">Edit</button>
            </Link>
              <button
                type="button"
                className="userListDelete bg-ek-gray px-2 mt-1 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded"
                onClick={() => handleDelete(params.row?._id)}
              >
                Delete
            </button>
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
      <Top title="Users" text="Manage Users' Information" />
      <section className="">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">All Users</span>
          </motion.article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
        <DataGrid
          rows={userData}
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
