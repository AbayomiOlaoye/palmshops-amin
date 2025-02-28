import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MdArrowBack } from 'react-icons/md';
import { motion } from 'framer-motion';
import { auth } from '../../apiCall';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  serial: Yup.number().required('Serial is required'),
  id: Yup.string().required('ID is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  link: Yup.string().required('Link is required').url('Must be a valid URL'),
  subtitle: Yup.string(),
  image: Yup.string().required('Image is required').url('Must be a valid URL'),
  price: Yup.string(),
  poster: Yup.string(),
  rating: Yup.number().min(1).max(5),
  ratingCount: Yup.number().positive(),
  level: Yup.string().oneOf(['beginner', 'intermediate', 'advanced']),
  mode: Yup.string(),
  duration: Yup.string().notRequired(),
  modules: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required('ID is required'),
      subtopic: Yup.string().required('Subtopic is required'),
      description: Yup.string().required('Description is required'),
      link: Yup.string().required('Link is required').url('Must be a valid URL'),
      img: Yup.string().required('Image is required').url('Must be a valid URL'),
      subtitle: Yup.string(),
      poster: Yup.string(),
      duration: Yup.number().notRequired(),
      assessments: Yup.array().of(
        Yup.object().shape({
          questions: Yup.array().of(Yup.string().required('Question is required')).required('At least one question is required').min(1, "Minimum one question is required"),
          options: Yup.array().of(Yup.array().of(Yup.string().required('Option is required')).required("Options are required").min(1, 'At least one option per question is required')).required('Options are required').min(1, "Minimum one option is required"),
          answers: Yup.array().of(Yup.array().of(Yup.string().required('Answer is required')).required("Answers are required").min(1, 'At least one answer per question is required')).required('Answers are required').min(1, "Minimum one answer is required"),
        })
      ),
    })
  ),
});

