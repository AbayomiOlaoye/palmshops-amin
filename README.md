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
import { useState } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";

const AssessmentTable = ({ module }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const validationSchema = Yup.object().shape({
    assessments: Yup.array().of(
      Yup.object().shape({
        questions: Yup.array().of(Yup.string().required("Question is required")),
        options: Yup.array().of(
          Yup.array().of(Yup.string().required("Option is required"))
        ),
        answers: Yup.array().of(
          Yup.array().of(Yup.string().required("Answer is required"))
        ),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      assessments: module.assessments,
    },
    validationSchema,
    onSubmit: (values) => {
      module.assessments = values.assessments; // Update module assessments
      setIsEditing(false);
    },
  });

  const handleEdit = (index) => {
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
    <section className="userInfo flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Assessments</h2>
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
                  key={`${module.id}-${assessmentIndex}-${questionIndex}`}
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
        <FormikProvider value={formik}>
          <form
            onSubmit={formik.handleSubmit}
            className="p-6 bg-white border rounded-lg"
          >
            <h3 className="text-xl font-bold mb-4">Edit Assessment</h3>
            <FieldArray
              name={`assessments.${editingIndex}.questions`}
              render={(arrayHelpers) => (
                <div>
                  {formik.values.assessments[editingIndex]?.questions.map(
                    (question, questionIndex) => (
                      <div key={questionIndex} className="mb-6">
                        <div className="mb-4">
                          <label className="block font-semibold">Question:</label>
                          <input
                            type="text"
                            name={`assessments.${editingIndex}.questions.${questionIndex}`}
                            value={question}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full border rounded-md p-2"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block font-semibold">Options:</label>
                          {formik.values.assessments[editingIndex]?.options[
                            questionIndex
                          ]?.map((option, optionIndex) => (
                            <input
                              key={optionIndex}
                              type="text"
                              name={`assessments.${editingIndex}.options.${questionIndex}.${optionIndex}`}
                              value={option}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full border rounded-md p-2 mb-2"
                            />
                          ))}
                        </div>
                        <div className="mb-4">
                          <label className="block font-semibold">Answers:</label>
                          {formik.values.assessments[editingIndex]?.answers[
                            questionIndex
                          ]?.map((answer, answerIndex) => (
                            <input
                              key={answerIndex}
                              type="text"
                              name={`assessments.${editingIndex}.answers.${questionIndex}.${answerIndex}`}
                              value={answer}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full border rounded-md p-2 mb-2"
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => handleAddQuestion(arrayHelpers)}
                  >
                    Add Question
                  </button>
                </div>
              )}
            />
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </FormikProvider>
      )}
    </section>
  );
};

export default AssessmentTable;
