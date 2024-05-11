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
    const [productList, setProductList] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [items, setItems] = useState([]);
    
    useEffect(() => {

        // Refactor the following into a single method

        const productId = parseInt(searchParams.get("productId"));
        if(Boolean(productId)){
            db.getRow(productId, 'products')
                .then(pData => {
                    db.getStockOfProduct(productId)
                        .then(iData => {
                            setItems(iData);
                            setProductList([pData]);
                        })
                        .catch(console.error);
                    })
                .catch(console.error);
        }

        const storeId = parseInt(searchParams.get("storeId"));
        if(Boolean(storeId)){
            db.getRow(storeId, 'stores')
                .then(sData => {
                    db.getStockInStore(storeId)
                        .then(iData => {
                            setItems(iData);
                            setStoreList([sData]);
                        })
                        .catch(console.error);
                })
                .catch(console.error);
        }

        if(!(Boolean(storeId) || Boolean(storeId))){
            db.getAllRows('items')
                .then(iData => {
                    console.log(iData);
                    const products = iData.reduce((acc, current) => {
                        // TODO generate list of products data for each item
                    },[]);
                    const stores = iData.reduce((acc, current) => {
                        // TODO generate list of stores data for each item
                    },[]);
                    setProductList(products);
                    setStoreList(stores);
                });
        }
    }, []);

    return (
        <MainView title={"Insumos"}>
            {productList.length === 1 && <ProductDetails productData={productList[0]}/>}
            {storeList.length === 1 && <StoreDetails storeData={storeList[0]}/>}
            <ItemList 
                items={items} 
                productList={productList} 
                storeList={storeList}/>
            <ActionsBlock />
        </MainView>
    );
};


export default View;