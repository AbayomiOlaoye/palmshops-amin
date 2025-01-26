import { useEffect, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import Top from "../Dashboard/Top";
import  { fetchAllHarvests, deleteHarvestStock } from '../../redux/reducer/harvestAction';
import { fetchAllFarmStock, deleteFarmStock } from '../../redux/reducer/farmAction';

const OverviewTrack = () => {
  const dispatch = useDispatch();
  const { harvested } = useSelector((state) => state?.harvest);
  const { farms } = useSelector((state) => state?.farm);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const inventories = [...farms, ...harvested];

  const ReqWithSerial = [...(inventories || [])]
    .sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
    .map((item, index) => ({
      ...item,
      id: index + 1,
      product: item?.cropPlanted || item?.productName,
      qty: item?.expectedYield || item?.availableQty,
      unit: item?.yieldUnit || item?.unit,
      type: item?.cropPlanted ? 'farm' : 'harvest',
  }));

  useEffect(() => {
    dispatch(fetchAllFarmStock());
    dispatch(fetchAllHarvests());
    setSelectedProduct(ReqWithSerial);
  }, [dispatch]);


  const filterTrack = (stock) => {
    if (stock === 'farm') {
      const farmTrack = ReqWithSerial.filter((prod) => prod?.type === 'farm');
      setSelectedProduct(farmTrack);
    } else {
      const harvestTrack = ReqWithSerial.filter((prod) => prod?.type === 'harvest');
      setSelectedProduct(harvestTrack);
    }
  };

  const handleDelete = (id, type) => {
    if (type === 'farm') {
      dispatch(deleteFarmStock(id));
    } else {
      dispatch(deleteHarvestStock(id));
    }
    setSelectedProduct(ReqWithSerial.filter((item) => item._id !== id));
  };

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
      field: "product",
      headerName: "Product",
      width: 120,
      renderCell: (params) => {
        return (
          <div className=''>
            <span className="capitalize">{params.row?.product}</span>
          </div>
        );
      }
    },
    {
      field: "name",
      headerName: "Farmer",
      width: 180,
      renderCell: (params) => {
        return (
          <div>
            <span className='capitalize'>
              {params.row?.userId.name}
            </span>
          </div>
        );
      }
    },
    {
      field: "lga",
      headerName: "LG Area",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            <span className='capitalize'>
              {params.row?.lga}
            </span>
          </div>
        );
      }
    },
    {
      field: "qty",
      headerName: "Quantity",
      width: 100,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{params.row?.qty.toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      field: "pricePerUnit",
      headerName: "Price/Unit",
      width: 100,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{`₦${params.row?.pricePerUnit.toLocaleString()}/${params.row?.unit}`}</span>
          </div>
        );
      }
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center justify-center h-30 pt-1'>
            <Link as={NavLink} to={`/track/view/${params.row?._id}`} className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
              <button className="userListEdit">View</button>
            </Link>
            <button 
              className="bg-ek-red text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded"
              onClick={() => handleDelete(params.row?._id, params.row?.type)}
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
      <Top title="Production" text="Manage and Monitor Production Details" />
      <section className="">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Overview</span>
          </motion.article>
          <article className="other-actions flex gap-2">
            <button
              onClick={() => setSelectedProduct(ReqWithSerial)}
              className="border-2 rounded-lg px-3 py-2 hover:bg-ek-light hover:text-ek-black focus:bg-ek-green focus:text-ek-white"
            >
              All Inventories
            </button>
            <button
              onClick={() => filterTrack('farm')}
              className="border-2 rounded-lg px-3 py-2 hover:bg-ek-light hover:text-ek-black focus:bg-ek-green focus:text-ek-white"
            >
              Farm Stocks
            </button>
            <button
              onClick={() => filterTrack('harvest')}
              className="border-2 rounded-lg px-3 py-2 hover:bg-ek-light hover:text-ek-black focus:bg-ek-green focus:text-ek-white"
            >
              Harvested Products
            </button>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <DataGrid
            rows={selectedProduct}
            columns={rice}
            pageSize={10}
            rowHeight={38}
          />
        </article>
      </section>
    </motion.div>
  )
}

export default OverviewTrack;
