// import { useState } from "react";
// import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import { ImSpinner3 } from 'react-icons/im';
// import { useSelector, useDispatch } from "react-redux";
// import { MdArrowBack } from "react-icons/md";
// import { motion } from "framer-motion";
// import Top from "../Dashboard/Top";
// import { addProduction, fetchProductions } from "../../redux/reducer/productionAction";
// // import { toast } from "react-toastify";

// // const options = {
// //   theme: 'light',
// //   position: 'top-right',
// //   hideProgressBar: false,
// //   closeOnClick: true,                                                                     
// // }

// const NewRecord = () => {
//   const { employees } = useSelector((state) => state.employee);
//   const { products } = useSelector((state) => state.production);
//   const { inventories } = useSelector((state) => state.inventory);

//   const rawMaterialsList = inventories.filter((item) => item.itemType === "raw material") || [];

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const handleGoBack = () => {
//       window.history.back();
//     }
//     console.log({inventories});

//     const initialValues = {
//       confirmedBy: "",
//       process: "",
//       rawMaterials: [
//         { material: "", quantity: "", unit: "", issuedBy: "" },
//       ],
//       productionType: "",
//       headOfOperations: "",
//       unit: "",
//       teamMembers: [
//         { employeeId: "" },
//       ]
//     };
  
//     const validationSchema = Yup.object({
//       confirmedBy: Yup.string()
//       .required('Inspecting officer is required')
//       .test(
//         'is-not-team-member',
//         'The inspector cannot be a team member',
//         function (value) {
//           const { teamMembers } = this.parent;
//           return !teamMembers.some(member => member.employeeId === value);
//         }
//       ),
//       productionType: Yup.string().required("Product type is required"),
//       process: Yup.string().when('productionType', (productionType, schema) => {
//         if (productionType[0] === '677cdca273ed278fd2d5a181') {
//           return schema.required('Process is required');
//         }
//         return schema.notRequired();
//       }),
//       headOfOperations: Yup.string().required("Head of operations is required"),
//       rawMaterials: Yup.array().of(
//         Yup.object().shape({
//           material: Yup.string().required('Material is required'),
//           quantity: Yup.number()
//             .required('Quantity is required')
//             .test('maxQuantity', 'Quantity exceeds available balance', function (value) {
//               const { material } = this.parent;
//               const selectedMaterial = rawMaterialsList.find(item => item._id === material);
//               return selectedMaterial ? value <= selectedMaterial.locations[0]?.closingBalance : true;
//             }),
//           unit: Yup.string().required('Unit is required'),
//           issuedBy: Yup.string().required('Issuer is required'),
//         })
//       ),
//       unit: Yup.string().required("Unit is required"),
//       teamMembers: Yup.array().of(
//         Yup.object({
//           employeeId: Yup.string().required('Employee is required'),
//         }),
//       )
//     });
  
//     const onSubmit = (values) => {
//       setLoading(true);
//       console.log(values);
//       const res = dispatch(addProduction(values));
//       dispatch(fetchProductions());
//       if (res) {
//         setLoading(false);
//         navigate("/production");
//       }
//       setLoading(false);
//     };
  
//     return (
//       <motion.section className="max-w-full"
//         initial={{ opacity: 0, x: '-20%' }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: '100%' }}
//         transition={{ delay: 0.1 }}
//       >
//         <Top title="Production" text="Manage and Monitor Production Details" />
//         <section className="user">
//           <div className="action-nav flex justify-between items-center">
//             <motion.article
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               transition={{ type: 'spring', stiffness: 60 }}
//               className="back flex items-center gap-4 text-2xl"
//             >
//               <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
//               <span className="font-medium">New Production Record</span>
//             </motion.article>
//           </div>
//           <div className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             validateOnChange={true}
//             validateOnBlur={true}
//           >
//             {({ values }) => (
//               <Form>
//               <div className="flex flex-col relative mb-5">
//                   <label className="font-semibold">Product Type:</label>
//                   <Field
//                     name="productionType"
//                     as="select"
//                     className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                   >
//                     <option value="">Choose a product</option>
//                     {products && products.length > 0 ? (
//                       products.map((pro) => (
//                         <option
//                           key={pro._id}
//                           value={pro._id}
//                           className="capitalize"
//                           label={pro.product}
//                         />
//                       ))
//                     ) : (
//                       <option disabled>Loading products...</option>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="productionType"
//                     component="div"
//                     className="text-red-600 text-sm absolute top-16"
//                   />
//                 </div>
//                 {values.productionType === "677cdca273ed278fd2d5a181" && (
//                   <div className="flex flex-col relative mb-5">
//                     <label className="font-semibold">Process:</label>
//                     <Field
//                       name="process"
//                       as="select"
//                       className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                       >
//                       <option value="">Choose a process</option>
//                       <option value="parboiling" label="Parboiling" />
//                       <option value="drying" label="Drying" />
//                       <option value="milling" label="Milling" />
//                       <option value="sealing" label="Bagging/Sealing" />
//                     </Field>
//                     <ErrorMessage
//                       name="process"
//                       component="div"
//                       className="text-red-600 text-sm absolute top-16"
//                     />
//                   </div>
//                 )}
//                 <div className="flex flex-col relative mb-5">
//                   <label className="font-semibold">Inspecting Officer:</label>
//                   <Field
//                     name="confirmedBy"
//                     as="select"
//                     className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                   >
//                     <option value="">Who confirmed the units produced?</option>
//                     {employees && employees.length > 0 ? (
//                       employees.map((user) => (
//                         <option
//                           key={user._id}
//                           value={user._id}
//                           label={`${user.firstName} ${user.lastName} (${user.jobTitle})`}
//                         />
//                       ))
//                     ) : (
//                       <option disabled>Loading employees...</option>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="confirmedBy"
//                     component="div"
//                     className="text-red-600 text-sm absolute top-16"
//                   />
//                 </div>
//                 <div className="flex flex-col relative mb-5">
//                   <label className="font-semibold">Head of Operation:</label>
//                   <Field
//                     name="headOfOperations"
//                     as="select"
//                     className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                   >
//                     <option value="">Who confirmed the units produced?</option>
//                     {employees && employees.length > 0 ? (
//                       employees.map((user) => (
//                         <option
//                           key={user._id}
//                           value={user._id}
//                           label={`${user.firstName} ${user.lastName} (${user.jobTitle})`}
//                         />
//                       ))
//                     ) : (
//                       <option disabled>Loading employees...</option>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="headOfOperations"
//                     component="div"
//                     className="text-red-600 text-sm absolute top-16"
//                   />
//                 </div>
//                 <div className="flex gap-5 mb-5">
//                   <div className="flex flex-col relative mb-5">
//                     <label className="font-semibold">Production Output:</label>
//                     <Field
//                       name="quantity"
//                       type="number"
//                       placeholder="Quantity produced"
//                       className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                     />
//                     <ErrorMessage
//                       name="quantity"
//                       component="div"
//                       className="text-red-600 text-sm absolute top-16"
//                     />
//                   </div>
//                   <div className="flex flex-col relative mb-5">
//                     <label className="font-semibold">Production Unit:</label>
//                     <Field
//                       name="unit"
//                       as="select"
//                       className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                     >
//                       <option value="">Select unit</option>
//                       <option value="ltrs" label="Litres (ltrs)" />
//                       <option value="kg" label="Kilograms (kg)" />
//                       <option value="bags" label="Bags" />
//                       <option value="pcs" label="Pieces (pcs)" />
//                     </Field>
//                     <ErrorMessage
//                       name="unit"
//                       component="div"
//                       className="text-red-600 text-sm absolute top-16"
//                     />
//                   </div>
//                 </div>
  
//                 <FieldArray name="rawMaterials">
//                   {({ push, remove }) => (
                    
//                     <div>
//                   {values.rawMaterials.map((_, index) => {
//                     const selectedMaterial = rawMaterialsList.find(
//                       item => item._id === values.rawMaterials[index].material
//                     );

//                     return (
//                       <div
//                         key={index}
//                         className="grid grid-cols-2 items-center gap-6 mb-4 border-b pb-4"
//                       >
//                         <div className="flex flex-col relative">
//                           <label className="font-semibold">Raw material:</label>
//                           <Field
//                             as="select"
//                             name={`rawMaterials.${index}.material`}
//                             className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                           >
//                             <option value="" label="Select raw material" />
//                             {rawMaterialsList.map(raw => (
//                               <option
//                                 key={raw._id}
//                                 value={raw._id}
//                                 label={`${raw.itemName} (${raw.unit})`}
//                               />
//                             ))}
//                           </Field>
//                           <ErrorMessage
//                             name={`rawMaterials.${index}.material`}
//                             component="div"
//                             className="text-red-600 text-sm absolute top-16"
//                           />
//                         </div>
//                         <div className="flex flex-col relative">
//                           <label className="font-semibold">Quantity:</label>
//                           <Field
//                             name={`rawMaterials.${index}.quantity`}
//                             type="number"
//                             placeholder={`Max: ${
//                               selectedMaterial?.locations[0]?.closingBalance || 0
//                             }`}
//                             className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                           />
//                           <ErrorMessage
//                             name={`rawMaterials.${index}.quantity`}
//                             component="div"
//                             className="text-red-600 text-sm absolute top-16"
//                           />
//                         </div>
//                           <div className="flex flex-col relative">
//                             <label className="font-semibold">Unit:</label>
//                             <Field
//                               as="select"
//                               name={`rawMaterials.${index}.unit`}
//                               className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                             >
//                               <option value="" label="Select unit" />
//                               <option value="ltrs" label="Litres (ltrs)" />
//                               <option value="kg" label="Kilograms (kg)" />
//                               <option value="bags" label="Bags" />
//                               <option value="pcs" label="Pieces (pcs)" />
//                             </Field>
//                             <ErrorMessage
//                               name={`rawMaterials.${index}.unit`}
//                               component="div"
//                               className="text-red-600 text-sm absolute top-16"
//                             />
//                           </div>
//                           <div className="flex flex-col relative">
//                             <label className="font-bold text-ek-deep">Issued By:</label>
//                             <Field
//                               name={`rawMaterials.${index}.issuedBy`}
//                               as="select"
//                               className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                             >
//                               <option value="">Select Issuer</option>
//                               {employees && employees.length > 0 ? (
//                                 employees.map((user) => (
//                                   <option
//                                     key={user._id}
//                                     value={user._id}
//                                     label={`${user.firstName} ${user.lastName} (${user.jobTitle})`}
//                                   />
//                                 ))
//                               ) : (
//                                 <option disabled>Loading employees...</option>
//                               )}
//                             </Field>
//                             <ErrorMessage
//                               name={`rawMaterials.${index}.issuedBy`}
//                               component="div"
//                               className="text-red-600 text-sm absolute top-16"
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => remove(index)}
//                             className="bg-ek-list text-white p-2 w-fit rounded hover:bg-red-600 opacity-60"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       );
//                       })}
//                       <button
//                         type="button"
//                         className={`bg-ek-dark opacity-60 text-white p-2 rounded-md ${
//                           values.rawMaterials.some(
//                             (item) =>
//                               !item.material ||
//                               !item.quantity ||
//                               !item.unit ||
//                               !item.issuedBy
//                           )
//                             ? "opacity-50 cursor-not-allowed"
//                             : "hover:bg-green-700"
//                         }`}
//                         onClick={() =>
//                           push({
//                             material: "",
//                             quantity: "",
//                             unit: "",
//                             issuedBy: "",
//                           })
//                         }
//                       >
//                         Add raw material
//                       </button>
//                     </div>
//                   )}
//                 </FieldArray>

