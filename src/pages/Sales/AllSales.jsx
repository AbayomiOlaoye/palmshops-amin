/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import { MdArrowBack } from "react-icons/md";
import { toast } from 'react-toastify';
import Top from "../Dashboard/Top";
import { auth } from '../../apiCall';

const AllSales = () => {
  const { warehouses } = useSelector((state) => state?.warehouse);
  const [sales, setSales] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const userRole = useSelector((state) => state.auth.user.role);
  const filteredProductions = sales.filter(
    (prod) => !selectedProduct || prod.warehouse._id === selectedProduct._id
  );

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await auth.get('/sales/all');
        setSales(data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch sales');
      }
    }
    fetchSales();
  }, []);

  const ReqWithSerial = filteredProductions
  ? [...filteredProductions]
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
      width: 100,
        renderCell: (params) => {
          if (params.row?.items.length === 1) {
          return (
            <div className=''>
              <span>{params.row?.items[0]?.product?.product}</span>
            </div>
          );
        } else if (params.row?.items.length > 1) {
          return (
            <div className=''>
              <span>{`${params.row?.items[0]?.product?.product} and other products}`} more</span>
            </div>
          );
        }
      }
    },
    {
      field: "quantity",
      headerName: "Qty Sold",
      width: 80,
      renderCell: (params) => {
        if (params.row?.items.length === 1) {
        return (
          <div className=''>
            <span>{params.row?.items[0]?.quantity}</span>
          </div>
        );
      } else if (params.row?.items.length > 1) {
        return (
          <div className=''>
            <span>{`${params.row?.items[0]?.quantity} and more}`} more</span>
          </div>
        );
      }
    }
    },
    {
      field: "type",
      headerName: "Sales Type",
      width: 80,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{params?.row?.type === 'cash' ? 'Cash Sales' : 'Credit Sales'}</span>
          </div>
        );
      }
    },
    {
      field: "method",
      headerName: "Payment Method",
      width: 80,
      renderCell: (params) => {
        return (
          <div className='capitalize'>
            <span>{params.row?.method}</span>
          </div>
        );
      }
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 80,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{params.row?.customer?.name}</span>
          </div>
        );
      }
    },
    {
      field: "warehouse",
      headerName: "Vendor",
      width: 80,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{params.row?.warehouse?.name}</span>
          </div>
        );
      }
    },
    {
      field: "amountPaid",
      headerName: "Amount Paid",
      width: 80,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{`₦${(params.row?.amountPaid).toLocaleString()}`}</span>
          </div>
        );
      }
    },
    {
      field: "balance",
      headerName: "Balance",
      width: 80,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{`₦${(params.row?.balance).toLocaleString()}`}</span>
          </div>
        );
      }
    },
    {
      field: "totalPrice",
      headerName: "Total Sales",
      width: 80,
      renderCell: (params) => {
        return (
          <div className=''>
            <span>{`₦${(params.row?.totalPrice).toLocaleString()}`}</span>
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
          <div className='flex gap-4 justify-ce items-center h-30 pt-1'>
            <Link to={`/sales/edit/${params.row?._id}`} className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded">
              <button className="userListEdit">{userRole === 'admin' ? 'Details' : 'View'}</button>
            </Link>
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
      <Top title="Sales" text="Tracking Sales and  Cash Inflows" />
      <section className="">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Overview of Sales</span>
          </motion.article>
          <article className="other-actions flex gap-2">
            {warehouses.map((product) => (
              <button
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className={`border-2 rounded-lg px-3 py-2 ${
                  selectedProduct?._id === product._id
                    ? "bg-ek-deep text-ek-green"
                    : "hover:bg-ek-deep hover:text-ek-green"
                }`}
              >
                {product.name}
              </button>
            ))}
            <Link to="/customers" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">Customers</Link>
            <Link to="/sales/new" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">New Sale</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <DataGrid
            rows={ReqWithSerial}
            columns={rice}
            pageSize={10}
            rowHeight={38}
          />
        </article>
      </section>
    </motion.div>
  )
}

export default AllSales;
