/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import { ImSpinner3 } from 'react-icons/im';
import { useSelector, useDispatch } from "react-redux";
import { MdArrowBack } from "react-icons/md";
import { motion } from "framer-motion";
import Top from "../Dashboard/Top";
import { auth } from "../../apiCall";
import { toast } from "react-toastify";
import { fetchProducts } from "../../redux/reducer/productionAction";
import { fetchWarehouses } from "../../redux/reducer/inventoryAction";

const options = {
  theme: 'light',
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,                                                                     
}

const NewSales = () => {
  const { products } = useSelector((state) => state?.production);
  const { warehouses } = useSelector((state) => state?.warehouse);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleGoBack = () => {
    window.history.back();
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchWarehouses());
    const fetchCustomers = async () => {
      try {
        const { data } = await auth.get("/customers/all");
        setCustomers(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch customers", options);
      }
    };
    fetchCustomers();
  }, []);

  const initialValues = {
    customer: "",
    items: [
      { product: "", quantity: "", unit: "", rate: "" },
    ],
    method: "",
    amountPaid: "",
    type: "",
    total: 0,
    balance: 0,
  };

  const validationSchema = Yup.object({
    customer: Yup.string().required("Customer is required"),
    items: Yup.array()
      .of(
        Yup.object({
          product: Yup.string().required("Product is required"),
          quantity: Yup.number()
            .required("Quantity is required")
            .min(1, "Must be at least 1"),
          unit: Yup.string().required("Unit is required"),
          rate: Yup.number()
            .required("Price is required")
            .min(1, "Must be at least 1"),
        })
      ).required("Items are required"),
    method: Yup.string().required("Payment method is required"),
    amountPaid: Yup.number()
      .required("Amount paid is required")
      .min(1, "Must be at least 1"),
    type: Yup.string().required("Sales type is required"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await auth.post("/sales", values);
      if (data) {
        setLoading(false);
        toast.success("Sales submitted successfully", options);
        navigate("/sales");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred, please try again", options);
      setLoading(false);
    }
  };

  return (
    <motion.section className="max-w-full"
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
      <Top title="Sales" text="Tracking Sales and  Cash Inflows" />
      <section className="user">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">New Sales Record</span>
          </motion.article>
          <article className="other-actions flex gap-2">
            <Link to="/customers/new" className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">New Customer</Link>
          </article>
        </div>
        <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values, setFieldValue }) => {
            useEffect(() => {
              const total = values.items.reduce(
                (sum, item) => sum + (item.rate || 0) * (item.quantity || 0),
                0
              );
              setFieldValue("total", total);
              setFieldValue("balance", total - (values.amountPaid || 0));
            }, [values.items, values.amountPaid, setFieldValue]);

            return (
              <Form>
              <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col relative mb-5">
                  <label className="font-semibold">Sales Location:</label>
                  <Field
                    name="warehouse"
                    as="select"
                    className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">Choose location</option>
                    {warehouses && warehouses.length > 0 ? (
                      warehouses.map((user) => (
                        <option
                          key={user._id}
                          value={user._id}
                          label={`${user?.name} (${user?.manager?.firstName} ${user?.manager?.lastName})`}
                        />
                      ))
                    ) : (
                      <option disabled>Loading vendors...</option>
                    )}
                  </Field>
                  <ErrorMessage
                    name="warehouse"
                    component="div"
                    className="text-red-600 text-sm absolute top-16"
                  />
                </div>
                <div className="flex flex-col relative mb-5">
                  <label className="font-semibold">Customer:</label>
                  <Field
                    name="customer"
                    as="select"
                    className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">Choose Buyer</option>
                    {customers && customers.length > 0 ? (
                      customers.map((user) => (
                        <option
                          key={user._id}
                          value={user._id}
                          label={user.name}
                        />
                      ))
                    ) : (
                      <option disabled>Loading customers...</option>
                    )}
                  </Field>
                  <ErrorMessage
                    name="customer"
                    component="div"
                    className="text-red-600 text-sm absolute top-16"
                  />
                </div>
              </article>
              <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col relative mb-5">
                  <label className="font-bold text-ek-deep">Type of Sales:</label>
                  <Field
                    name="type"
                    as="select"
                    className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">Select sales type</option>
                    <option value="cash">Cash Sales</option>
                    <option value="cash-and-credit">Mixed Sales (Cash and Credit)</option>
                    <option value="credit">Credit Sales</option>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-600 text-sm absolute top-16"
                  />
                </div>
                <div className="flex flex-col relative mb-5">
                  <label className="font-bold text-ek-deep">Method of payment:</label>
                  <Field
                    name="method"
                    as="select"
                    className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                  >
                    <option value="">Select method of payment</option>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="cash-and-bank">Cash and Bank</option>
                    <option value="part-payment">Part-payment</option>
                    <option value="not-yet-paid">No payment yet</option>
                  </Field>
                  <ErrorMessage
                    name="method"
                    component="div"
                    className="text-red-600 text-sm absolute top-16"
                  />
                </div>
              </article>
              <FieldArray name="items">
                {({ push, remove }) => (
                  <div>
                    {values.items.map((_, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 mb-4 border-b pb-4"
                      >
                        <div className="flex flex-col relative mb-5">
                          <label className="font-semibold">Product Item:</label>
                          <Field
                            as="select"
                            name={`items.${index}.product`}
                            className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                            onChange={(e) => {
                              const selectedProduct = products.find(
                                (product) => product._id === e.target.value
                              );
                                setFieldValue(`items.${index}.product`, e.target.value);
                              if (selectedProduct) {
                                setFieldValue(`items.${index}.rate`, selectedProduct.price);
                              } else {
                                setFieldValue(`items.${index}.rate`, "");
                              }
                            }}
                          >
                            <option value="">Select product</option>
                            {products && products.length > 0 ? (
                              products.map((product) => (
                                <option
                                  key={product._id}
                                  value={product._id}
                                  label={product.product}
                                />
                              ))
                            ) : (
                              <option disabled>Loading products...</option>
                            )}
                          </Field>
                          <ErrorMessage
                            name={`items.${index}.product`}
                            component="div"
                            className="text-red-600 text-sm absolute top-16"
                          />
                        </div>
                        <div className="flex flex-col relative mb-5">
                          <label className="font-semibold">Quantity:</label>
                          <Field
                            name={`items.${index}.quantity`}
                            type="number"
                            placeholder="Quantity"
                            className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                          />
                          <ErrorMessage
                            name={`items.${index}.quantity`}
                            component="div"
                            className="text-red-600 text-sm absolute top-16"
                          />
                        </div>
                        <div className="flex flex-col relative mb-5">
                          <label className="font-semibold">Unit:</label>
                          <Field
                            as="select"
                            name={`items.${index}.unit`}
                            className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                          >
                            <option value="" label="Select unit" />
                            <option value="ltrs" label="Litres (ltrs)" />
                            <option value="kg" label="Kilograms (kg)" />
                            <option value="5kgs" label="Bags (5kgs)" />
                            <option value="10kgs" label="Bags (10kgs)" />
                            <option value="15kg" label="Bags (15kgs)" />
                            <option value="25kg" label="Bags (25kgs)" />
                            <option value="50kg" label="Bags (50kgs)" />
                            <option value="75kg" label="Bags (75kgs)" />
                            <option value="100kg" label="Bags (100kgs)" />
                            <option value="110kg" label="Bags (110kgs)" />
                            <option value="pcs" label="Pieces (pcs)" />
                          </Field>
                          <ErrorMessage
                            name={`items.${index}.unit`}
                            component="div"
                            className="text-red-600 text-sm absolute top-16"
                          />
                        </div>
                        <div className="flex flex-col relative mb-5">
                          <label className="font-semibold">Price/Unit:</label>
                          <Field
                            name={`items.${index}.rate`}
                            type="number"
                            placeholder="Rate"
                            className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                          />
                          <ErrorMessage
                            name={`items.${index}.rate`}
                            component="div"
                            className="text-red-600 text-sm absolute top-16"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-ek-list text-white px-4 py-2 rounded hover:bg-red-600 opacity-60"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className={`bg-ek-dark opacity-60 text-white py-2 px-4 rounded-md ${
                        values.items.some(
                          (item) =>
                            !item.product ||
                            !item.quantity ||
                            !item.unit ||
                            !item.rate
                        )
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-green-700"
                      }`}
                      disabled={values.items.some(
                        (item) =>
                          !item.product || !item.quantity || !item.unit || !item.rate
                      )}
                      onClick={() =>
                        push({
                          product: "",
                          quantity: "",
                          unit: "",
                          rate: "",
                        })
                      }
                    >
                      Add Product
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="flex flex-col relative mb-5">
                <label className="font-semibold">Total:</label>
                <Field
                  name="total"
                  type="number"
                  disabled
                  placeholder="Total cost of all items"
                  className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                />
              </div>

              <div className="flex flex-col relative mb-5">
                <label className="font-semibold">Amount Paid:</label>
                <Field
                  name="amountPaid"
                  type="number"
                  placeholder="Amount paid"
                  className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                />
                <ErrorMessage
                  name="amountPaid"
                  component="div"
                  className="text-red-600 text-sm absolute top-16"
                />
              </div>
              <div className="flex flex-col relative mb-5">
                <label className="font-semibold">To balance up:</label>
                <Field
                  name="balance"
                  type="number"
                  placeholder="Balance (Debt)"
                  className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
                />
              </div>

              <button
                type="submit"
                className="bg-ek-deep text-white px-6 py-2 mt-6 rounded hover:bg-ek-green"
              >
               {loading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Submit'}
              </button>
            </Form>
            );
          }}
        </Formik>
        </div>
      </section>
    </motion.section>
  );
};

export default NewSales;
