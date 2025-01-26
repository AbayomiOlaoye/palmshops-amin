import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MdArrowBack, MdImage } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { useDropzone } from 'react-dropzone';
import { addEmployee, getEmployees } from '../../redux/reducer/employeeAction';
import Top from "../Dashboard/Top";

const NewStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [badImg, setBadImg] = useState({ status: false, message: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  }

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
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
      password: '',
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
      role: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      dispatch(addEmployee(values))
      dispatch(getEmployees())
        .then(() => {
          setIsLoading(false);
          formik.resetForm();
          navigate('/hr');
        })
        .catch(() => {
          setIsLoading(false);
        });
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
  });

  useEffect(() => {
    formik.resetForm({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
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
        role: '',
      },
    });
  }, []);


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
            <span className="font-medium">Add New Staff</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/payroll" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Payroll</Link>
            <Link to="/hr/staff/new" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Add New Staff</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
            
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Enter Staff Details Below</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft grid grid-cols-2 gap-2 gap-x-8 mt-4">
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder="e.g. Ekan"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.firstName}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    placeholder="e.g. Bassey"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.lastName}</div>
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
                  <label className="capitalize font-semibold">Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="*********"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.password}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Next of Kin:</label>
                  <input
                    type="text"
                    name="next_of_kin"
                    value={formik.values.next_of_kin}
                    onChange={formik.handleChange}
                    placeholder="e.g. Ekan Bassey"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.next_of_kin && formik.errors.next_of_kin ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.next_of_kin}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Next of Kin&apos;s Phone:</label>
                  <input
                    type="text"
                    name="next_of_kin_phone"
                    value={formik.values.next_of_kin_phone}
                    onChange={formik.handleChange}
                    placeholder="e.g. 08012345678"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.next_of_kin_phone && formik.errors.next_of_kin_phone ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.next_of_kin_phone}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Department:</label>
                  <select 
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">Select Department</option>
                    <option value="administrative">Administations/Operations</option>
                    <option value="riceProduction">Rice Production</option>
                    <option value="additive">Additives Production</option>
                  </select>
                  {formik.touched.department && formik.errors.department ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.department}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Job Title:</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formik.values.jobTitle}
                    onChange={formik.handleChange}
                    placeholder="e.g. Accountant"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.jobTitle && formik.errors.jobTitle ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.jobTitle}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Salary:</label>
                  <input
                    type="number"
                    name="salary"
                    value={formik.values.salary}
                    onChange={formik.handleChange}
                    placeholder="e.g. 50000"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.salary && formik.errors.salary ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.salary}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Bank Name:</label>
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    value={formik.values.bankDetails.bankName}
                    onChange={formik.handleChange}
                    placeholder="e.g. GTBank"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.bankDetails?.bankName && formik.errors.bankDetails?.bankName ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.bankDetails.bankName}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Account Number:</label>
                  <input
                    type="text"
                    name="bankDetails.accountNumber"
                    value={formik.values.bankDetails.accountNumber}
                    placeholder="e.g. 0123456789"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.bankDetails?.accountNumber && formik.errors.bankDetails?.accountNumber ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.bankDetails.accountNumber}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Headshot Photo:</label>
                  <div {...getRootProps()} className="border-2 border-dashed bor rounded-md focus:outline-ek-green p-1 px-2">
                    <input {...getInputProps()} />
                      {formik.values.image ? (
                        <div className="max-w-[20%]">
                          <img src={formik.values.image} alt="product" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MdImage className="" />
                          <p>Upload Image (1MB max)</p>
                        </div>
                      )}
                    </div>
                    {formik.errors.image && formik.touched.image && (
                      <div className="error text-red-600 text-[12px]">
                        {formik.errors.image}
                      </div>
                    )}
                    {badImg.status && (
                      <div className="error text-red-600 text-[12px]">
                        {badImg.message}
                      </div>
                    )}
                  </div>
                  <div className="userUpdateItem flex flex-col">
                    <label className="capitalize font-semibold">Role:</label>
                    <select 
                      name="role"
                      value={formik.values.role}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="gen_staff">Staff</option>
                      <option value="accountant">Accountant</option>
                    </select>
                    {formik.touched.role && formik.errors.role ? (
                      <div className="error text-red-600 text-[12px]">{formik.errors.role}</div>
                    ) : null}
                  </div>
                </div>    
              <button type="submit" className="userUpdateButton bg-ek-deep text-white py-2 px-4 self-start rounded-md hover:bg-ek-green transition-all">
                {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Create'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.section>
  )
}

export default NewStaff;
