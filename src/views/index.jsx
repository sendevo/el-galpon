// Menu views
import Stock from "./Stock";
import StoresList from "./StoresList";
import Returns from "./Returns";
import OperationsList from "./OperationsList";
import About from "./About";
import Alerts from "./Alerts";
// Menu icons
import stockIcon from "../assets/icons/stock.png";
import storesIcon from "../assets/icons/barn.png";
import returnsIcon from "../assets/icons/returns.png";
import operationsIcon from "../assets/icons/operations.png";
import aboutIcon from "../assets/icons/info.png";

// Secondary views
import StoreForm from "./StoreForm";
import ProductsList from "./ProductsList";
import ProductForm from "./ProductForm";
import OperationForm from "./OperationForm";


const views = [
    // Menu views
    {
        path: "/stock",
        homeTitle: "items",
        icon: stockIcon,
        component: <Stock />
    },
    {
        path: "/stores-list",
        homeTitle: "stores",
        icon: storesIcon,
        component: <StoresList />
    },
    {
        path: "/returns",
        homeTitle: "returns",
        icon: returnsIcon,
        component: <Returns />
    },
    {
        path: "/operations-list",
        homeTitle: "operations",
        icon: operationsIcon,
        component: <OperationsList />
    },
    {
        path: "/about",
        homeTitle: "menu_info",
        icon: aboutIcon,
        component: <About />
    },
    // Secondary views
    {
        path: "/store-form",
        component: <StoreForm />
    },
    {
        path: "/products-list",
        component: <ProductsList />
    },
    {
        path: "/product-form",
        component: <ProductForm />
    },
    {
        path: "/operation-form",
        component: <OperationForm />
    },
    {
        path: "/alerts",
        component: <Alerts />
    }
];

export default views;