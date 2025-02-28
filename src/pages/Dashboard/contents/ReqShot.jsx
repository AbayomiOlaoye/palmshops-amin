import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { DataGrid } from "@mui/x-data-grid";
import { fetchCourses } from "../../../redux/reducer/courseActions";
import { fetchUsers } from "../../../redux/reducer/authActions";

const PalmSchool = () => {
  const { courses } = useSelector((state) => state?.courses);
  const { users } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const courseData = useState(courses || []);

  console.log(courses[0]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCourses());
  }, [dispatch]);

  const coursesWithExtraData = courseData?.map((course, index) => {
    const enrolledStudents = users?.filter(user =>
      user?.enrolledCourses?.some(enrollment => enrollment?.courseId?._id === course._id)
    )?.length;
  
    const avgRating = course?.feedback?.reduce((sum, fb) => sum + fb?.rating, 0) / 
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

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "title",
      headerName: "Course Title",
      width: 250,
      renderCell: (params) => <span>{params.row?.title}</span>,
    },
    {
      field: "enrolledStudents",
      headerName: "Enrolled Students",
      width: 150,
      renderCell: (params) => <span>{params.row?.enrolledStudents}</span>,
    },
    {
      field: "feedback",
      headerName: "Feedback",
      width: 50,
      renderCell: (params) => <span>{params.row?.feedback?.length}</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: "-20%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ delay: 0.1 }}
      className="max-w-full"
    >
      <section>
        <div className="action-nav flex justify-between items-center">
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

export default PalmSchool;
