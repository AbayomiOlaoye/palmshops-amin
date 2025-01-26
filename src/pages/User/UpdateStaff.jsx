import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MdArrowBack } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { useDropzone } from 'react-dropzone';
import { updateEmployee, getEmployees } from '../../redux/reducer/employeeAction';
import { auth } from '../../apiCall';
import Top from "../Dashboard/Top";

const UpdateStaff = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [staffData, setStaffData] = useState({});
  const [badImg, setBadImg] = useState({ status: false, message: '' });

  const dispatch = useDispatch();

  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    auth.get(`/${id}`)
      .then(({ data }) => {
        setStaffData(data);
        formik.setValues(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.error);
      });
  }, [id]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    next_of_kin: Yup.string().required('Next of kin is required'),
    next_of_kin_phone: Yup.string().required('Next of kin phone is required'),
    bankDetails: Yup.object({
      bankName: Yup.string().required('Bank name is required'),
      accountNumber: Yup.string().required('Account number is required'),
    }),
    department: Yup.string().required('Department is required'),
    salary: Yup.number().required('Salary is required').positive('Must be a positive number'),
    jobTitle: Yup.string().required('Job title is required'),
    image: Yup.string().required('Image is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      next_of_kin: '',
      next_of_kin_phone: '',
      department: '',
      jobTitle: '',
      salary: '',
      bankDetails: {
        bankName: '',
        accountNumber: '',
      },
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      dispatch(updateEmployee(values))
      dispatch(getEmployees())
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (formik.errors.length > 0 || badImg.status) {
      const timer = setTimeout(() => {
        formik.setErrors({});
        setBadImg({ status: false, message: '' });
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [formik.errors, badImg]);

  const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: 1024000,
  });

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      acceptedFiles.map(async (file) => {
        const base64Image = await convertToBase64(file);
        formik.setFieldValue('image', base64Image);
      });
    }

    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            setBadImg({ status: true, message: `"${file.name}" is too large. Maximum size is 1MB.` });
          } else if (error.code === 'file-invalid-type') {
            setBadImg({ status: true, message: `"${file.name}" is not a valid image type. Only JPEG and PNG images are accepted.` });
          }
        });
      });
    }
  }, [acceptedFiles, fileRejections]);

  const excludedKeys = ['bankDetails', 'createdAt', 'image', 'updatedAt', '__v', '_id', 'employeeId', 'relationship', 'bankName', 'accountNumber'];

  const getDate = (order) => {
    const date = new Date(order);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
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
            <span className="font-medium">Edit Staff Data</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/hr/payroll" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Payroll</Link>
            <Link to="/hr/staff/new" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Add New Staff</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <div className="userShow border-r pr-10 mr-10">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="userInfo flex flex-col gap-4">
                <div className="work flex flex-col gap-1">
                  <div className="info flex max-w-[30%] gap-24 mb-4">
                    {staffData.image && (
                      <img src={staffData.image} alt="Our staff"  />
                    )}
                  </div>
                  <h3 className="font-bold">Work Details</h3>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Job Title:</span>
                    <span className="capitalize">{staffData.jobTitle ? staffData.jobTitle : 'Nil'}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Department:</span>
                    <span className="capitalize">{staffData.department ? staffData.department : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Starting Date:</span>
                    <span>{getDate(staffData.createdAt)}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Staff ID:</span>
                    <span className="capitalize">{`#${staffData.employeeId}`}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Salary:</span>
                    <span className="capitalize">{staffData.salary ? `₦${staffData.salary.toLocaleString()}` : 'Nil'}</span>
                  </div>
                </div>
                <div className="work flex flex-col gap-1">
                  <h3 className="font-bold">Personal Details</h3>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Name:</span>
                    <span className="capitalize">{`${staffData.firstName} ${staffData.lastName}`}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Address:</span>
                    <span className="capitalize">{staffData.address ? staffData.address : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Phone Number:</span>
                    <span className="capitalize">{staffData.phone ? staffData.phone : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Next of Kin:</span>
                    <span className="capitalize">{staffData.next_of_kin ? staffData.next_of_kin : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Next of Kin Phone:</span>
                    <span className="capitalize">{staffData.next_of_kin_phone ? staffData.next_of_kin_phone : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Email:</span>
                    <span className="capitalize">{staffData.email ? staffData.email : 'Nil' }</span>
                  </div>
                </div>
                <div className="work flex flex-col gap-1">
                  <h3 className="font-bold">Bank Details</h3>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Bank Name:</span>
                    <span className="capitalize">{staffData.bankDetails?.bankName ? staffData.bankDetails?.bankName : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Account Number:</span>
                    <span className="capitalize">{staffData.bankDetails?.accountNumber ? staffData.bankDetails?.accountNumber : 'Nil' }</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Edit</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft grid grid-cols-2 gap-2 gap-x-8 mt-4">
              {Object.keys(formik.initialValues)
                .filter((key) => !excludedKeys.includes(key))
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
                            setStaffData((prev) => ({
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
                          setStaffData((prev) => ({
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

                <div {...getRootProps({ className: 'dropzone border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-ek-green' })}>
                  <input {...getInputProps()} />
                  <p className="text-sm text-gray-500">
                    Drag &apos;n&apos; drop an image here, or click to select files (JPEG/PNG, max 1MB)
                  </p>
                </div>

                {formik.values.image && (
                  <div className="mt-4">
                    <p className="font-medium text-sm">Image Preview:</p>
                    <img src={formik.values.image} alt="Uploaded Preview" className="max-w-full h-32 object-cover mt-2 rounded-lg shadow-md" />
                  </div>
                )}

                {badImg.status && (
                  <div className="text-red-600 text-sm mt-2">{badImg.message}</div>
                )}

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

export default UpdateStaff;
