import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import  { fetchAllHarvests } from '../../../redux/reducer/harvestAction';
import { fetchAllFarmStock } from '../../../redux/reducer/farmAction';

const PalmTrack = () => {
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
      totalAmount: (item?.expectedYield * item?.pricePerUnit) || (item?.availableQty * item?.pricePerUnit),
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

  const rice = [
    { field: "id", headerName: "S/N", width: 50 },
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
      field: "totalAmount",
      headerName: "Total",
      width: 150,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{`₦${params.row?.totalAmount.toLocaleString()}`}</span>
          </div>
        );
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full min-h-[350px] h-[350px] overflow-scroll"
    >
      <section className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold text-ek-black mb-2">Palm Track (Orders)</h2>
        <article className="other-actions flex gap-2 mb-3">
          <button
            onClick={() => setSelectedProduct(ReqWithSerial)}
            className="border-2 rounded-lg px-3 py-2 hover:bg-ek-light hover:text-ek-black focus:bg-ek-green focus:text-ek-white"
          >
            All
          </button>
          <button
            onClick={() => filterTrack('farm')}
            className="border-2 rounded-lg px-3 py-2 hover:bg-ek-light hover:text-ek-black focus:bg-ek-green focus:text-ek-white"
          >
            On Farm
          </button>
          <button
            onClick={() => filterTrack('harvest')}
            className="border-2 rounded-lg px-3 py-2 hover:bg-ek-light hover:text-ek-black focus:bg-ek-green focus:text-ek-white"
          >
            Harvested
          </button>
        </article>
      </section>
      <DataGrid
        rows={selectedProduct}
        columns={rice}
        pageSize={10}
        rowHeight={38}
      />
    </motion.div>
  )
}

export default PalmTrack;
