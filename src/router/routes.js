import AdminDashboard from "../pages/Dashboard/AdminDashboard";
// import StaffDashboard from "../pages/Dashboard/StaffDashboard";
import Login from "../pages/Auth/Login";
import AllProducts from "../pages/PalmStore/AllProducts";
import UpdateProduct from "../pages/PalmStore/UpdateProduct";
import NewProduct from "../pages/PalmStore/NewProduct";
import SubscriptionList from "../pages/User/SubscriptionList";
import AllUsers from "../pages/User/AllUsers";
import User from '../pages/User/User';
import Overview from "../pages/PalmSchool/Overview";
import CourseInfo from "../pages/PalmSchool/CourseInfo";
import UpdateCourse from "../pages/PalmSchool/UpdateCourse";
import CreateCourse from "../pages/PalmSchool/New";
import OverviewTrack from "../pages/PalmTrack/Overview";
import StockInfo from "../pages/PalmTrack/StockInfo";
import Orders from "../pages/PalmStore/orders/Orders";
import Order from "../pages/PalmStore/orders/Order";
import Requests from "../pages/PalmStore/orders/Request";

const routes = {
  unauthenticated: [
    { path: "/", component: Login },
    // { path: "/forgot-password", component: ForgotPassword },
  ],
  admin: [
    { path: "/dashboard", component: AdminDashboard },
    { path: "/", component: AdminDashboard },
    { path: "/products", component: AllProducts },
    { path: "/products/edit/:id", component: UpdateProduct },
    { path: "/products/new", component: NewProduct },
    { path: "/products/orders", component: Orders },
    { path: "/products/orders/:id", component: Order },
    { path: "/subscription", component: SubscriptionList },
    { path: "/users", component: AllUsers },
    { path: "/users/:id", component: User },
    { path: "/products/requests", component: Requests },
    { path: "/courses", component: Overview },
    { path: "/courses/info/:id", component: CourseInfo },
    { path: "/courses/edit/:id", component: UpdateCourse },
    { path: "/courses/new", component: CreateCourse },
    { path: "/track", component: OverviewTrack },
    { path: "/track/view/:id", component: StockInfo },
  ],
  // staff: [
  //   { path: "/dashboard", component:StaffDashboard },
  // ],
};

export default routes;
