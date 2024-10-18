// Menu views
import Stock from "./Stock";
import StoresList from "./StoresList";
import Returns from "./Returns";
import OperationsList from "./OperationsList";
import About from "./About";
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
        component: <Stock />
    },
    {
        path: "/stores-list",
        homeTitle: "stores",
        component: <StoresList />
    },
    {
        path: "/returns",
        homeTitle: "returns",
        component: <Returns />
    },
    {
        path: "/operations-list",
        homeTitle: "operations",
        component: <OperationsList />
    },
    {
        path: "/about",
        homeTitle: "menu_info",
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
    }
];

export default views;