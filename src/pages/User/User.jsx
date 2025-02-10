import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ImSpinner3 } from "react-icons/im";
import { useSelector } from "react-redux";
import { MdArrowBack } from "react-icons/md";
import { motion } from "framer-motion";
import Top from "../Dashboard/Top";
import { auth } from "../../apiCall";
import { toast } from "react-toastify";
import { fetchUsers } from "../../redux/reducer/authActions";

const options = {
    theme: 'light',
    position: 'bottom-right',
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

const AllUsers = () => {
    const { id } = useParams();
    const { users } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [staffData, setStaffData] = useState(null);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        isVerified: Yup.boolean().required('Verification status is required'),
    });

    const handleGoBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                if (!users || users.length === 0) {
                    console.warn("Users data not available in Redux store.  Consider fetching.");
                    setIsLoading(false);
                    return;
                }

                const staff = users.find((user) => user._id === id);
                if (!staff) {
                    toast.error("User not found");
                    setIsLoading(false);
                    return;
                }
                setStaffData(staff);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [users, id]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: staffData
            ? {
                name: staffData.name || '',
                email: staffData.email || '',
                phone: staffData.phone || '',
                isVerified: staffData.isVerified || false,
            }
            : {
                name: '',
                email: '',
                phone: '',
                isVerified: false,
            },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                await auth.put(`/users/${id}`, values);
                dispatch(fetchUsers());
                toast.success('User updated successfully', options);
                setIsLoading(false);
            } catch (error) {
                console.error("Error updating user:", error);
                toast.error('An error occurred, please try again', options);
                setIsLoading(false);
            }
        },
        validateOnChange: false,
        validateOnBlur: true,
    });


    useEffect(() => {
      if (Object.keys(formik.errors).length > 0 ) {
        const timer = setTimeout(() => {
          formik.setErrors({});
        }, 3000);
    
        return () => clearTimeout(timer);
      }
    }, [formik.errors]);

    const getDate = (order) => {
        const date = new Date(order);
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
    };

    const excludedKeys = ['createdAt', 'updatedAt', '__v', '_id'];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!staffData) {
        return <div>User not found.</div>;
    }

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
                        <span className="font-medium">User Information</span>
                    </motion.article>
                </div>
                <div className="userContainer grid lg:grid-cols-2 w-full mt-3 min-h-[70vh] rounded-xl shadow-lg bg-white py-10 p-8">
                    <div className="userShow border-r pr-10 mr-10">
                        <div className="userInfo flex flex-col gap-4">
                            <div className="work flex flex-col gap-4">
                                <div className="info flex max-w-[30%] gap-24 mb-4">
                                    {staffData.image && (
                                        <img src={staffData.image} alt="Our staff" />
                                    )}
                                </div>
                                <div className="info flex gap-24">
                                    <span className="w-[150px] font-bold">Name:</span>
                                    <span className="capitalize">{staffData.name}</span>
                                </div>
                                <div className="info flex gap-24">
                                    <span className="w-[150px] font-bold">Email:</span>
                                    <span className="capitalize">{staffData.email}</span>
                                </div>
                                <div className="info flex gap-24">
                                    <span className="w-[150px] font-bold">Phone Number:</span>
                                    <span className="capitalize">{staffData.phone ? staffData.phone : 'Nil'}</span>
                                </div>
                                <div className="info flex gap-24">
                                    <span className="w-[150px] font-bold">Registration Date:</span>
                                    <span>{getDate(staffData.createdAt)}</span>
                                </div>
                                <div className="info flex gap-24">
                                    <span className="w-[150px] font-bold">Verification Status:</span>
                                    <span className="capitalize">{staffData.isVerified ? 'Verified' : 'Not Verified'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="userUpdate">
                        <h4 className="userUpdateTitle text-ek-deep font-extrabold">Edit</h4>
                        <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
                            <div className="userUpdateLeft grid grid-cols-2 gap-2 gap-x-8 mt-4">
                                {Object.keys(formik.initialValues)
                                    .filter((key) => !excludedKeys.includes(key))
                                    .map((key) => (
                                        <div className="userUpdateItem flex flex-col" key={key}>
                                            <label className="capitalize font-semibold">{`${key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}:`}</label>
                                            {key === 'isVerified' ? (
                                                <select
                                                    name="isVerified"
                                                    value={formik.values.isVerified}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                                                >
                                                    <option value={true}>Verified</option>
                                                    <option value={false}>Not Verified</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={formik.values[key] || ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                                                />
                                            )}
                                            {formik.touched[key] && formik.errors[key] ? (
                                                <div className="error text-red-600 text-[12px]">{formik.errors[key]}</div>
                                            ) : null}
                                        </div>
                                    ))}
                            </div>
                            <button type="submit" className="userUpdateButton bg-ek-green text-white py-2 px-4 self-start rounded-md hover:bg-ek-light transition-all">
                                {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Update'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </motion.section>
    );
};

export default AllUsers;