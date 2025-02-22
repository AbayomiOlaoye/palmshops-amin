import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useDropzone } from 'react-dropzone';
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";
import { updateCourse } from "../../redux/reducer/courseActions";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const UpdateCourse = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { courses } = useSelector((state) => state.courses);
  const [isLoading, setIsLoading] = useState(false);
  const [badImg, setBadImg] = useState({ status: false, message: '' });
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [editingAssessmentIndex, setEditingAssessmentIndex] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [isAddAssessmentDialogOpen, setIsAddAssessmentDialogOpen] = useState(false);

  useEffect(() => {
    const course = courses.find((course) => course._id === id);
    setCourse(course);
  }, [courses, id]);

  const handleGoBack = () => {
    window.history.back();
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Course title is required'),
    price: Yup.string().required('Price is required'),
    level: Yup.string().required('Level is required'),
    mode: Yup.string().required('Mode is required'),
    description: Yup.string().required('Description is required'),
    image: Yup.string().required('Course avatar is required'),
    modules: Yup.array().of(
      Yup.object({
        subtopic: Yup.string().required('Module title is required'),
        description: Yup.string().required('Module description is required'),
        link: Yup.string().url('Invalid URL').required('Video link is required'),
        img: Yup.string().required('Module avatar is required'),
        assessments: Yup.array().of(
          Yup.object({
            questions: Yup.array().of(Yup.string().required('Question is required')),
            options: Yup.array().of(
              Yup.array().of(Yup.string().required('Option is required'))
            ),
            answers: Yup.array().of(
              Yup.array().of(Yup.string().required('Answer is required'))
            ),
          })
        ),
      })
    ),
  });

  const formik = useFormik({
    initialValues: course || {
      title: '',
      price: '',
      level: '',
      mode: '',
      description: '',
      image: '',
      modules: [],
    },
    validationSchema,
    onSubmit: (values) => {
      if (values) {
        console.log({ values });
        return;
      }
      setIsLoading(true);
      dispatch(updateCourse(id, values));
      setIsLoading(false);
      setIsEditDialogOpen(false);
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (Object.keys(formik.errors.length > 0 || badImg.status)) {
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
        formik.setFieldValue('image', base64Image);
        formik.setFieldValue('img', base64Image);
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

  const handleEdit = (moduleIndex, assessmentIndex, questionIndex) => {
    setEditingModuleIndex(moduleIndex);
    setEditingAssessmentIndex(assessmentIndex);
    setEditingQuestionIndex(questionIndex);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingModuleIndex(null);
    setEditingAssessmentIndex(null);
    setEditingQuestionIndex(null)
  };

  const handleOpenAddAssessmentDialog = () => {
    setIsAddAssessmentDialogOpen(true);
};

const handleCloseAddAssessmentDialog = () => {
    setIsAddAssessmentDialogOpen(false);
};
const handleAddAssessment = (moduleIndex, assessmentsArrayHelpers) => {
assessmentsArrayHelpers.push({
    questions: [""],
    options: [["", "", "", ""]],
    answers: [[""]],
});
    setIsAddAssessmentDialogOpen(false)
};

  return (
    <motion.section className="max-w-full"
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
      <section className="user">
        <div className="action-nav flex justify-between items-center p-10">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Update Course Information</span>
          </motion.article>
        </div>
        <FormikProvider value={formik} className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <form onSubmit={formik.handleSubmit} className="userUpdateForm bg-white flex flex-col gap-6">
            <section className="userUpdateLeft grid grid-cols-3 gap-10 item-center p-8 py-10">
              <article className="userUpdateLeft gap-6 flex flex-col col-span-2 mt-4">
                <h1 className="text-xl font-bold mb-5">Update Course</h1>
                <div className="userUpdateItem relative flex gap-10">
                  <label className="capitalize font-semibold w-[180px]">Course Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values?.title}
                    onChange={formik.handleChange}
                    placeholder="Fundamentals of Agric-Science"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched?.title && formik.errors?.title ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors?.title}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex relative gap-10">
                  <label className="capitalize font-semibold w-[180px]">Price:</label>
                  <input
                    type="text"
                    name="price"
                    value={formik.values?.price}
                    onChange={formik.handleChange}
                    placeholder="15000 (in Naira) OR 0 (for free)"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md w-[80%] focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched?.price && formik.errors?.price ? (
                    <div className="error text-red-600 absolute top-16 text-[12px]">{formik.errors?.price}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex relative gap-10">
                  <label className="capitalize font-semibold w-[180px]">Level:</label>
                  <input
                    type="text"
                    name="level"
                    value={formik.values?.level}
                    onChange={formik.handleChange}
                    placeholder="Beginner, Intermediate, Advanced"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched?.level && formik.errors?.level ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors?.level}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex relative gap-10">
                  <label className="capitalize font-semibol w-[180px]">Mode:</label>
                  <input
                    type="text"
                    name="mode"
                    value={formik.values?.mode}
                    onChange={formik.handleChange}
                    placeholder="Online, Offline, Hybrid"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched?.mode && formik.errors?.mode ? (
                    <div className="error text-red-600 absolute top-16 text-[12px]">{formik.errors?.mode}</div>
                  ) : null}
                </div>
                <div className="userUpdateItem flex relative gap-10">
                  <label className="capitalize font-semibold w-[180px]">Description:</label>
                  <textarea
                    name="despription"
                    value={formik.values?.description}
                    onChange={formik.handleChange}
                    rows={5}
                    placeholder="Beginner, Intermediate, Advanced"
                    onBlur={formik.handleBlur}
                    className="userUpdateInput border-2 rounded-md w-[80%] focus:outline-ek-green p-1 px-2"
                  />
                  {formik.touched?.description && formik.errors?.description ? (
                    <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors?.description}</div>
                  ) : null}
                </div>
              </article>
              <article className="work flex flex-col gap-1 pt-10 items-center">
                <h4 className="text-center p-2 font-bold">Course Avatar</h4>
                <div className="mt-4">
                  <img src={formik.values?.image} alt="Uploaded Preview" className="max-w-full object-cover rounded-lg shadow-md" />
                </div>
                <div {...getRootProps({ className: 'dropzone border-2 border-dashed rounded-lg p-4 mt-2 border-ek-lime text-center cursor-pointer hover:border-ek-green' })}>
                  <input {...getInputProps()} />
                  <p className="text-sm text-gray-500">
                    Drag &apos;n&apos; drop an image here, or click to select files (JPEG/PNG, max 1MB)
                  </p>
                </div>

                {badImg.status && (
                  <div className="text-red-600 text-sm mt-2">{badImg.message}</div>
                )}
              </article>
            </section>
            <section className="userUpdateRight grid grid-cols-2 gap-10 item-center p-8 py-10">
              <FieldArray name="modules">
                {({ push: addModule, remove }) => (
                  <>
                    {isLoading || !formik.values?.modules ? (
                      <p>Loading modules...</p>
                    ) : (
                      formik.values?.modules?.map((module, moduleIndex) => (
                        <article key={moduleIndex + 1} className="userUpdateRight gap-6 flex flex-col col-span-2 mt-4">
                          <h1 className="text-xl font-bold mb-5">Module {moduleIndex + 1}</h1>
                          <div className="userUpdateItem relative flex gap-10">
                            <label className="capitalize font-semibold w-[180px]">Module Title:</label>
                            <input
                              type="text"
                              name={`modules.${moduleIndex}.subtopic`}
                              value={module.subtopic}
                              onChange={formik.handleChange}
                              placeholder="Introduction to Agric-Science"
                              onBlur={formik.handleBlur}
                              className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                            />
                            {formik.touched?.modules?.[moduleIndex]?.subtopic && formik.errors?.modules?.[moduleIndex]?.subtopic ? (
                              <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.modules?.[moduleIndex]?.subtopic}</div>
                            ) : null}
                          </div>
                          <div className="userUpdateItem flex relative gap-10">
                            <label className="capitalize font-semibold w-[180px]">Module Description:</label>
                            <textarea
                              type="text"
                              name={`modules.${moduleIndex}.description`}
                              value={module.description}
                              onChange={formik.handleChange}
                              placeholder="Introduction to Agric-Science"
                              onBlur={formik.handleBlur}
                              className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                            />
                            {formik.touched.modules?.[moduleIndex]?.description && formik.errors.modules?.[moduleIndex]?.description ? (
                              <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.modules?.[moduleIndex]?.description}</div>
                            ) : null}
                          </div>
                          <div className="userUpdateItem flex relative gap-10">
                            <label className="capitalize font-semibold w-[180px]">Module Video Link:</label>
                            <input
                              type="text"
                              name={`modules.${moduleIndex}.link`}
                              value={module.link}
                              onChange={formik.handleChange}
                              placeholder="https://www.youtube.com/watch/..."
                              onBlur={formik.handleBlur}
                              className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                            />
                            {formik.touched.modules?.[moduleIndex]?.link && formik.errors.modules?.[moduleIndex]?.link ? (
                              <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.modules?.[moduleIndex]?.link}</div>
                            ) : null}
                          </div>
                          <div className="userUpdateItem flex relative gap-10">
                            <label className="capitalize font-semibold w-[180px]">Module Avatar:</label>
                            <input
                              type="text"
                              name={`modules.${moduleIndex}.img`}
                              value={module.img}
                              onChange={formik.handleChange}
                              placeholder="https://www.image.com/..."
                              onBlur={formik.handleBlur}
                              className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                            />
                            {formik.touched.modules?.[moduleIndex]?.img && formik.errors.modules?.[moduleIndex]?.img ? (
                              <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.modules?.[moduleIndex]?.img}</div>
                            ) : null}
                          </div>

                          <article className="work flex flex-col gap-5">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="border border-gray-300 px-4 py-2">S/N</th>
                                  <th className="border border-gray-300 px-4 py-2">Questions</th>
                                  <th className="border border-gray-300 px-4 py-2">Options</th>
                                  <th className="border border-gray-300 px-4 py-2">Answers</th>
                                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {module.assessments.map((assessment, assessmentIndex) =>
                                  assessment.questions.map((question, questionIndex) => (
                                    <tr
                                      key={`${module._id}-${assessmentIndex}-${questionIndex}`}
                                      className="text-left"
                                    >
                                      <td className="border border-gray-300 px-4 py-2 text-center">
                                        {questionIndex + 1}
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2">
                                        {question}
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2">
                                        <ul className="list-disc list-inside">
                                          {assessment.options[questionIndex]?.map(
                                            (option, optionIndex) => (
                                              <li key={optionIndex}>{option}</li>
                                            )
                                          )}
                                        </ul>
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2">
                                        <ul className="list-disc list-inside">
                                          {assessment.answers[questionIndex]?.map(
                                            (answer, answerIndex) => (
                                              <li key={answerIndex}>{answer}</li>
                                            )
                                          )}
                                        </ul>
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleEdit(moduleIndex, assessmentIndex, questionIndex)}
                                          className="text-ek-green underline"
                                        >
                                          Edit
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </article>

                          <article className="work flex gap-5">
                            <button type="button" className='border-2 rounded-lg px-3 py-2 w-fit bg-ek-gray text-white hover:bg-red-500' onClick={() => remove(moduleIndex)}>
                              Remove Module
                            </button>
                            <button
                              type="button"
                              className='border-2 rounded-lg px-3 py-2 self-end hover:bg-ek-green h-fit w-fit text-white bg-ek-light'
                              onClick={() => handleOpenAddAssessmentDialog(moduleIndex)}
                            >
                              Add Assessments
                            </button>
                          </article>
                          <Dialog open={isAddAssessmentDialogOpen} onClose={handleCloseAddAssessmentDialog} fullWidth maxWidth="md">
                            <DialogTitle>Add Assessment</DialogTitle>
                            <DialogContent>
                              {editingModuleIndex !== null && (
                                <FieldArray
                                  name={`modules.${editingModuleIndex}.assessments`}
                                  render={(assessmentsArrayHelpers) => (
                                    <article className="work flex flex-col gap-5">
                                      {formik?.values?.modules[editingModuleIndex]?.assessments?.map((assessment, assessmentIndex) => (
                                        <article key={assessmentIndex} className="flex flex-col gap-5">
                                          <div className="flex gap-5 item-center">
                                            <label className="font-semibold">{`Assessment ${assessmentIndex + 1}`}</label>
                                            <input
                                              type="text"
                                              name={`modules.${editingModuleIndex}.assessments.${assessmentIndex}.questions.0`}
                                              value={assessment.questions[0]}
                                              onChange={formik.handleChange}
                                              placeholder="Enter question"
                                              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green"
                                            />
                                          </div>
                                          <div className="flex gap-5 flex-col">
                                            <label className="font-semibold">Options:</label>
                                            {formik.values?.modules[editingModuleIndex]?.assessments[assessmentIndex]?.options[0]?.map((option, optionIndex) => (
                                              <div key={optionIndex} className="flex gap-5 items-start">
                                                <input
                                                  type="text"
                                                  name={`modules.${editingModuleIndex}.assessments.${assessmentIndex}.options.0.${optionIndex}`}
                                                  value={option}
                                                  onChange={formik.handleChange}
                                                  placeholder="Enter option"
                                                  className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green"
                                                />
                                              </div>
                                            ))}
                                          </div>
                                          <div className="flex gap-5 items-center">
                                            <label className="font-semibold">Answers:</label>
                                            {formik.values?.modules[editingModuleIndex]?.assessments[assessmentIndex]?.answers[0]?.map((answer, answerIndex) => (
                                              <div key={answerIndex} className="flex gap-5">
                                                <input
                                                  type="text"
                                                  name={`modules.${editingModuleIndex}.assessments.${assessmentIndex}.answers.0.${answerIndex}`}
                                                  value={answer}
                                                  onChange={formik.handleChange}
                                                  placeholder="Enter answer"
                                                  className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green" />
                                              </div>
                                            ))}
                                          </div>
                                          <Button onClick={() => handleAddAssessment(editingModuleIndex, assessmentsArrayHelpers)} color="primary">
                                            Add Assessment
                                          </Button>
                                        </article>
                                      ))}
                                    </article>
                                  )}
                                />
                              )}
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseAddAssessmentDialog} color="primary">
                                Close
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </article>
                      ))
                    )}
                    <button
                      type="button"
                      className='border-2 rounded-lg px-3 py-2 self-end hover:bg-ek-green h-fit w-fit text-white bg-ek-light'
                      onClick={() => addModule({ subtopic: "", description: "", link: "", img: "", assessments: [] })}
                      disabled={!formik.values?.modules?.length || formik.values.modules.some(m => !m.subtopic || !m.description || !m.link || !m.img)}
                    >
                      Add Module
                    </button>
                  </>
                )}
              </FieldArray>
            </section>
            <button type="submit" className="userUpdateButton bg-ek-green text-white m-5 py-2 p-4 w-max rounded-md hover:bg-ek-light hover:text-ek-green transition-all">
              {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Save'}
            </button>
            <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="md">
              <DialogTitle>Edit Question</DialogTitle>
              <DialogContent>
                {editingModuleIndex !== null && editingAssessmentIndex !== null && editingQuestionIndex !== null && (
                  <FieldArray
                    name={`modules.${editingModuleIndex}.assessments.${editingAssessmentIndex}.questions`}
                    render={() => (
                      <article className="work flex flex-col gap-5">
                        {formik?.values?.modules[editingModuleIndex]?.assessments[editingAssessmentIndex]?.questions?.map((question, questionIndex) => (
                          questionIndex === editingQuestionIndex ?
                            <article key={questionIndex} className="flex flex-col gap-5">
                              <div className="flex gap-5 item-center">
                                <label className="font-semibold">{`Question ${questionIndex + 1}`}</label>
                                <input
                                  type="text"
                                  name={`modules.${editingModuleIndex}.assessments.${editingAssessmentIndex}.questions.${questionIndex}`}
                                  value={question}
                                  onChange={formik.handleChange}
                                  placeholder="Enter question"
                                  className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green"
                                />
                              </div>
                              <div className="flex gap-5 flex-col">
                                <label className="font-semibold">Options:</label>
                                {formik.values?.modules[editingModuleIndex]?.assessments[editingAssessmentIndex]?.options[questionIndex]?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-5 items-start">
                                    <input
                                      type="text"
                                      name={`modules.${editingModuleIndex}.assessments.${editingAssessmentIndex}.options.${questionIndex}.${optionIndex}`}
                                      value={option}
                                      onChange={formik.handleChange}
                                      placeholder="Enter option"
                                      className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-5 items-center">
                                <label className="font-semibold">Answers:</label>
                                {formik.values?.modules[editingModuleIndex]?.assessments[editingAssessmentIndex]?.answers[questionIndex]?.map((answer, answerIndex) => (
                                  <div key={answerIndex} className="flex gap-5">
                                    <input
                                      type="text"
                                      name={`modules.${editingModuleIndex}.assessments.${editingAssessmentIndex}.answers.${questionIndex}.${answerIndex}`}
                                      value={answer}
                                      onChange={formik.handleChange}
                                      placeholder="Enter answer"
                                      className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green" />
                                  </div>
                                ))}
                              </div>
                            </article>
                            : null
                        ))}
                      </article>
                    )}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </FormikProvider>
      </section>
    </motion.section>
  )
}

export default UpdateCourse;