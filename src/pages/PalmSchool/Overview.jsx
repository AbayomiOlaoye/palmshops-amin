import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { DataGrid } from "@mui/x-data-grid";
import { MdArrowBack } from "react-icons/md";
import Top from "../Dashboard/Top";
import { fetchCourses, deleteCourse } from "../../redux/reducer/courseActions";
import { fetchUsers } from "../../redux/reducer/authActions";

const Overview = () => {
  const { courses } = useSelector((state) => state?.courses);
  const { users } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState(courses || []);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCourses());
  }, [dispatch]);

  const coursesWithExtraData = courseData?.map((course, index) => {
    const enrolledStudents = users?.filter(user =>
      user?.enrolledCourses?.some(enrollment => enrollment?.courseId?._id === course?._id)
    ).length;
  
    const avgRating = course?.feedback.reduce((sum, fb) => sum + fb?.rating, 0) / 
      (course?.feedback?.length || 1);
  
    const rateCount = course?.feedback?.length;
  
    return {
      ...course,
      id: index + 1,
      modulesCount: course?.modules?.length || 0,
      enrolledStudents,
      avgRating: avgRating.toFixed(1),
      rateCount,
    };
  });

  const handleDelete = (id) => {
    dispatch(deleteCourse(id));
    setCourseData(courseData.filter((item) => item._id !== id));
  };

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "title",
      headerName: "Course Title",
      width: 250,
      renderCell: (params) => <span>{params.row?.title}</span>,
    },
    {
      field: "modulesCount",
      headerName: "Modules",
      width: 100,
      renderCell: (params) => <span>{params.row?.modulesCount}</span>,
    },
    {
      field: "enrolledStudents",
      headerName: "Enrolled Students",
      width: 150,
      renderCell: (params) => <span>{params.row?.enrolledStudents}</span>,
    },
    {
      field: "avgRating",
      headerName: "Average Rating",
      width: 130,
      renderCell: (params) => <span>{params.row?.avgRating}</span>,
    },
    {
      field: "rateCount",
      headerName: "Rate Count",
      width: 100,
      renderCell: (params) => <span>{params.row?.rateCount}</span>,
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-4 items-center justify-center h-30 pt-1">
          <Link
            to={`/courses/info/${params.row?._id}`}
            className="bg-ek-green text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded"
          >
            <button className="userListEdit">View</button>
          </Link>
          <button
            onClick={() => handleDelete(params.row?._id)}
            className="bg-ek-red text-white px-2 h-[28px] hover:bg-opacity-75 transition-all flex items-center rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-20%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ delay: 0.1 }}
      className="max-w-full"
    >
      <Top title="Courses" text="Manage and Monitor Course Details" />
      <section>
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Overview</span>
          </motion.article>
          <article className="other-actions flex gap-2">
            <Link
              to="/courses/new"
              className="border-2 rounded-lg px-3 py-2 hover:bg-ek-deep hover:text-ek-green"
            >
              New Course
            </Link>
          </article>
        </div>
        <article className="staff-list min-h-[80vh] mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <DataGrid
            rows={coursesWithExtraData}
            columns={columns}
            pageSize={10}
            rowHeight={38}
          />
        </article>
      </section>
    </motion.div>
  );
};

export default Overview;