//                 <FieldArray name="teamMembers">
//                 {({ push, remove }) => (
//                     <div>
//                       <h2 className="font-bold mt-7">Production Team Members:</h2>
//                       {values.teamMembers.map((_, index) => (
//                         <div
//                           key={index}
//                           className="grid grid-cols-2 items-center gap-6 mb-4 border-b pb-4"
//                         >
//                           <div className="flex flex-col relative">
//                             <Field
//                               name={`teamMembers.${index}.employeeId`}
//                               as="select"
//                               className="bg-white border-2 rounded-md focus:outline-ek-green p-1 px-2"
//                             >
//                               <option value="">Select Team Staff</option>
//                               {employees && employees.length > 0 ? (
//                                 employees.map((user) => (
//                                   <option
//                                     key={user._id}
//                                     value={user._id}
//                                     label={`${user.firstName} ${user.lastName} (${user.jobTitle})`}
//                                   />
//                                 ))
//                               ) : (
//                                 <option disabled>Loading employees...</option>
//                               )}
//                             </Field>
//                             <ErrorMessage
//                               name={`teamMembers.${index}.employeeId`}
//                               component="div"
//                               className="text-red-600 text-sm absolute top-16"
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => remove(index)}
//                             className="bg-ek-list text-white p-2 rounded w-fit hover:bg-red-600 opacity-60"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         className={`bg-ek-dark opacity-60 text-white p-2 rounded-md ${
//                           values.teamMembers.some((item) => !item.employeeId)
//                             ? "opacity-50 cursor-not-allowed"
//                             : "hover:bg-green-700"
//                         }`}
//                         onClick={() =>
//                           push({
//                             employeeId: "",
//                           })
//                         }
//                       >
//                         Add Team Member
//                       </button>
//                     </div>
//                   )}
//                 </FieldArray>

