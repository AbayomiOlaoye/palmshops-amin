import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { motion } from 'framer-motion';
import { deleteCourse } from '../../redux/reducer/courseActions';

const CourseInfo = () => {
  const { courses } = useSelector((state) => state.courses);
  console.log(courses);
  // const { users } = useSelector((state) => state?.auth);
  const [courseData, setCourseData] = useState(courses || []);
  const { id } = useParams();
  const dispatch = useDispatch();

  const course = courses.find((record) => record._id === id);
  // const getUserName = (userId) => {
  //   const user = users.find((record) => record._id === userId);
  //   // console.log(users);
  //   return user?.name;
  // };

  if (!course) {
    return <div className="text-center text-red-500">Course information not available</div>;
  }

  const getDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleDelete = (id) => {
    dispatch(deleteCourse(id));
    setCourseData(courseData.filter((item) => item._id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
      className="max-w-full"
    >
      <section className="">
        <div className="action-nav flex justify-between items-center pt-10">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Course Information</span>
          </motion.article>
          <article className="other-actions flex gap-2">
            <Link to={`/courses/edit/${id}`} className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green">Edit Course</Link>
            <button
              className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green"
              onClick={() => handleDelete(course._id)}
            >
              Delete Course
            </button>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <section className="userInfo grid grid-cols-3 gap-8">
            <article className="work flex flex-col col-span-2 gap-1">
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Course Title:</span>
                <span className="capitalize">{course?.title}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Created On:</span>
                <span className="capitalize">{getDate(course?.dateCreated)}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Price:</span>
                <span className="capitalize">{course?.price}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Learner&apos;s Level:</span>
                <span className="capitalize">{course?.level}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Mode:</span>
                <span className="capitalize">{course?.mode}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Course Intro Video Link:</span>
                <span className="">{course?.link}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Rating Count:</span>
                <span className="capitalize">{course?.ratingCount}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold">Rating:</span>
                <span className="capitalize">{course?.rating}</span>
              </div>
              <div className="info flex gap-10">
                <span className="w-[180px] font-bold block">Course Description:</span>
                <span className="capitalize">{course?.description}</span>
              </div>
            </article>
            <article className="work flex flex-col gap-1">
              <h4 className="text-center p-2 font-bold">Course Avatar</h4>
              <img src={course?.image} alt="Course Avatar" className="w-full rounded-lg h-[300px] object-cover" />
            </article>
          </section>
          <section className="userInfo mt-5 flex flex-col gap-8">
            <h2 className="text-2xl font-bold">Module Details</h2>
            <article className="work flex flex-col gap-5">
              {course?.modules.map((module, index) => (
                <>
                  <section key={module._id + index} className="module flex grid-cols-3 items-center gap-8">
                    <article className="work flex flex-col col-span-2 gap-1">
                      <div className="info flex gap-10">
                        <span className="w-[180px] font-bold">Module Title:</span>
                        <span className="capitalize">{module.subtopic}</span>
                      </div>
                      <div className="info flex gap-10">
                        <span className="w-[180px] font-bold">Module Description:</span>
                        <span className="capitalize">{module.description}</span>
                      </div>
                      <div className="info flex gap-10">
                        <span className="w-[180px] font-bold">Module Video Link:</span>
                        <span className="">{module.link}</span>
                      </div>
                    </article>
                    <article className="work flex flex-col gap-1">
                      <h4 className="text-center p-2 font-bold">Module Avatar</h4>
                      <img src={module.img} alt="Module Avatar" className="w-full rounded-lg h-[100px] object-cover" />
                    </article>
                  </section>
                  <hr className="border-2 border-ek-light" />
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
                          </tr>
                        </thead>
                        <tbody>
                          {module.assessments.map((assessment, assessmentIndex) =>
                            assessment.questions.map((question, questionIndex) => (
                              <tr key={`${module._id}-${assessmentIndex}-${questionIndex}`} className="text-left">
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                  {questionIndex + 1}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{question}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                  <ul className="list-disc list-inside">
                                    {assessment.options[questionIndex]?.map((option, optionIndex) => (
                                      <li key={optionIndex}>{option}</li>
                                    ))}
                                  </ul>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                  <ul className="list-disc list-inside">
                                    {assessment.answers[questionIndex]?.map((answer, answerIndex) => (
                                      <li key={answerIndex}>{answer}</li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </article>
                  </section>
                </>
              ))}
            </article>
          </section>
          <section className="userInfo mt-5 flex flex-col gap-8">
            <article className="work flex flex-col gap-5">
              <h2 className="text-2xl font-bold">Feedbacks from Enrolled Users</h2>
              <table className="table-auto w-full border-collapse border border-gray-300">  
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">S/N</th>
                    <th className="border border-gray-300 px-4 py-2">Reviewer Name</th>
                    <th className="border border-gray-300 px-4 py-2">Review</th>
                    <th className="border border-gray-300 px-4 py-2">Rating</th>
                    <th className="border border-gray-300 px-4 py-2">Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {course?.feedback.map((review, index) => (
                    <tr key={review._id + 1} className="text-left">
                      <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{review.userId.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{review.comment}</td>
                      <td className="border border-gray-300 px-4 py-2">{review.rating}</td>
                      <td className="border border-gray-300 px-4 py-2">{getDate(review.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
        </article>
      </section>
    </motion.div>
  );
};

export default CourseInfo;
