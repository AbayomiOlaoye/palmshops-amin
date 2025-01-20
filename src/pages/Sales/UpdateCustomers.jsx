import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { toast } from "react-toastify";
import Top from "../Dashboard/Top";
import { auth } from '../../apiCall';

const UpdateCustomers = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState({});

  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    auth.get(`/customers/${id}`)
      .then(({ data }) => {
        setCustomerData(data);
        formik.setValues(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || 'Failed to fetch customer');
      });
  }, []);

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
      auth.put(`/customers/${id}`, values)
        .then(() => {
          setIsLoading(false);
          toast.success('Customer added successfully');
          formik.resetForm();
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
    if (Object.keys(formik.errors).length > 0) {
      const timer = setTimeout(() => {
        formik.setErrors({});
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [formik.errors]);

  const getDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

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
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Customer&rsquo;s Information</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/customers" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Customers</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
        <div className="userShow border-r pr-10 mr-10">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="userInfo flex flex-col gap-4">
                <div className="work flex flex-col gap-1">
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Name:</span>
                    <span className="capitalize">{customerData.name}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Phone Number:</span>
                    <span className="capitalize">{customerData.phone }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Email:</span>
                    <span className="capitalize">{customerData.email ? customerData.email : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Customer Since:</span>
                    <span>{getDate(customerData.createdAt)}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Contact Address:</span>
                    <span className="capitalize">{customerData.address}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Business Name:</span>
                    <span className="capitalize">{customerData.businessName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Edit Customer Details Below</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft grid grid-cols-2 gap-2 gap-x-8 mt-4">
              {Object.keys(formik.initialValues)
                .map((key) => {
                  if (typeof formik.initialValues[key] === 'object' && formik.initialValues[key] !== null) {
                    return Object.keys(formik.initialValues[key]).map((nestedKey) => (
                      <div className="userUpdateItem flex flex-col" key={`${key}.${nestedKey}`}>
                        <label className="capitalize font-semibold">{`${nestedKey.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}:`}</label>
                        <input
                          type="text"
                          name={`${key}.${nestedKey}`}
                          value={formik.values[key]?.[nestedKey] || ''}
                          onChange={(e) => {
                            formik.setFieldValue(`${key}.${nestedKey}`, e.target.value);
                            setCustomerData((prev) => ({
                              ...prev,
                              [key]: {
                                ...prev[key],
                                [nestedKey]: e.target.value,
                              },
                            }));
                          }}
                          onBlur={formik.handleBlur}
                          className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                        />
                        {formik.touched[key]?.[nestedKey] && formik.errors[key]?.[nestedKey] ? (
                          <div className="error text-red-600">{formik.errors[key][nestedKey]}</div>
                        ) : null}
                      </div>
                    ));
                  }
                  return (
                    <div className="userUpdateItem flex flex-col" key={key}>
                      <label className="capitalize font-semibold">{`${key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}:`}</label>
                      <input
                        type="text"
                        name={key}
                        value={formik.values[key] || ''}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setCustomerData((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                        }}
                        onBlur={formik.handleBlur}
                        className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                      />
                      {formik.touched[key] && formik.errors[key] ? (
                        <div className="error text-red-600 text-[12px]">{formik.errors[key]}</div>
                      ) : null}
                    </div>
                  );
                })}

              </div>
              <button type="submit" className="userUpdateButton bg-ek-deep text-white py-2 px-4 self-start rounded-md hover:bg-ek-green transition-all">
                {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Update'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.section>
  )
}

export default UpdateCustomers;
