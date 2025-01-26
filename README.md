# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for 

<FieldArray name={`modules.${moduleIndex}.assessments`}>
                          {({ push: addAssessment, remove }) => (
                            <>
                              {module.assessments.map((assessment, i) => (
                                <section key={i} className="userUpdateItem flex flex-col relative gap-10">
                                  <div className="flex gap-10">
                                    <label className="capitalize font-semibold w-[180px]">Question {i + 1}:</label>
                                    <input
                                      type="text"
                                      name={`modules.${moduleIndex}.assessments.${i}.questions`}
                                      value={formik.values.modules[moduleIndex].assessments[i].questions}
                                      onChange={formik.handleChange}
                                      placeholder="What is the capital of Nigeria?"
                                      onBlur={formik.handleBlur}
                                      className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                                    />
                                    {formik.touched.modules?.[moduleIndex]?.assessments?.[i]?.questions && formik.errors.modules?.[moduleIndex]?.assessments?.[i]?.questions ? (
                                      <div className="error absolute top-16 text-red-600 text-[12px]">{formik.errors.modules?.[moduleIndex]?.assessments?.[i]?.questions}</div>
                                    ) : null}
                                  </div>
                                  <FieldArray name={`modules.${moduleIndex}.assessments.${i}.options`}>
                                    {({ push: addOption, remove }) => (
                                      <section className="flex flex-col gap-10">
                                        {assessment.options.map((option, optionIndex) => (
                                          <div key={optionIndex} className="flex gap-10">
                                            <h5 className="capitalize font-semibold w-[180px]">Option {optionIndex + 1}:</h5>
                                            <input
                                              type="text"
                                              name={`modules.${moduleIndex}.assessments.${i}.options.${optionIndex}`}
                                              value={formik.values.modules[moduleIndex].assessments[i].options[optionIndex]}
                                              onChange={formik.handleChange}
                                              className="userUpdateInput border-2 w-[80%] rounded-md focus:outline-ek-green p-1 px-2"
                                            />
                                            {formik.errors.modules?.[moduleIndex]?.assessments?.[i]?.options?.[optionIndex] && (
                                              <span>{formik.errors.modules[moduleIndex].assessments[i].options[optionIndex]}</span>
                                            )}
                                            <button type="button" onClick={() => remove(optionIndex)}>
                                              Remove Option
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          type="button"
                                          onClick={() => addOption("")}
                                          disabled={assessment.options.length >= 4}
                                        >
                                          Add Option
                                        </button>
                                      </section>
                                    )}
                                  </FieldArray>
                                  <FieldArray name={`modules.${moduleIndex}.assessments.${i}.answers`}>
                                    {({ push: addAnswer, remove }) => (
                                      <>
                                        {assessment.answers.map((answer, answerIndex) => (
                                          <div key={answerIndex} className="relative flex gap-10">
                                            <h5 className="capitalize font-semibold w-[180px]">Answer {answerIndex + 1}:</h5>
                                            <input
                                              type="text"
                                              name={`modules.${moduleIndex}.assessments.${i}.answers.${answerIndex}`}
                                              value={formik.values.modules[moduleIndex].assessments[i].answers[answerIndex]}
                                              onChange={formik.handleChange}
                                            />
                                            {formik.errors.modules?.[moduleIndex]?.assessments?.[i]?.answers?.[answerIndex] && (
                                              <span>{formik.errors.modules[moduleIndex].assessments[i].answers[answerIndex]}</span>
                                            )}
                                            <button type="button" onClick={() => remove(answerIndex)}>
                                              Remove Answer
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          type="button"
                                          onClick={() => addAnswer("")}
                                        >
                                          Add Answer
                                        </button>
                                      </>
                                    )}
                                  </FieldArray>
                                  <button type="button" onClick={() => remove(i)}>
                                    Remove Assessment
                                  </button>
                                </section>
                              ))}
                              <button
                                type="button"
                                onClick={() => addAssessment({ questions: "", options: ["", "", "", ""], answers: [""] })}
                                disabled={!module.assessments.every(a => a.questions && a.options.every(o => o) && a.answers.length)}
                              >
                                Add Assessment
                              </button>
                            </>
                          )}
                        </FieldArray>

<!-- Second solution -->

const UpdateCourse = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { courses } = useSelector((state) => state.courses);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [badImg, setBadImg] = useState({ status: false, message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  console.log(editingIndex);
  const course = courses.find((course) => course._id === id);
  console.log(courses);

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
    initialValues: course,
    validationSchema,
    onSubmit: (values) => {
      if (values) {
        console.log({ values });
        return;
      }
      setIsLoading(true);
      dispatch(updateCourse(id, values));
      setIsLoading(false);
      navigate('/courses/info/' + id);
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleEdit = (index) => {
    console.log(index);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleAddQuestion = (arrayHelpers) => {
    if (formik.values.assessments[editingIndex]?.questions?.length > 0) {
      arrayHelpers.push({
        questions: "",
        options: ["", "", "", ""],
        answers: [],
      });
    }
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
          other parts
        </div>
        <FormikProvider value={formik} className="userContainer grid lg:grid-cols-2 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <form onSubmit={formik.handleSubmit} className="userUpdateForm bg-white flex flex-col gap-6">
            <section className="userUpdateLeft grid grid-cols-3 gap-10 item-center p-8 py-10">
              <article className="userUpdateLeft gap-6 flex flex-col col-span-2 mt-4">
                <h1 className="text-xl font-bold mb-5">Update Course</h1>
                
              </article> 
            </section>
            <section className="userUpdateRight grid grid-cols-3 gap-10 item-center p-8 py-10">
              <FieldArray name="modules">
                {({ push: addModule, remove, }) => (
                  <>
                    {formik.values.modules.map((module, moduleIndex) => (
                      ...other module content here
                        {/* Assessment implementation just as the data structure requires */}
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
                                        onClick={() => handleEdit(assessmentIndex)}
                                        className="text-blue-600 underline"
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
                        {isEditing && (
                          <>
                          <FieldArray
                            name={`modules.${moduleIndex}.assessments.${editingIndex}.questions`}
                            render={(arrayHelpers) => (
                              <article className="work flex flex-col gap-5">
                                {formik.values.modules[moduleIndex].assessments[editingIndex].questions.map((question, questionIndex) => (
                                <>
                                <div key={questionIndex} className="flex gap-5">
                                    <input
                                      type="text"
                                      name={`modules.${moduleIndex}.assessments.${editingIndex}.questions.${questionIndex}`}
                                      value={question}
                                      onChange={formik.handleChange}
                                      placeholder="Enter question"
                                      className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green" />
                                  </div>
                                  <div className="flex gap-5">
                                      <label className="font-semibold">Options:</label>
                                      {formik.values.modules[moduleIndex].assessments[editingIndex].options[questionIndex].map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex gap-5">
                                          <input
                                            type="text"
                                            name={`modules.${moduleIndex}.assessments.${editingIndex}.options.${questionIndex}.${optionIndex}`}
                                            value={option}
                                            onChange={formik.handleChange}
                                            placeholder="Enter option"
                                            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green" />
                                        </div>
                                      ))}
                                    </div><div className="flex gap-5">
                                      <label className="font-semibold">Answers:</label>
                                      {formik.values.modules[moduleIndex].assessments[editingIndex].answers[questionIndex].map((answer, answerIndex) => (
                                        <div key={answerIndex} className="flex gap-5">
                                          <input
                                            type="text"
                                            name={`modules.${moduleIndex}.assessments.${editingIndex}.answers.${questionIndex}.${answerIndex}`}
                                            value={answer}
                                            onChange={formik.handleChange}
                                            placeholder="Enter answer"
                                            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-ek-green" />
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                ))}
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                                  onClick={() => handleAddQuestion(arrayHelpers)}
                                >
                                  Add Question
                                </button>
                              </article>
                            )}
                          />
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 border rounded-md"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        <button type="button" onClick={() => remove(moduleIndex)}>
                          Remove Module
                        </button>
                      </article>
                    ))}
                    <button
                      type="button"
                      onClick={() => addModule({ subtopic: "", description: "", link: "", img: "", assessments: [] })}
                      disabled={!formik.values.modules.every(m => m.subtopic && m.description && m.link && m.img)}
                    >
                      Add Module
                    </button>
                  </>
                )}
              </FieldArray>
            </section>
            <button type="submit" className="userUpdateButton bg-ek-green text-white py-2 p-4 w-max rounded-md hover:bg-ek-light hover:text-ek-green transition-all">
              {isLoading ? <ImSpinner3 className="animate-spin text-lg" /> : 'Save'}
            </button>
          </form>
        </FormikProvider>
      </section>
    </motion.section>
  )
}

export default UpdateCourse;
