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
        homeTitle: "Insumos",
        component: <Stock />
    },
    {
        path: "/stores-list",
        homeTitle: "Depósitos",
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
        homeTitle: "Historial",
        component: <OperationsList />
    },
    {
        path: "/operation-form",
        component: <OperationForm />
    },
    {
        path: "/about",
        homeTitle: "Información y ayuda",
        component: <About />
    }
];

export default views;