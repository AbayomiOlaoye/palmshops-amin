import AdminDashboard from "../pages/Dashboard/AdminDashboard";
// import StaffDashboard from "../pages/Dashboard/StaffDashboard";
import Login from "../pages/Auth/Login";
// import AllStaff from "../pages/HR/AllStaff";
// import UpdateStaff from "../pages/HR/UpdateStaff";
// import NewStaff from "../pages/HR/New";
// import Payroll from "../pages/HR/Payroll";
// import NewPayroll from "../pages/HR/NewPayroll";
import Overview from "../pages/PalmSchool/Overview";
import CourseInfo from "../pages/PalmSchool/CourseInfo";
import UpdateCourse from "../pages/PalmSchool/UpdateCourse";
// import AllSales from "../pages/Sales/AllSales";
// import SalesDetails from "../pages/Sales/SalesDetails";
// import NewSales from "../pages/Sales/NewSales";
// import UpdatePayroll from "../pages/HR/UpdatePayroll";
// import ReqList from "../pages/Requisition/ReqList";
// import NewRequest from "../pages/Requisition/NewRequest";
// import EditReq from "../pages/Requisition/EditReq";
// import Purchases from "../pages/Purchases/Purchases";
// import NewPurchase from "../pages/Purchases/NewPurchases";
// import UpdatePurchases from "../pages/Purchases/UpdatePurchases";
// import Expenses from "../pages/Expenses/Expenses";
// import NewExpense from "../pages/Expenses/NewExpense";
// import UpdateExpenses from "../pages/Expenses/UpdateExpense";
// import Receivership from "../pages/Receivership/Receivership";
// import NewInspection from "../pages/Receivership/NewInspection";
// import ViewInspection from "../pages/Receivership/ViewInspection";
// import Overview from "../pages/Inventory/Overview";
// import Inventory from "../pages/Inventory/Inventory";
// import StockDetails from "../pages/Inventory/StockDetails";
// import NewWarehouse from "../pages/Inventory/NewWarehouse";
// import Transfer from "../pages/Inventory/Transfer";
// import WareHouse from "../pages/Inventory/Warehouse";
// import UpdateWarehouse from "../pages/Inventory/UpdateWarehouse";
// import NewRecord from "../pages/Production/New";
// import NewProduct from "../pages/Production/AddProduct";
// import Customers from "../pages/Sales/Customers";
// import NewCustomers from "../pages/Sales/NewCustomers";
// import UpdateCustomers from "../pages/Sales/UpdateCustomers";

const routes = {
  unauthenticated: [
    { path: "/", component: Login },
    // { path: "/forgot-password", component: ForgotPassword },
  ],
  admin: [
    { path: "/dashboard", component: AdminDashboard },
    { path: "/", component: AdminDashboard },
  //   { path: "/hr", component: AllStaff },
  //   { path: "/hr/staff/new", component: NewStaff },
  //   { path: "/hr/staff/edit/:id", component: UpdateStaff },
  //   { path: "/hr/payroll", component: Payroll },
  //   { path: "/hr/payroll/edit/:id", component: UpdatePayroll },
  //   { path: "/hr/payroll/generate", component: NewPayroll },
    { path: "/courses", component: Overview },
    { path: "/courses/info/:id", component: CourseInfo },
    { path: "/courses/edit/:id", component: UpdateCourse },
  //   { path: "/production/new", component: NewRecord },
  //   { path: "/production/product/new", component: NewProduct },
  //   { path: "/sales", component: AllSales },
  //   { path: "/sales/edit/:id", component: SalesDetails },
  //   { path: "/sales/new", component: NewSales },
  //   { path: "/customers/new", component: NewCustomers },
  //   { path: "/customers/edit/:id", component: UpdateCustomers },
  //   { path: "/customers", component: Customers },
  //   { path: "/requisitions", component: ReqList },
  //   { path: "/requisitions/new", component: NewRequest },
  //   { path: "/requisitions/:id", component: EditReq },
  //   { path: "/purchases", component: Purchases },
  //   { path: "/purchases/new", component: NewPurchase },
  //   { path: "/purchases/:id", component: UpdatePurchases },
  //   { path: "/expenses", component: Expenses },
  //   { path: "/expenses/new", component: NewExpense },
  //   { path: "/expenses/:id", component: UpdateExpenses },
  //   { path: "/inspections", component: Receivership },
  //   { path: "/inspections/new", component: NewInspection },
  //   { path: "/inspections/:id", component: ViewInspection },
  //   { path: "/stocks", component: Overview },
  //   { path: "/stocks/all-inventories", component: Inventory },
  //   { path: "/stocks/:id", component: StockDetails },
  //   { path: "/stocks/warehouse/new", component: NewWarehouse },
  //   { path: "/stocks/transfer", component: Transfer },
  //   { path: "/stocks/warehouse", component: WareHouse },
  //   { path: "/stocks/warehouse/edit/:id", component: UpdateWarehouse },
  //   // Add more admin routes here
  // ],
  // staff: [
  //   { path: "/dashboard", component:StaffDashboard },
  //   { path: "/", component: StaffDashboard },
  //   { path: "/production/new", component: NewRecord },
  //   { path: "/requisitions/new", component: NewRequest },
  //   { path: "/sales/new", component: NewSales },
  //   { path: "/customers/new", component: NewCustomers },
    // { path: "/profile", component: Profile },
  ],
};

export default routes;
