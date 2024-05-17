import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import { OPERATION_TYPES } from "../../model/constants";
import MainView from "../../components/MainView";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemList from "./itemList";
import ActionsBlock from "./actionsBlock";

const itemAttrs = ["store_id", "product_id", "stock", "packs", "expiration_date"];

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();    
    const [items, setItems] = useState([]);
    const [ignoredCols, setIgnoredCols] = useState([]);
    const [selected, setSelected] = useState([]);

    const disabledButtons = { // TODO: improve logic here
        buy: false,
        moveStock: selected.length === 0,
        movePacks: selected.length === 0,
        spend: selected.length === 0,
        return: selected.length === 0
    };
    
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

    const handleOperation = operationType => {
        if(selected.length > 0){
            navigate(`/operations-form?type=${operationType}?items=${selected.join("_")}`);
        }else{
            console.error("No item selected");
        }
    };

    return (
        <MainView title={"Insumos"}>
            {ignoredCols.includes("product_id") && items.length > 0 && <ProductDetails productData={items[0]?.productData}/>}
            
            {ignoredCols.includes("store_id") && items.length > 0 && <StoreDetails storeData={items[0]?.storeData}/>}
            
            <ItemList 
                items={items} 
                ignoredCols={ignoredCols}
                selected={selected}
                setSelected={setSelected}/>
            
            <ActionsBlock
                disabledButtons={disabledButtons}
                onBuy={() => handleOperation(OPERATION_TYPES.BUY)}
                onMoveStock={() => handleOperation(OPERATION_TYPES.MOVE_STOCK)}
                onSpend={() => handleOperation(OPERATION_TYPES.SPEND)}
                onMovePack={() => handleOperation(OPERATION_TYPES.MOVE_PACK)}
                onReturn={() => handleOperation(OPERATION_TYPES.RETURN)}/>
        </MainView>
    );
};


export default View;