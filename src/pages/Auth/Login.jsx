import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ImSpinner3 } from 'react-icons/im';
import logo from '../../assets/palmshopslogo_img_white.svg';
import { signIn } from '../../redux/reducer/authActions';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state?.auth);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    phone: Yup.string().required('Phone is required'),
    password: Yup.string().required('Kindly enter password'),
  });

  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      
    try {
      if (rememberMe) {
        localStorage.setItem('userCredentials', JSON.stringify(values.phone));
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('rememberMe');
      }

      await dispatch(signIn(values));
    } catch (err) {
      console.log(err);
    }

    },
  });
  
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('userCredentials'));
    const savedRememberMe = localStorage.getItem('remember') === 'true';
    if (!savedData || !savedRememberMe) return;
    if (savedRememberMe && savedData) {
      formik.setValues({ phone: savedData, password: '' });
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      formik.setErrors({});
    }, 3000);
    return () => clearTimeout(timer);
  }, [formik.errors]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [loading, navigate, isAuthenticated]);

  return (
    <motion.section
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.5 }}
      className="flex flex-col items-center min-h-screen justify-center px-5 login-bg"
    >
      <div className="container opacity-bg flex flex-col mx-auto py-20 px-3 lg:py-30 md:max-w-[60%]">
        <img src={logo} alt="ERD Logo" className="mx-auto max-w-[15%]" />

        <form className="flex flex-col mx-auto gap-4" onSubmit={formik.handleSubmit}>
          <h2 className="text-2xl font-extrabold text-center my-5 text-white">Palmshops Admin Dashboard</h2>

          <div className="flex flex-col relative">
            <input
              type="tel"
              name="phone"
              value={formik.identifier}
              placeholder="Phone Number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full p-3 text-ek-gray border border-gray-300 shadow-sm focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-ek-lime sm:text-sm rounded-md"
            />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-ek-lime text-sm mt-1 absolute top-12">{formik.errors.phone}</div>
          ) : null}
          </div>

          <div className="mt-2 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="********"
                value={formik.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full text-ek-gray p-3 border border-gray-300 shadow-sm focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-ek-lime sm:text-sm rounded-md"
              />
            <span
              onClick={togglePasswordVisibility}
              style={{
                cursor: 'pointer', position: 'absolute', right: 15, top: 18,
              }}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </span>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-ek-lime text-sm mt-1 absolute">{formik.errors.password}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full mt-5 flex justify-center p-3 bg-ek-green rounded-md text-sm font-bold text-white hover:opacity-85 focus:outline-none transition-all active:scale-95"
          >
            {loading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Authorize'}
          </button>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <input
                name="remember"
                type="checkbox"
                id="remember" className="mr-2"
                value={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
              />
              <label htmlFor="remember" className="text-sm text-ek-lime font-bold">Remember me</label>
            </div>
            <Link to="/find-my-account" className="text-sm text-ek-lime font-bold hover:underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default Login;
