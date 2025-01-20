import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { toast } from "react-toastify";
import Top from "../Dashboard/Top";
import { auth } from '../../apiCall';

const NewCustomers = () => {
  const { role } = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Customer name is missing'),
    email: Yup.string().email('Invalid email format').notRequired(),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    businessName: Yup.string().notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      businessName: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      auth.post('/customers', values)
        .then(() => {
          setIsLoading(false);
          toast.success('Customer added successfully');
          formik.resetForm();
          navigate('/customers');
        })
        .catch(() => {
          setIsLoading(false);
          toast.error('Failed to add customer');
        });
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
  });

  useEffect(() => {
    formik.resetForm({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        address: '',
        businessName: '',
      },
    });
  }, []);


  useEffect(() => {
    if (formik.errors.length > 0) {
      const timer = setTimeout(() => {
        formik.setErrors({});
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [formik.errors]);

  return (
    <motion.section className="max-w-full"
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
      <Top title="Customers" text="Manage Customers' Information" />
      <section className="user">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl p-4"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Add New Customer</span>
          </motion.article>
          {role !== 'gen_staff' && (
            <article className="other-actions flex gap-3">
            <Link to="/customers" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Customers</Link>
          </article>
          )}
        </div>
        <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
            
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Enter Customer&apos;s Details Below</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-8 mt-4">
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Full Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder="Johnson Emmanson"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.firstName && formik.errors.name ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.name}</div>
                  ) : null}
                </div>

                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    placeholder="e.g. user@something.com"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    placeholder="e.g. 08012345678"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.phone}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    placeholder="e.g. 123, Ekan Avenue, Itam, Off Idoro Road"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.address}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Business Name:</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formik.values.businessName}
                    onChange={formik.handleChange}
                    placeholder="e.g. Bivas Ventures"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.businessName && formik.errors.businessName ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.businessName}</div>
                  ) : null}
                </div>
              </div>    
              <button type="submit" className="userUpdateButton bg-ek-deep text-white py-2 px-4 self-start rounded-md hover:bg-ek-green transition-all">
                {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.section>
  )
}

export default NewCustomers;

