import StoresList from "./StoresList";
import StoreForm from "./StoreForm";
import ProductsList from "./ProductsList";
import ProductForm from "./ProductForm";
import OperationsList from "./OperationsList";
import OperationForm from "./OperationForm";
import Stock from "./Stock";
import About from "./About";

const views = [
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
        path: "/operations-list",
        homeTitle: "operations",
        component: <OperationsList />
    },
    {
        path: "/operation-form",
        component: <OperationForm />
    },
    {
        path: "/about",
        homeTitle: "menu_info",
        component: <About />
    }
];

export default views;