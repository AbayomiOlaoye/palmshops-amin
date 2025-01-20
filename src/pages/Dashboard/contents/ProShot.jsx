import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import  { fetchProductions, fetchProducts } from '../../../redux/reducer/productionAction';

const Records = () => {
  const { employees } = useSelector((state) => state.employee);
  const { products, productions } = useSelector((state) => state?.production);

  const ReqWithSerial = Array.isArray(productions)
    ? productions
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((item, index) => ({
        ...item,
        id: index + 1,
      }))
  : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductions());
    dispatch(fetchProducts());
  }, [dispatch]);

  const getDate = (order) => {
    const date = new Date(order);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const rice = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            <span>{getDate(params.row?.createdAt)}</span>
          </div>
        );
      }
    },
    {
      field: "productionType",
      headerName: "Type",
      width: 80,
      renderCell: (params) => {
        const pro = products.find((emp) => emp._id === params.row?.productionType);
        return (
          <div className=''>
            <span>{pro?.product} {params.row?.process}</span>
          </div>
        );
      }
    },
    {
      field: "confirmedBy",
      headerName: "Inspector",
      width: 150,
      renderCell: (params) => {
        const inspector = employees.find((emp) => emp._id === params.row?.confirmedBy);
        return (
          <div className=''>
            <span>{`${inspector?.firstName} ${inspector?.lastName}`}</span>
          </div>
        );
      }
    },
    {
      field: "quantity",
      headerName: "Output",
      width: 100,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{params.row?.quantity} {params.row?.unit}</span>
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
      className="max-w-full h-[350px]"
    >  
      <h1 className="text-2xl font-semibold">Production</h1>
      <DataGrid
        rows={ReqWithSerial}
        columns={rice}
        pageSize={10}
        rowHeight={38}
      />
    </motion.div>
  )
}

export default Records;