import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemList from "./itemList";
import EmptyListSection from "./emptyListSection";
import ActionsBlock from "./actionsBlock";
import iconEmpty from "../../assets/icons/empty_folder.png";

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
    }, []);

    return (
        <MainView title={"Insumos"}>
            {productData && <ProductDetails productData={productData}/>}
            {storeData && <StoreDetails storeData={storeData}/>}
            {itemsData.length !== 0 ? 
                <ItemList itemsData={itemsData} productData={productData} storeData={storeData}/>
                :
                <EmptyListSection message={"La lista de insumos está vacía"} icon={iconEmpty} />
            }
            <ActionsBlock />
        </MainView>
    );
};


export default View;