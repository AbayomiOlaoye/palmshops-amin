import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Top from '../Dashboard/Top';
import { auth } from '../../apiCall';

const SalesDetails = () => {
  const [sales, setSales] = useState([]);
  // const { employees } = useSelector((state) => state.employee);
  const { id } = useParams();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await auth.get(`/sales/${id}`);
        console.log(data);
        setSales(data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch sales');
      }
    }
    fetchSales();
  }, [id]);

  const getDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleGoBack = () => {
    window.history.back();
  };

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
            <span className="font-medium">Summary of Sales</span>
          </motion.article>
          <article className="other-actions flex gap-2">
            <Link to="/customer/new" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">Customers</Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <p>
            <strong>Sales Date:</strong> {getDate(sales.createdAt)}
          </p>
          <p>
            <strong>Seller/Recorded By:</strong> {`${sales?.createdBy?.firstName} ${sales?.createdBy?.lastName}`}
          </p>
          <p>
            <strong>Method of Payment:</strong> {sales.method}
          </p>
          <p>
            <strong>Type of Sale:</strong> {sales.type === 'cash' ? 'Cash Sales' : 'Credit Sales'}
          </p>
          <p>
            <strong>Warehouse:</strong> {sales?.warehouse?.name}
          </p>
          <p>
            <strong>Amount Paid:</strong> {`₦${(sales?.amountPaid?.toLocaleString())}`}
          </p>
          <p>
            <strong>Balance:</strong> {`₦${(sales?.balance?.toLocaleString())}`}
          </p>
          <p>
            <strong>Customer:</strong> {sales?.customer?.name}
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">List of Sold Items</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Unit</th>
                <th className="border border-gray-300 px-4 py-2">Rate</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales?.items?.map((material, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{material.product.product}</td>
                  <td className="border border-gray-300 px-4 py-2">{material.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{material.unit}</td>
                  <td className="border border-gray-300 px-4 py-2">{`₦${material.rate.toLocaleString()}`}</td>
                  <td className="border border-gray-300 px-4 py-2">{`₦${(material.quantity * material.rate).toLocaleString()}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </motion.div>
  );
};

export default SalesDetails;
