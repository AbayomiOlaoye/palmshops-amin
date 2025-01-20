import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { fetchInventories, getWareHouseBalances } from '../../../redux/reducer/inventoryAction';
// import { auth } from '../../apiCall';

const Overview = () => {
  const { inventories } = useSelector((state) => state?.inventory);
  const [stocks] = useState(inventories || []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(getWareHouseBalances());
  }, [dispatch]);

  const ReqWithSerial =
  stocks && stocks.length > 0
    ? stocks
        .flatMap((staff) =>
          staff?.locations.map((rec, index) => ({
            ...staff,
            date: rec?.transactions[index]?.date,
            description: rec?.transactions[index]?.description,
            type: rec?.transactions[index]?.type,
            quantity: rec?.transactions[index]?.quantity,
            rate: rec?.transactions[index]?.rate,
            warehouse: rec?.warehouseId?.name,
            createdAt: rec?.transactions[index]?.createdAt || staff?.createdAt,
          }))
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((item, index) => ({
          ...item,
          id: index + 1,
        }))
    : [];

  const getDate = (order) => {
    const date = new Date(order);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
            <span>{getDate(params.row?.date)}</span>
          </div>
        );
      }
    },
    {
      field: "itemName",
      headerName: "Item",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <span className='capitalize'>{params.row?.itemName}</span>
          </div>
        );
      }
    },
    {
      field: "description",
      headerName: "Summary",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.description}
            </span>
          </div>
        );
      }
    },
    {
      field: "warehouse",
      headerName: "Warehouse",
      width: 150,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center h-30'>
            <span className='capitalize'>{params.row?.warehouse || 'N/A'}</span>
          </div>
        );
      }
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 80,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center h-30'>
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
      <h2 className="text-2xl font-semibold">Stock Movement</h2>
      <DataGrid
        rows={ReqWithSerial}
        columns={columns}
        pageSize={10}
        rowHeight={38}
      />
    </motion.div>
  )
}

export default Overview;
