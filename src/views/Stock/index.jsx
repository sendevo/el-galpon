import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemList from "./itemList";
import ActionsBlock from "./actionsBlock";

const itemAttrs = ["store_id", "product_id", "stock", "packs", "expiration_date"];

const View = () => {
    const db = useDatabase();   

    const [searchParams] = useSearchParams();    
    const [items, setItems] = useState([]);
    const [ignoredCols, setIgnoredCols] = useState([]);
    
    useEffect(() => {
        let filters = {};
        let ignored = [];
        for(let index = 0; index < itemAttrs.length; index++){
            const paramValue = parseInt(searchParams.get(itemAttrs[index]));
            if(Boolean(paramValue)){
                filters[itemAttrs[index]] = paramValue;
                ignored.push(itemAttrs[index]);
            }
        }
        db.query("items", [], filters)
            .then(iData => {
                setItems(iData);
                setIgnoredCols(ignored);
            });
    }, []);

    return (
        <MainView title={"Insumos"}>
            {ignoredCols.includes("product_id") && items.length > 0 && <ProductDetails productData={items[0]?.productData}/>}
            {ignoredCols.includes("store_id") && items.length > 0 && <StoreDetails storeData={items[0]?.storeData}/>}
            <ItemList 
                items={items} 
                ignoredCols={ignoredCols}/>
            <ActionsBlock />
        </MainView>
    );
};


export default View;