import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import Top from "../Dashboard/Top";
import { auth } from '../../apiCall';
import { deleteProduct, fetchAllproductStock } from '../../redux/reducer/productAction';

const AllProducts = () => {
  const { products } = useSelector((state) => state.product);
  const [stats, setStats] = useState([]);
  const [productWithSalesData, setProductWithSalesData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllproductStock());
  }, [dispatch]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await auth.get('/orders/stats');
      setStats(data.data);
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (products && products.length > 0 && stats && stats.length > 0) {
      const productWithSerialAndSales = products.map((product, index) => {
        const matchingStat = stats.find(stat => stat.productId === product.productId);

        return {
          ...product,
          id: index + 1,
          totalOrders: matchingStat ? matchingStat.totalOrders : 0,
          totalUnitsSold: matchingStat ? matchingStat.totalUnitsSold : 0
        };
      });
      setProductWithSalesData(productWithSerialAndSales);
    }
  }, [products, stats]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    setProductWithSalesData(productWithSalesData.filter((item) => item._id !== id));
  };

  const columns = [
    {field: "id", headerName: "S/N", width: 50},
    {
      field: "title",
      headerName: "Product Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser flex items-center gap-2">
            {params.row?.title}
          </div>
        );
      },
    },
    { field: "productId", headerName: "Product ID", width: 90, height: 30, },
    {
      field: "price",
      headerName: "Price/Unit",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userListUser flex items-center gap-2">
            {`₦${params.row?.price.toLocaleString()}`}
          </div>
        );
      }
    },
    { field: "totalOrders", headerName: "Total Orders", width: 150 },
    { field: "totalUnitsSold", headerName: "Total Units Sold", width: 150 },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 80,
      renderCell: (params) => {
        return (
          <div className="userListUser flex items-center h-30 gap-2">
            <span className={`capitalize px-2 rounded-md h-[28px] mt-1 flex items-center text-white ${params.row?.inStock ? 'bg-green-600' : 'bg-red-600'}`}>{params.row?.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
        );
      }
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className='flex gap-4 items-center h-30 justify-center'>
            <Link to={"/products/edit/" + params.row?._id} className="bg-ek-green mt-1 text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
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
            <span className="font-medium">Overview of Products</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/products/orders" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-green focus:bg-ek-light focus:text-ek-nav hover:text-ek-white">Manage Orders</Link>
            <Link to="/products/requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Manage Requests</Link>
            <Link to="/products/sales-lease-requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Sell/Lease Orders</Link>
            <Link to="/products/new" className="border-2 rounded-lg px-3 py-2 focus:bg-ek-light focus:text-ek-nav hover:bg-ek-green hover:text-ek-white">New Product</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <DataGrid
            rows={productWithSalesData}
            columns={columns}
            pageSize={10}
            rowHeight={38}
          />
        </article>
      </section>
    </motion.div>
  )
}

export default AllProducts;
