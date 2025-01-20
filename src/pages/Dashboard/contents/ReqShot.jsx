import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { fetchRequisitions } from '../../../redux/reducer/requisitionAction';

const ReqList = () => {
  const { requisitions } = useSelector((state) => state.requisition);
  const sortReq = requisitions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const ReqWithSerial = requisitions && requisitions .length > 0 
  ? sortReq.map((staff, index) => {
    return { ...staff, id: index + 1 };
  })
  : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequisitions());
  }, [dispatch]);

  const getDate = (order) => {
    const date = new Date(order);
    return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
  };

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            <span>{getDate(params.row.createdAt)}</span>
          </div>
        );
      }
    },
    {
      field: "requestId",
      headerName: "Request ID",
      width: 100,
    },
    {
      field: "amountRequested",
      headerName: "Amount Requested (₦)",
      width: 150,
      renderCell: (params) => {
        const totalCost = params.row?.items?.reduce((sum, item) => {
          return sum + item.quantity * item.rate;
        }, 0);
        return (
          <div className='flex gap-4 items-center h-30'>
            <span>{totalCost.toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <span
              className={`${params.row?.status === 'pending' && 'bg-ek-gray'} ${params.row?.status=== 'approved' && 'bg-ek-green text-ek-deep'} ${params.row?.status === 'rejected' && 'bg-red-500 text-white'} text-white h-[18px] mt-2 transition-all w-fit p-2 flex items-center rounded-3xl`}
            >
              {params.row?.status}
            </span>
          </div>
        );
      }
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full h-[300px]"
    >
      <h1 className="text-2xl font-semibold text-ek-dark">Requisitions</h1>
      <DataGrid
        rows={ReqWithSerial}
        columns={columns}
        pageSize={10}
        rowHeight={38}
      />
    </motion.div>
  )
}

export default ReqList;
