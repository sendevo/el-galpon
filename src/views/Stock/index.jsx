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
    const [productData, setProductData] = useState();
    const [storeData, setStoreData] = useState();
    const [itemsData, setItemsData] = useState([]);
    
    useEffect(() => {
        const productId = parseInt(searchParams.get("productId"));
        if(Boolean(productId)){
            db.getItem(productId, 'products')
                .then(pData => {
                    setProductData(pData);
                    db.getStockOfProduct(productId)
                        .then(setItemsData)
                        .catch(console.error);
                    })
                .catch(console.error);
        }

        const storeId = parseInt(searchParams.get("storeId"));
        if(Boolean(storeId)){
            db.getItem(storeId, 'stores')
                .then(sData => {
                    setStoreData(sData);
                    db.getStockInStore(storeId)
                        .then(setItemsData)
                        .catch(console.error);
                })
                .catch(console.error);
        }

        if(!(Boolean(storeId) || Boolean(storeId))){ // Empty filters
            db.getAllItems('items')
        }
    }, []);

    return (
        <MainView title={"Insumos"}>
            {productData && <ProductDetails productData={productData}/>}
            {storeData && <StoreDetails storeData={storeData}/>}
            <ItemList itemsData={itemsData} productData={productData} storeData={storeData}/>
            <ActionsBlock />
        </MainView>
    );
};


export default View;