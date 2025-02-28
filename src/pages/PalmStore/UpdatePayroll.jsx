import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MdArrowBack } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { ImSpinner3 } from "react-icons/im";
import { motion } from "framer-motion";
import { fetchPayrolls, updatePayroll } from '../../redux/reducer/payrollAction';
import { auth } from '../../apiCall';
import Top from "../Dashboard/Top";

const UpdatePayroll = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const payrolls = useSelector((state) => state.payroll.payrolls);
  const [staffData, setStaffData] = useState({});

  const dispatch = useDispatch();

  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    const employee = payrolls.find((pay) => pay._id === id);
    if (employee) {
      setStaffData(employee);
      formik.setValues({
        allowances: employee.allowances || '',
        deductions: employee.deductions || '',
        ...employee,
      });
    };
    auth.get(`/salary/${id}`)
      .then((response) => {
        dispatch(fetchPayrolls(response.data.payrolls));
      })
      .catch((error) => {
        toast.error(error.response.data.error || 'An unexpected error occurred', {
          theme: 'light',
          position: 'top-right',
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  
    setIsLoading(false);
  }, [id, payrolls]);

  const validationSchema = Yup.object({
    allowances: Yup.number().nullable()
    .nullable()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        originalValue.trim() === '' ? null : value;
      }
    })
    .typeError('Deduction must be a number'),
    deductions: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
    if (typeof originalValue === 'string') {
      originalValue.trim() === '' ? null : value;
    }
  })
  .typeError('Deduction must be a number'),
  });

  const formik = useFormik({
    initialValues: {
      allowances: '',
      deductions: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values.staff.salary);
      setIsLoading(true);
      dispatch(updatePayroll(values));
      setIsLoading(false);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

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
      <Top title="Palm Store" text="Managing and Monitoring Sales" />
      <section className="user">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Edit Staff Payroll</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/hr/payroll" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Payroll</Link>
            <Link to="/hr/staff/new" className="border-2 rounded-lg px-3 py-1 hover:bg-ek-deep hover:text-ek-green">Add New Staff</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-2 min-h-[70vh] w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <div className="userShow border-r pr-10 mr-10">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="userInfo flex flex-col gap-4">
                <div className="work flex flex-col gap-1">
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Staff Name:</span>
                    <span className="capitalize">{`${staffData?.staff?.firstName} ${staffData?.staff?.lastName}`}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Job Title:</span>
                    <span className="capitalize">{staffData?.staff?.jobTitle ? staffData.staff.jobTitle : 'Nil'}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Basic Salary:</span>
                    <span className="capitalize">{staffData?.staff?.salary ? `₦${staffData.staff.salary.toLocaleString()}` : 'Nil'}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Period:</span>
                    <span className="capitalize">{formik.values?.period || `${staffData?.year}-${staffData?.month}`}</span>
                  </div>
                </div>
                <div className="work flex flex-col gap-1">
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Allowances:</span>
                    <span className="capitalize">{staffData?.allowances ? `₦${staffData.allowances.toLocaleString()}` : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Gross Salary:</span>
                    <span className="capitalize">{staffData?.grossSalary ? `₦${staffData.grossSalary.toLocaleString()}` : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Deductions:</span>
                    <span className="capitalize">{staffData?.deductions ? `₦${staffData.deductions.toLocaleString()}` : 'Nil' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Net Salary:</span>
                    <span className="capitalize">{staffData?.netSalary ? `₦${staffData.netSalary.toLocaleString()}` : 'Nil' }</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Edit</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft flex flex-col gap-2 mt-4">
              <div className="userUpdateItem flex relative flex-col">
                  <label className="capitalize font-semibold">Allowances:</label>
                  <input
                    type="number"
                    name="allowances"
                    value={formik.values.allowances}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setStaffData((prev) => ({
                        ...prev,
                        allowances: parseFloat(e.target.value),
                      }));
                    }}
                    placeholder="Enter amount in naira"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.allowances && formik.errors.allowances ? (
                    <div className="error text-red-600 absolute top-16 text-[12px]">{formik.errors.allowances}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col relative">
                  <label className="capitalize font-semibold">Deductions:</label>
                  <input
                    type="number"
                    name="deductions"
                    value={formik.values.deductions}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setStaffData((prev) => ({
                        ...prev,
                        deductions: parseFloat(e.target.value),
                      }));
                    }}
                    onBlur={formik.handleBlur}
                    placeholder="Enter amount in naira"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.deductions && formik.errors.deductions ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.deductions}</div>
                  ) : null}
                </div>
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

export default UpdatePayroll;
