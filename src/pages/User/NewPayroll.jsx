import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { ImSpinner3 } from "react-icons/im";
import { motion } from "framer-motion";
import { addPayroll } from '../../redux/reducer/payrollAction';
import Top from "../Dashboard/Top";

const NewPayroll = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { employees } = useSelector((state) => state.employee);
  const dispatch = useDispatch();

  const handleGoBack = () => {
    window.history.back();
  }

  const validationSchema = Yup.object({
    staffId: Yup.string().required('Staff ID is required'),
    period: Yup.string().required('Select a period of payment'),
    allowances: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue.trim() === '' ? null : value))
    .typeError('Allowance must be a number'),
    deductions: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue.trim() === '' ? null : value))
    .typeError('Deduction must be a number'),
  });

  const formik = useFormik({
    initialValues: {
      staffId: '',
      period: '',
      allowances: '',
      deductions: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const formattedData = {
        ...values,
        allowances: values.allowances ? parseFloat(values.allowances) : 0,
        deductions: values.deductions ? parseFloat(values.deductions) : 0,
      };
      setIsLoading(true);
      dispatch(addPayroll(formattedData));
      formik.resetForm();
      setIsLoading(false);
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
  });

  useEffect(() => {
    formik.resetForm({
      initialValues: {
        staffId: '',
        period: '',
        allowances: '',
        deductions: '',
      },
    });
  }, []);

  useEffect(() => {
    const selectedEmployee = employees.find((user) => user._id === formik.values.staffId);
    if (selectedEmployee) {
      formik.setFieldValue('salary', selectedEmployee.salary || '');
    } else {
      formik.setFieldValue('salary', '');
    }
  }, [formik.values.staffId, employees]);

  useEffect(() => {
    if (Object.keys(formik.errors.length > 0)) {
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
            <span className="font-medium">Create Salary Definition</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/hr/payroll" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Payroll</Link>
            <Link to="/hr/staff/new" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Add New Staff</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
            
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Fill Monthly Pay Information</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-6">
              <div className="userUpdateLeft grid grid-cols-2 gap-6 gap-x-8 mt-4">
                <div className="userUpdateItem flex flex-col relative">
                  <label className="capitalize font-semibold">Staff Name:</label>
                  <select 
                    name="staffId"
                    value={formik.values.staffId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">Select Staff</option>
                    {employees && employees.length > 0 ? (
                      employees.map((user) => (
                        <option key={user._id} value={user._id}>
                          {`${user.firstName} ${user.lastName}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading employees...</option>
                    )}
                  </select>
                  {formik.touched.staffId && formik.errors.staffId ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.staffId}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex relative flex-col">
                  <label className="capitalize font-semibold">Allowances:</label>
                  <input
                    type="text"
                    name="allowances"
                    value={formik.values.allowances}
                    onChange={formik.handleChange}
                    placeholder="Enter amount in naira"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.allowances && formik.errors.allowances ? (
                    <div className="error text-red-600 absolute top-16 text-[12px]">{formik.errors.allowances}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col relative">
                  <label className="capitalize font-semibold">Basic Salary:</label>
                  <input
                    type="text"
                    name="salary"
                    value={formik.values.salary}
                    onChange={formik.handleChange}
                    disabled
                    placeholder="Enter amount in naira"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.salary && formik.errors.salary ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.salary}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col relative">
                  <label className="capitalize font-semibold">Deductions:</label>
                  <input
                    type="text"
                    name="deductions"
                    value={formik.values.deductions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter amount in naira"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.deductions && formik.errors.deductions ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.deductions}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem relative flex flex-col">
                  <label className="capitalize font-semibold">Period:</label>
                  {!formik.values.period && <span className="absolute left-1 top-7 bg-white w-fit pl-6">Select Month</span>}
                  <input
                    type="month"
                    name="period"
                    value={formik.values.period}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.period && formik.errors.period ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.period}</div>
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

export default NewPayroll;