const NewCourse = () => {
  const initialValues = {
    serial: '',
    id: '',
    title: '',
    description: '',
    link: '',
    subtitle: '',
    image: '',
    price: 'Free',
    poster: '',
    rating: 3,
    ratingCount: 3,
    level: 'beginner',
    mode: '100% Online',
    duration: '',
    modules: [
      {
        id: '',
        subtopic: '',
        description: '',
        link: '',
        img: '',
        subtitle: '',
        poster: '',
        duration: 40,
        assessments: [
          {
            questions: [''],
            options: [['']],
            answers: [['']],
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    console.log('Form values:', values);
    try {
      const response = await auth.post('/courses/new', values);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="p-5 rounded-lg bg-gray-50 font-sans"
    >
      <div className="action-nav flex justify-between items-center p-10">
        <motion.article
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 60 }}
          className="back flex items-center gap-4 text-2xl"
        >
          <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
          <span className="font-medium">New Course Form</span>
        </motion.article>
      </div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="serial" className="block mb-1 text-gray-700">Serial:</label>
                <Field type="text" id="serial" name="serial" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="serial" component="div" className="text-red-500 mt-1" />
              </div>
              <div>
                <label htmlFor="id" className="block mb-1 text-gray-700">ID:</label>
                <Field type="text" id="id" name="id" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="id" component="div" className="text-red-500 mt-1" />
              </div>
              <div>
                <label htmlFor="title" className="block mb-1 text-gray-700">Title:</label>
                <Field type="text" id="title" name="title" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1 text-gray-700">Description:</label>
                <Field as="textarea" id="description" name="description" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
              </div>
              <div>
                <label htmlFor="link" className="block mb-1 text-gray-700">Link:</label>
                <Field type="text" id="link" name="link" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="link" component="div" className="text-red-500 mt-1" />
              </div>
              <div>
                <label htmlFor="subtitle" className="block mb-1 text-gray-700">Subtitle:</label>
                <Field type="text" id="subtitle" name="subtitle" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="image" className="block mb-1 text-gray-700">Image URL:</label>
                <Field type="text" id="image" name="image" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="image" component="div" className="text-red-500 mt-1" />
              </div>

              <div>
                <label htmlFor="price" className="block mb-1 text-gray-700">Price:</label>
                <Field type="text" id="price" name="price" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="poster" className="block mb-1 text-gray-700">Poster URL:</label>
                <Field type="text" id="poster" name="poster" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="rating" className="block mb-1 text-gray-700">Rating:</label>
                <Field type="number" id="rating" name="rating" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="rating" component="div" className="text-red-500 mt-1" />
              </div>
              <div>
                <label htmlFor="ratingCount" className="block mb-1 text-gray-700">Rating Count:</label>
                <Field type="number" id="ratingCount" name="ratingCount" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="ratingCount" component="div" className="text-red-500 mt-1" />
              </div>
              <div>
                <label htmlFor="level" className="block mb-1 text-gray-700">Level:</label>
                <Field as="select" id="level" name="level" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Field>
              </div>
              <div>
                <label htmlFor="mode" className="block mb-1 text-gray-700">Mode:</label>
                <Field as="select" id="mode" name="mode" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500">
                  <option value="100% Online">100% Online</option>
                  <option value="Blended">Blended</option>
                  <option value="Offline">Offline</option>
                </Field>
              </div>
              <div>
                <label htmlFor="duration" className="block mb-1 text-gray-700">Duration:</label>
                <Field type="text" id="duration" name="duration" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="duration" component="div" className="text-red-500 mt-1" />
              </div>
            </div>

            <FieldArray name="modules">
              {({ push: pushModule, remove: removeModule }) => (
                <div>
                  {values.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="mt-5 p-3 border border-gray-300 rounded-md">
                      <h4 className="mb-3 text-lg text-gray-800">Module {moduleIndex + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.id`} className="block mb-1 text-gray-700">ID:</label>
                          <Field
                            type="text"
                            id={`modules.${moduleIndex}.id`}
                            name={`modules.${moduleIndex}.id`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                          <ErrorMessage name={`modules.${moduleIndex}.id`} component="div" className="text-red-500 mt-1" />
                        </div>
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.subtopic`} className="block mb-1 text-gray-700">Subtopic:</label>
                          <Field
                            type="text"
                            id={`modules.${moduleIndex}.subtopic`}
                            name={`modules.${moduleIndex}.subtopic`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                          <ErrorMessage name={`modules.${moduleIndex}.subtopic`} component="div" className="text-red-500 mt-1" />
                        </div>
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.description`} className="block mb-1 text-gray-700">Description:</label>
                          <Field
                            as="textarea"
                            id={`modules.${moduleIndex}.description`}
                            name={`modules.${moduleIndex}.description`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                          <ErrorMessage name={`modules.${moduleIndex}.description`} component="div" className="text-red-500 mt-1" />
                        </div>
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.link`} className="block mb-1 text-gray-700">Link:</label>
                          <Field
                            type="text"
                            id={`modules.${moduleIndex}.link`}
                            name={`modules.${moduleIndex}.link`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                          <ErrorMessage name={`modules.${moduleIndex}.link`} component="div" className="text-red-500 mt-1" />
                        </div>
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.img`} className="block mb-1 text-gray-700">Image URL:</label>
                          <Field
                            type="text"
                            id={`modules.${moduleIndex}.img`}
                            name={`modules.${moduleIndex}.img`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                          <ErrorMessage name={`modules.${moduleIndex}.img`} component="div" className="text-red-500 mt-1" />
                        </div>
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.subtitle`} className="block mb-1 text-gray-700">Subtitle:</label>
                          <Field
                            type="text"
                            id={`modules.${moduleIndex}.subtitle`}
                            name={`modules.${moduleIndex}.subtitle`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.poster`} className="block mb-1 text-gray-700">Poster URL:</label>
                          <Field
                            type="text"
                            id={`modules.${moduleIndex}.poster`}
                            name={`modules.${moduleIndex}.poster`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor={`modules.${moduleIndex}.duration`} className="block mb-1 text-gray-700">Duration (minutes):</label>
                          <Field
                            type="number"
                            id={`modules.${moduleIndex}.duration`}
                            name={`modules.${moduleIndex}.duration`}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                          />
                          <ErrorMessage name={`modules.${moduleIndex}.duration`} component="div" className="text-red-500 mt-1" />
                        </div>
                      </div>

                      <FieldArray name={`modules.${moduleIndex}.assessments`}>
                        {({ push: pushAssessment, remove: removeAssessment }) => (
                          <div>
                            {module.assessments.map((assessment, assessmentIndex) => (
                              <div key={assessmentIndex} className="mt-3 p-3 border border-gray-200 rounded-md">
                                <h5 className="mb-3 text-lg text-gray-800">Assessment {assessmentIndex + 1}</h5>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {/* Questions */}
                                  <div>
                                    <label htmlFor={`modules.${moduleIndex}.assessments.${assessmentIndex}.questions`} className="block mb-1 text-gray-700">
                                      Questions:
                                    </label>
                                    <FieldArray name={`modules.${moduleIndex}.assessments.${assessmentIndex}.questions`}>
                                      {({ push: pushQuestion, remove: removeQuestion }) => ( // Corrected!
                                        <div>
                                          {values.modules[moduleIndex].assessments[assessmentIndex].questions.map((question, questionIndex) => (
                                            <div key={questionIndex} className="mb-2">
                                              <Field
                                                type="text"
                                                name={`modules.${moduleIndex}.assessments.${assessmentIndex}.questions[${questionIndex}]`}
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                              />
                                              <ErrorMessage name={`modules.${moduleIndex}.assessments.${assessmentIndex}.questions[${questionIndex}]`} component="div" className="text-red-500 mt-1" />
                                              <button // Add a remove button!
                                                type="button"
                                                onClick={() => removeQuestion(questionIndex)}
                                                className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          ))}
                                          <button  // Add an add button!
                                            type="button"
                                            onClick={() => pushQuestion('')}
                                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                                          >
                                            Add Question
                                          </button>
                                        </div>
                                      )}
                                    </FieldArray>
                                  </div>

                                  {/* Options */}
                                  <div>
                                    <label htmlFor={`modules.${moduleIndex}.assessments.${assessmentIndex}.options`} className="block mb-1 text-gray-700">
                                      Options:
                                    </label>
                                    <FieldArray name={`modules.${moduleIndex}.assessments.${assessmentIndex}.options`}>
                                      {({ push: pushOptionArray }) => (
                                        <div>
                                          {values.modules[moduleIndex].assessments[assessmentIndex].options.map((optionArray, optionArrayIndex) => (
                                            <div key={optionArrayIndex} className="mb-2">
                                              <FieldArray name={`modules.${moduleIndex}.assessments.${assessmentIndex}.options[${optionArrayIndex}]`}>
                                                {({ push: pushOption, remove: removeOption }) => (
                                                  <div>
                                                    {optionArray.map((option, optionIndex) => (
                                                      <div key={optionIndex} className="mb-2 flex items-center">
                                                        <Field
                                                          type="text"
                                                          name={`modules.${moduleIndex}.assessments.${assessmentIndex}.options[${optionArrayIndex}][${optionIndex}]`}
                                                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                                        />
                                                        <button
                                                          type="button"
                                                          onClick={() => removeOption(optionIndex)}
                                                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                                                        >
                                                          Remove
                                                        </button>
                                                      </div>
                                                    ))}
                                                    <button
                                                      type="button"
                                                      onClick={() => pushOption('')}
                                                      className="mt-2 px-4 py-2 bg-ek-green text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                                                    >
                                                      Add Option
                                                    </button>
                                                  </div>
                                                )}
                                              </FieldArray>
                                            </div>
                                          ))}
                                          <button
                                            type="button"
                                            onClick={() => pushOptionArray([''])}
                                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                                          >
                                            Add Option Array
                                          </button>
                                        </div>
                                      )}
                                    </FieldArray>
                                  </div>

                                  <div>
                                    <label htmlFor={`modules.${moduleIndex}.assessments.${assessmentIndex}.answers`} className="block mb-1 text-gray-700">
                                      Answers:
                                    </label>
                                    <FieldArray name={`modules.${moduleIndex}.assessments.${assessmentIndex}.answers`}>
                                      {({ push: pushAnswerArray }) => (
                                        <div>
                                          {values.modules[moduleIndex].assessments[assessmentIndex].answers.map((answerArray, answerArrayIndex) => (
                                            <div key={answerArrayIndex} className="mb-2">
                                              <FieldArray name={`modules.${moduleIndex}.assessments.${assessmentIndex}.answers[${answerArrayIndex}]`}>
                                                {({ push: pushAnswer, remove: removeAnswer }) => (
                                                  <div>
                                                    {answerArray.map((answer, answerIndex) => (
                                                      <div key={answerIndex} className="mb-2 flex items-center">
                                                        <Field
                                                          type="text"
                                                          name={`modules.${moduleIndex}.assessments.${assessmentIndex}.answers[${answerArrayIndex}][${answerIndex}]`}
                                                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                                        />
                                                        <button
                                                          type="button"
                                                          onClick={() => removeAnswer(answerIndex)}
                                                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                                                        >
                                                          Remove
                                                        </button>
                                                      </div>
                                                    ))}
                                                    <button
                                                      type="button"
                                                      onClick={() => pushAnswer('')}
                                                      className="mt-2 px-4 py-2 bg-ek-green text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                                                    >
                                                      Add Answer
                                                    </button>
                                                  </div>
                                                )}
                                              </FieldArray>
                                            </div>
                                          ))}
                                          <button
                                            type="button"
                                            onClick={() => pushAnswerArray([''])}
                                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                                          >
                                            Add Answer Array
                                          </button>
                                        </div>
                                      )}
                                    </FieldArray>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAssessment(assessmentIndex)}
                                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                                >
                                  Remove Assessment
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => pushAssessment({ questions: [''], options: [['']], answers: [['']] })}
                              className="mt-4 px-4 py-2 bg-ek-green text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                            >
                              Add Assessment
                            </button>
                          </div>
                        )}
                      </FieldArray>

                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                      >
                        Remove Module
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => pushModule({
                      id: '',
                      subtopic: '',
                      description: '',
                      link: '',
                      img: '',
                      subtitle: '',
                      poster: '',
                      duration: 40,
                      assessments: [{ questions: [''], options: [['']], answers: [['']] }],
                    })}
                    className="mt-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                  >
                    Add Module
                  </button>
                </div>
              )}
            </FieldArray>

            <button type="submit" disabled={isSubmitting} className="mt-5 px-6 py-3 bg-ek-green text-white rounded-md hover:bg-ek-light focus:outline-none focus:ring focus:ring-ek-light">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default NewCourse;