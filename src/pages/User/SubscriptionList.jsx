import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import Top from "../Dashboard/Top";
import { auth, publicApi } from '../../apiCall';

const SubscriptionList = () => {
  const [subList, setSubList] = useState([{email: 'olao@gmail.com', createdAt: '2024-12-07'}, {email: 'olaomi@gmail.com', createdAt: '2024-12-07'}]);

  const subListWithSerial = subList && subList.length > 0 
  ? subList.map((list, index) => {
      return { ...list, id: index + 1 };
    }) 
  : [];

  const [loading, setLoading] = useState(false); 


  useEffect(() => {
    if (subList.length > 0) return;
    const fetchSub = async () => {
      const { data } = publicApi.get('/');
      setSubList(data)
    }

    fetchSub();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true)
    const { data } = await auth.delete(`okay/${id}`)
    setSubList(data);
    setLoading(false)
  };

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "email",
      headerName: "Email Address",
      width: 500,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.email}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser capitalize">
            {params.row?.createdAt}
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
            <button
              type="button"
              className="userListDelete bg-ek-gray px-2 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded"
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
    <motion.section
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full overflow-auto"
    >
      <Top title="Lead" text="Collecting and Analyzing Leads" />
      <section className="">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Subscription List</span>
          </motion.article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          {!loading ? (
            <DataGrid
              rows={subListWithSerial}
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

export default SubscriptionList;
