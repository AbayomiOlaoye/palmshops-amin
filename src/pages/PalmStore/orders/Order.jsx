import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MdArrowBack } from "react-icons/md";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { updateOrderReq } from "../../../redux/reducer/orderAction";
import { auth } from '../../../apiCall';
import Top from "../../Dashboard/Top";

const options = {
  theme: 'light',
  position: 'bottom-right',
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const Order = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [staffData, setStaffData] = useState({});

  const dispatch = useDispatch();

  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    const fetchStaff = async () => {
    const {data} = await auth.get(`/orders/order/${id}`)
      setStaffData(data);
      formik.setValues(data);
      setIsLoading(false);
    };
    fetchStaff();
  }, [id]);

  const validationSchema = Yup.object({
    deliveryStatus: Yup.string().required('Delivery status is required'),
    status: Yup.string().required('Payment status is required'),
  });

  const formik = useFormik({
    initialValues: {
      deliveryStatus: '',
      status: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      updateOrderReq(dispatch, values.orderNumber, values)
        .then(() => {
          setIsLoading(false);
          toast.success('Order updated successfully', options);
        })
        .catch(() => {
          setIsLoading(false);
        });
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (formik.errors.length > 0 ) {
      const timer = setTimeout(() => {
        formik.setErrors({});
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [formik.errors]);

  const getDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <motion.section className="max-w-full"
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
      <Top title="HR" text="Manage Staff Information" />
      <section className="user">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Order Information</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/products/requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Manage Requests</Link>
            <Link to="/products/sales-lease-requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Sell/Lease Orders</Link>
            <Link to="/products/new" className="border-2 rounded-lg px-3 py-2 focus:bg-ek-light focus:text-ek-nav hover:bg-ek-green hover:text-ek-white">New Product</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-1 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <div className="userShow border-b pb-10 mb-10">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                <div className="userInfo flex justify-between">
                  <div className="work flex flex-col gap-1">
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Order Date:</span>
                      <span className="capitalize">{getDate(staffData?.createdAt)}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Buyer:</span>
                      <span className="capitalize">{staffData?.user?.name}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Order Number:</span>
                      <span>{staffData?.orderNumber}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Number of Items:</span>
                      <span className="capitalize">{staffData?.items?.length}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Total Order:</span>
                      <span>{`₦${staffData?.totalAmount.toLocaleString()}`}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Delivery Option:</span>
                      <span className="capitalize">{staffData?.delivery}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Delivery Status:</span>
                      <span className="capitalize">{staffData?.deliveryStatus}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px] font-bold">Payment Status:</span>
                      <span className="capitalize">{staffData?.status}</span>
                    </div>
                  </div>
                  <div className="info flex flex-col gap-2 mb-4">
                    {staffData?.paymentDetails && (
                      <Zoom>
                        <img src={staffData?.paymentDetails} className="w-[100%] h-[200px]" alt="Uploaded evidence"  />
                      </Zoom>
                    )}
                    <a
                      href={staffData.paymentDetails}
                      download={staffData.title ? `${staffData.title}-payment-evidence` : 'payment-evidence'}
                      className="download cursor-pointer bg-ek-lime p-2 text-center rounded hover:bg-ek-green transition-colors" // Added styling
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </div>
                </div>
                <table className="table w-full mt-4 bg-gray-400 text-white rounded-md p-2 table-aut0">
                  <thead className="border-b border-ek-white">
                    <tr>
                      <th className="table-header text-left text-sm p-2">S/N</th>
                      <th className="table-header text-left text-sm p-2">Product Name</th>
                      <th className="table-header text-left text-sm p-2">Price</th>
                      <th className="table-header text-left text-sm p-2">Quanity</th>
                      <th className="table-header text-left text-sm p-2">Total</th>
                      <th className="table-header text-left text-sm p-2">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffData?.items?.map((item, index) => (
                      <tr key={index} className="text-sm">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{item.title}</td>
                        <td className="p-2">{`₦${item.price.toLocaleString()}/${item.metric}`}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{`₦${(item.price * item.quantity).toLocaleString()}`}</td>
                        <td className="p-2">
                          <img
                            src={item.productImage}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <article className="flex gap-4 mt-4">
                  <h4 className="text-ek-deep font-extrabold">Shipping Information</h4>
                  <p className="capitalize">{staffData?.shippingInfo?.address}</p>
                  {staffData?.shippingInfo?.address2 && (<p className="capitalize">{staffData?.shippingInfo?.address2}</p>)}
                  <p className="capitalize">{staffData?.shippingInfo?.city}</p>
                  <p className="capitalize">{staffData?.shippingInfo?.lga}</p>
                  <p className="capitalize">{staffData?.shippingInfo?.state}</p>
                </article>
              </>
            )}
          </div>
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Update Status</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft grid grid-cols-2 gap-2 gap-x-8 mt-4">
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="deliveryStatus" className="text-sm font-bold">Delivery Status</label>
                  <select
                    name="deliveryStatus"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                    value={formik.values.deliveryStatus}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setStaffData((prev) => ({
                        ...prev,
                        deliveryStatus: e.target.value,
                      }));
                    }}
                    onBlur={formik.handleBlur}
                    >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="price" className="text-sm font-bold">Payment Updates:</label>
                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setStaffData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }));
                    }}
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid/Received</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="userUpdateButton bg-ek-green text-white py-2 px-4 self-start rounded-md hover:bg-ek-green transition-all">
                {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Update'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.section>
  )
}

export default Order;

