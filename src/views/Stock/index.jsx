import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemList from "./itemList";
import ActionsBlock from "./actionsBlock";

const View = () => {
    const db = useDatabase();   

    const [searchParams] = useSearchParams();    
    const [items, setItems] = useState([]);
    const [showProduct, setShowProduct] = useState(false);
    const [showStore, setShowStore] = useState(false);
    
    useEffect(() => {
        const productId = parseInt(searchParams.get("productId"));
        const storeId = parseInt(searchParams.get("storeId"));
        db.getItems([], productId, storeId)
            .then(iData => {
                setItems(iData);
                setShowProduct(Boolean(productId));
                setShowStore(Boolean(storeId));
            });
    }, []);

    return (
        <MainView title={"Insumos"}>
            {showProduct && <ProductDetails productData={items[0]?.productData}/>}
            {showStore && <StoreDetails storeData={items[0]?.storeData}/>}
            <ItemList 
                items={items} 
                showProductCol={!showProduct}
                showStoreCol={!showStore}/>
            <ActionsBlock />
        </MainView>
    );
};


export default View;