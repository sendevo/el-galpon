import StoresList from "./StoresList";
import StoreForm from "./StoreForm";
import StoreStock from "./StoreStock";
import ProductsList from "./ProductsList";
import ProductForm from "./ProductForm";
import ProductStock from "./ProductStock";
import Stock from "./Stock";
import OperationsList from "./OperationsList";
import About from "./About";

const views = [
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
        path: "/store-stock",
        component: <StoreStock />
    },
    {
        path: "/products-list",
        homeTitle: "Productos",
        component: <ProductsList />
    },
    {
        path: "/product-form",
        component: <ProductForm />
    },
    {
        path: "/product-stock",
        component: <ProductStock />
    },
    {
        path: "/operations-list",
        homeTitle: "Movimientos",
        component: <OperationsList />
    },
    {
        path: "/stock",
        homeTitle: "Insumos",
        component: <Stock />
    },
    {
        path: "/about",
        homeTitle: "Información y ayuda",
        component: <About />
    }
];

export default views;