import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { DataGrid } from "@mui/x-data-grid";
import { fetchCourses } from "../../../redux/reducer/courseActions";
import { fetchUsers } from "../../../redux/reducer/authActions";

const PalmSchool = () => {
  const { courses } = useSelector((state) => state?.courses);
  const { users } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCourses());
    setCourseData(courses);
  }, [dispatch, courses.length]);

  const coursesWithExtraData = courseData?.map((course, index) => {
    const enrolledStudents = users?.filter(user =>
      user?.enrolledCourses?.some(enrollment => enrollment?.courseId?._id === course?._id)
    )?.length;
  
    const avgRating = course?.feedback?.reduce((sum, fb) => sum + fb?.rating, 0) / 
      (course?.feedback?.length || 1);
  
    return {
      ...course,
      id: index + 1,
      enrolledStudents,
      avgRating: avgRating.toFixed(1),
    };
  });

  const columns = [
    { field: "id", headerName: "S/N", width: 50 },
    {
      field: "title",
      headerName: "Course Title",
      width: 250,
    },
    {
      field: "enrolledStudents",
      headerName: "Enrollees",
      width: 100,
    },
    {
      field: "feedback",
      headerName: "Feedback",
      width: 80,
      renderCell: (params) => <span>{params.row?.feedback?.length}</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: "-20%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ delay: 0.1 }}
      className="max-w-full min-h-[350px] h-[350px] overflow-scroll"
    >
      <h2 className="text-2xl font-semibold text-ek-black mb-2">Palm School</h2>
      <DataGrid
        rows={coursesWithExtraData}
        columns={columns}
        pageSize={10}
        rowHeight={38}
      />
    </motion.div>
  );
};

export default PalmSchool;