//                 <button
//                   type="submit"
//                   className="bg-ek-deep text-white px-6 py-2 mt-6 rounded hover:bg-ek-green"
//                 >
//                  {loading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Submit'}
//                 </button>
//               </Form>
//             )}
//           </Formik>
//           </div>
//         </section>
//       </motion.section>
//     );
//   };

// export default NewRecord;
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Course title is required"),
  price: Yup.string().required("Price is required"),
  level: Yup.string().required("Level is required"),
  mode: Yup.string().required("Mode is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.string().required("Course avatar is required"),
  modules: Yup.array().of(
    Yup.object({
      subtopic: Yup.string().required("Module title is required"),
      description: Yup.string().required("Module description is required"),
      link: Yup.string().url("Invalid URL").required("Video link is required"),
      img: Yup.string().required("Module avatar is required"),
      assessments: Yup.array().of(
        Yup.object({
          questions: Yup.array().of(
            Yup.string().required("Question is required")
          ),
          options: Yup.array().of(
            Yup.array().of(Yup.string().required("Option is required"))
          ),
          answers: Yup.array().of(
            Yup.array().of(Yup.string().required("Answer is required"))
          ),
        })
      ),
    })
  ),
});

const CreateCourse = () => {
  const initialValues = {
    title: "",
    price: "",
    level: "",
    mode: "",
    description: "",
    image: "",
    modules: [],
  };

  const handleSubmit = (values) => {
    alert("Submitted Data: " + JSON.stringify(values, null, 2));
    console.log("Submitted Data: ", values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <Form>
          <div>
            <label>Course Title</label>
            <Field name="title" />
            {touched.title && errors.title && <div>{errors.title}</div>}
          </div>

          <div>
            <label>Price</label>
            <Field name="price" />
            {touched.price && errors.price && <div>{errors.price}</div>}
          </div>

          <div>
            <label>Level</label>
            <Field as="select" name="level">
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Field>
            {touched.level && errors.level && <div>{errors.level}</div>}
          </div>

          <div>
            <label>Mode</label>
            <Field as="select" name="mode">
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </Field>
            {touched.mode && errors.mode && <div>{errors.mode}</div>}
          </div>

          <div>
            <label>Description</label>
            <Field as="textarea" name="description" />
            {touched.description && errors.description && (
              <div>{errors.description}</div>
            )}
          </div>

          <div>
            <label>Course Avatar</label>
            <Field name="image" />
            {touched.image && errors.image && <div>{errors.image}</div>}
          </div>

          <FieldArray name="modules">
            {({ push, remove }) => (
              <div>
                <h3>Modules</h3>
                {values.modules.map((module, index) => (
                  <div key={index}>
                    <h4>Module {index + 1}</h4>

                    <div>
                      <label>Subtopic</label>
                      <Field name={`modules[${index}].subtopic`} />
                      {errors.modules?.[index]?.subtopic && (
                        <div>{errors.modules[index].subtopic}</div>
                      )}
                    </div>

                    <div>
                      <label>Module Description</label>
                      <Field as="textarea" name={`modules[${index}].description`} />
                      {errors.modules?.[index]?.description && (
                        <div>{errors.modules[index].description}</div>
                      )}
                    </div>

                    <div>
                      <label>Video Link</label>
                      <Field name={`modules[${index}].link`} />
                      {errors.modules?.[index]?.link && (
                        <div>{errors.modules[index].link}</div>
                      )}
                    </div>

                    <div>
                      <label>Module Avatar</label>
                      <Field name={`modules[${index}].img`} />
                      {errors.modules?.[index]?.img && (
                        <div>{errors.modules[index].img}</div>
                      )}
                    </div>

                    <FieldArray name={`modules[${index}].assessments`}>
                      {({ push, remove }) => (
                        <div>
                          <h5>Assessments</h5>
                          {module.assessments?.map((assessment, aIndex) => (
                            <div key={aIndex}>
                              <h6>Assessment {aIndex + 1}</h6>

                              <FieldArray
                                name={`modules[${index}].assessments[${aIndex}].questions`}
                              >
                                {({ push, remove }) => (
                                  <div>
                                    <h6>Questions</h6>
                                    {assessment.questions?.map((_, qIndex) => (
                                      <div key={qIndex}>
                                        <Field
                                          name={`modules[${index}].assessments[${aIndex}].questions[${qIndex}]`}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => remove(qIndex)}
                                        >
                                          Remove Question
                                        </button>
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => push("")}>
                                      Add Question
                                    </button>
                                  </div>
                                )}
                              </FieldArray>

                              <FieldArray
                                name={`modules[${index}].assessments[${aIndex}].options`}
                              >
                                {({ push, remove }) => (
                                  <div>
                                    <h6>Options</h6>
                                    {assessment.options?.map((_, oIndex) => (
                                      <div key={oIndex}>
                                        <Field
                                          name={`modules[${index}].assessments[${aIndex}].options[${oIndex}]`}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => remove(oIndex)}
                                        >
                                          Remove Option
                                        </button>
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => push("")}>
                                      Add Option
                                    </button>
                                  </div>
                                )}
                              </FieldArray>

                              <FieldArray
                                name={`modules[${index}].assessments[${aIndex}].answers`}
                              >
                                {({ push, remove }) => (
                                  <div>
                                    <h6>Answers</h6>
                                    {assessment.answers?.map((_, ansIndex) => (
                                      <div key={ansIndex}>
                                        <Field
                                          name={`modules[${index}].assessments[${aIndex}].answers[${ansIndex}]`}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => remove(ansIndex)}
                                        >
                                          Remove Answer
                                        </button>
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => push("")}>
                                      Add Answer
                                    </button>
                                  </div>
                                )}
                              </FieldArray>

                              <button type="button" onClick={() => remove(aIndex)}>
                                Remove Assessment
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              push({ questions: [], options: [], answers: [] })
                            }
                          >
                            Add Assessment
                          </button>
                        </div>
                      )}
                    </FieldArray>

                    <button type="button" onClick={() => remove(index)}>
                      Remove Module
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    push({
                      subtopic: "",
                      description: "",
                      link: "",
                      img: "",
                      assessments: [],
                    })
                  }
                >
                  Add Module
                </button>
              </div>
            )}
          </FieldArray>

          <button type="submit">Create Course</button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateCourse;
