import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack } from 'react-icons/md';
import Top from '../../Dashboard/Top';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Radio, RadioGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components
import { auth } from '../../../apiCall';
import { toast } from 'react-toastify';

const StoreRequests = () => {
  const [category, setCategory] = useState('trackcrop');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleDeleteConfirmation = (item) => {
    setItemToDelete(item);
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    setDeleteConfirmationOpen(false);

    try {
      await auth.delete(`/${category.toLowerCase()}/${itemToDelete._id}`);
      setData(prevData => prevData.filter(item => item._id !== itemToDelete._id));
      toast.success('Item deleted successfully');
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.response.error || 'Error deleting item');
    }
  };

  const API_ENDPOINTS = {
      trackcrop: '/trackcrop/all',
      trackfarm: '/trackfarm/all',
      trackequipment: '/trackequipment/all',
  };

  const handleGoBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await auth.get(API_ENDPOINTS[category]);
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const dataWithSerial = data.map((item, index) => ({ ...item, serial: index + 1 }));
        setData(dataWithSerial);
      } catch (error) {
          console.error('Error fetching data:', error);
          setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const getColumns = () => {
    const baseColumns = [
      { field: 'serial', headerName: 'ID', width: 70 },
      {
        field: 'userId',
        headerName: 'Seller/Lessor',
        width: 120,
        renderCell: (params) => (params.row?.userId?.name || 'Nil'),
      },
      { field: 'createdAt', headerName: 'Date', width: 150, renderCell: (params) => new Date(params.row?.createdAt).toDateString() },
    ];

    switch (category) {
      case 'trackcrop':
        return [
          ...baseColumns,
          { field: 'productName', headerName: 'Product Name', width: 150 },
          { field: 'quantity', headerName: 'Quantity', width: 100 },
          { field: 'pricePerUnit', headerName: 'Price/Unit', width: 120 },
          { field: 'address', headerName: 'Address', width: 200 },
          { field: 'lga', headerName: 'LGA', width: 120 },
          {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
              <div className='flex gap-4 items-center h-30 justify-center'>
                <Link to={`/products/requests/${params.row?._id}`} className="bg-ek-green text-white px-2 mt-1 py-1 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
                  View
                </Link>
                <button type='button' className="userListDelete bg-ek-gray px-2 mt-1 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded" onClick={() => handleDeleteConfirmation(params.row)}>
                  Delete
                </button>
              </div>
            ),
          },
        ];
        case 'trackfarm':
          return [
            ...baseColumns,
            { field: 'cropPlanted', headerName: 'Crop Planted', width: 150 },
            { field: 'farmSize', headerName: 'Farm Size', width: 80 },
            { field: 'farmSizeUnit', headerName: 'Farm Size Unit', width: 80 },
            { field: 'address', headerName: 'Address', width: 200 },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 150,
              renderCell: (params) => (
                <div className='flex gap-4 items-center h-30 justify-center'>
                  <Link to={`/products/requests/${params.row?._id}`} className="bg-ek-green text-white px-2 mt-1 py-1 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
                    View
                  </Link>
                  <button type='button' className="userListDelete bg-ek-gray px-2 mt-1 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded" onClick={() => handleDeleteConfirmation(params.row)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ];
        case 'trackequipment':
          return [
            ...baseColumns,
            { field: 'equipment', headerName: 'Equipment', width: 150 },
            { field: 'address', headerName: 'Address', width: 200 },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 150,
              renderCell: (params) => (
                <div className='flex gap-4 items-center h-30 justify-center'>
                  <Link to={`/products/requests/${params.row?._id}`} className="bg-ek-green text-white px-2 mt-1 py-1 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
                    View
                  </Link>
                  <button type='button' className="userListDelete bg-ek-gray px-2 mt-1 h-[28px] flex items-center self-center hover:bg-opacity-75 transition-all text-white rounded" onClick={() => handleDeleteConfirmation(params.row)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ];
      default:
      return [];
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full overflow-auto"
    >
      <Top title="Palm Store" text="Managing and Monitoring Sales" />
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
          <article className="other-actions flex gap-3 ">
            <Link to="/products/orders" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Manage Orders</Link>
            <Link to="/products/requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Manage Requests</Link>
            <Link to="/products/new" className="border-2 rounded-lg px-3 py-2 focus:bg-ek-light focus:text-ek-nav hover:bg-ek-green hover:text-ek-white">New Product</Link>
          </article>
        </div>

        <div className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <RadioGroup
            row
            aria-label="category"
            name="category"
            value={category}
            onChange={handleChangeCategory}
            className='mb-3'
          >
            <FormControlLabel value="trackcrop" control={<Radio />} label="Crops" />
            <FormControlLabel value="trackequipment" control={<Radio />} label="Equipment" />
            <FormControlLabel value="trackfarm" control={<Radio />} label="Farm" />
          </RadioGroup>
          <DataGrid
            rows={data}
            columns={getColumns()}
            loading={loading}
            getRowId={(row) => row._id}
          />
        </div>
      </section>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {category.toLowerCase()}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.section>
  );
};

export default StoreRequests;