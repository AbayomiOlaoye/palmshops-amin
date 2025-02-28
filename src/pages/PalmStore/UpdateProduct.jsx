import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import { MdArrowBack } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { useDropzone } from 'react-dropzone';
import { updateproductStock, deleteProduct } from "../../redux/reducer/productAction";
import { auth } from '../../apiCall';
import Top from "../Dashboard/Top";

const UpdateStaff = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [staffData, setStaffData] = useState({});
  const [badImg, setBadImg] = useState({ status: false, message: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    const fetchStaff = async () => {
    const {data} = await auth.get(`/products/${id}`)
      setStaffData(data);
      formik.setValues(data);
      setIsLoading(false);
    };
    fetchStaff();
  }, [id]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    inStock: Yup.boolean().required('In stock is required'),
    metric: Yup.string().required('Unit is required'),
    price: Yup.number().required('Price is required'),
    rating: Yup.number().required('Rating is required'),
    productImage: Yup.string().required('Image is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      inStock: true,
      metric: '',
      price: '',
      rating: '',
      productImage: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      dispatch(updateproductStock(values))
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

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    navigate('/products');
  };

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
    maxSize: 3072000,
  });

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      acceptedFiles.map(async (file) => {
        const base64Image = await convertToBase64(file);
        formik.setFieldValue('productImage', base64Image);
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
            <span className="font-medium">Product Information</span>
          </motion.article>
          <article className="other-actions flex gap-3">
            <button
              type="button"
              onClick={() => handleDelete(staffData?._id)}
              className="bg-red-500 mt-1 text-white p-2 px-3 hover:bg-opacity-75 transition-all flex items-center rounded"
            >
              Delete
            </button>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-1 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <div className="userShow border-b pb-10 mb-10">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="userInfo flex gap-4">
                <div className="work flex flex-col gap-1">
                  <div className="info flex gap-24">
                    <span className="w-[150px] font-bold">Product Name:</span>
                    <span className="capitalize">{staffData?.title}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px] font-bold">Product ID:</span>
                    <span className="capitalize">{staffData?.productId}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px] font-bold">Price:</span>
                    <span>{`₦${staffData?.price.toLocaleString()}`}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px] font-bold">Unit:</span>
                    <span className="capitalize">{staffData?.metric}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px] font-bold">Rating:</span>
                    <span className="capitalize">{staffData?.rating}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px] font-bold">In Stock:</span>
                    <span className="capitalize">{staffData?.inStock === true ? 'In Stock' : 'Out of Stock' }</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px] font-bold">Description:</span>
                    <span className="capitalize">{staffData?.description}</span>
                  </div>
                </div>
                <div className="work flex flex-col gap-1">
                  <div className="info flex max-w-[80%] gap-24 mb-4">
                    {staffData?.productImage && (
                      <img src={staffData?.productImage} alt="Our staff"  />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="userUpdate">
            <h4 className="userUpdateTitle text-ek-deep font-extrabold">Edit</h4>
            <form onSubmit={formik.handleSubmit} className="userUpdateForm flex flex-col gap-4">
              <div className="userUpdateLeft grid grid-cols-2 gap-2 gap-x-8 mt-4">
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="title" className="text-sm font-bold">Product Name</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Product Name"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                    {...formik.getFieldProps('title')}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-600 text-sm">{formik.errors.title}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="price" className="text-sm font-bold">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Price"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                    {...formik.getFieldProps('price')}
                  />
                  {formik.touched.price && formik.errors.price ? (
                    <div className="text-red-600 text-sm">{formik.errors.price}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="metric" className="text-sm font-bold">Unit</label>
                  <input
                    type="text"
                    id="metric"
                    name="metric"
                    placeholder="Unit"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                    {...formik.getFieldProps('metric')}
                  />
                  {formik.touched.metric && formik.errors.metric ? (
                    <div className="text-red-600 text-sm">{formik.errors.metric}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="rating" className="text-sm font-bold">Rating</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                    placeholder="Rating"
                    {...formik.getFieldProps('rating')}
                  />
                  {formik.touched.rating && formik.errors.rating ? (
                    <div className="text-red-600 text-sm">{formik.errors.rating}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="inStock" className="text-sm font-bold">In Stock</label>
                  <select id="inStock" name="inStock" className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2" {...formik.getFieldProps('inStock')}>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                  {formik.touched.inStock && formik.errors.inStock ? (
                    <div className="text-red-600 text-sm">{formik.errors.inStock}</div>
                  ) : null}
                </div>

                <div {...getRootProps({ className: 'dropzone border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-ek-green' })}>
                  <input {...getInputProps()} />
                  <p className="text-sm text-gray-500">
                    Drag &apos;n&apos; drop an image here, or click to select files (JPEG/PNG, max 3MB)
                  </p>
                </div>
                <div className="userUpdateItem flex flex-col gap-1">
                  <label htmlFor="description" className="text-sm font-bold">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    className="userUpdateInput border-2 rounded-md focus:outline-ek-green p-2"
                    rows={4}
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="text-red-600 text-sm">{formik.errors.description}</div>
                  ) : null}
                </div>

                {formik.values.productImage && (
                  <div className="mt-4">
                    <p className="text-sm font-bold">Image Preview:</p>
                    <img src={formik.values.productImage} alt="Uploaded Preview" className="max-w-full h-32 object-cover mt-2 rounded-lg shadow-md" />
                  </div>
                )}

                {badImg.status && (
                  <div className="text-red-600 text-sm mt-2">{badImg.message}</div>
                )}

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

export default UpdateStaff;
