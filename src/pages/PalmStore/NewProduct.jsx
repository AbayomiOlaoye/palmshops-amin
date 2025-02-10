import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MdArrowBack, MdImage } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { useDropzone } from 'react-dropzone';
import { addProduct } from "../../redux/reducer/productAction";
import Top from "../Dashboard/Top";

const NewProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [badImg, setBadImg] = useState({ status: false, message: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Product name is required'),
    price: Yup.number().required('Price is required'),
    rating: Yup.number().required('Rating is required'),
    description: Yup.string().required('Description is required'),
    metric: Yup.string().required('Metric is required'),
    inStock: Yup.boolean().required('In stock is required'),
    productImage: Yup.string().required('Product image is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      price: '',
      rating: '',
      description: '',
      metric: '',
      inStock: '',
      productImage: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      dispatch(addProduct(values))
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
        title: '',
        price: '',
        rating: '',
        description: '',
        metric: '',
        inStock: '',
        productImage: '',
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
    maxSize: 5120000,
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
            <span className="font-medium">Add New Product</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <Link to="/products/requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Manage Requests</Link>
            <Link to="/products/sales-lease-requests" className="border-2 focus:bg-ek-light focus:text-ek-nav rounded-lg px-3 py-2 hover:bg-ek-green hover:text-ek-white">Sell/Lease Orders</Link>
            <Link to="/products/orders" className="border-2 rounded-lg px-3 py-2 focus:bg-ek-light focus:text-ek-nav hover:bg-ek-green hover:text-ek-white">Manage Orders</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
            
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Enter Product Information</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft grid grid-cols-2 gap-2 gap-x-8 mt-4">
                <div className="userUpdateItem flex flex-col">
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    placeholder="Product Name"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.title}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <input
                    type="number"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    placeholder="e.g. 5000 (without any symbol)"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.price && formik.errors.price ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.price}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <select 
                    name="rating"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">Rating (Out of 5)</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                  {formik.touched.rating && formik.errors.rating ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.rating}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="Product Description"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.description}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <input
                    type="text"
                    name="metric"
                    value={formik.values.metric}
                    onChange={formik.handleChange}
                    placeholder="Metric (e.g. kg, g, ltr)"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched.metric && formik.errors.metric ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.metric}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <select
                    name="inStock"
                    value={formik.values.inStock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">In Stock</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {formik.touched.inStock && formik.errors.inStock ? (
                    <div className="error text-red-600 text-[12px]">{formik.errors.inStock}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col">
                  <label className="capitalize font-semibold">Product Image:</label>
                  <div {...getRootProps()} className="border-2 border-dashed bor rounded-md focus:outline-ek-green p-1 px-2">
                    <input {...getInputProps()} />
                      {formik.values.productImage ? (
                        <div className="max-w-[20%]">
                          <img src={formik.values.productImage} alt="product" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MdImage className="" />
                          <p>Upload Image (5MB max)</p>
                        </div>
                      )}
                    </div>
                    {formik.errors.productImage && formik.touched.productImage && (
                      <div className="error text-red-600 text-[12px]">
                        {formik.errors.productImage}
                      </div>
                    )}
                    {badImg.status && (
                      <div className="error text-red-600 text-[12px]">
                        {badImg.message}
                      </div>
                    )}
                  </div>
                </div>    
              <button type="submit" className="userUpdateButton bg-ek-green text-white py-2 px-4 self-start rounded-md hover:bg-ek-light transition-all">
                {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Create'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.section>
  )
}

export default NewProduct;
