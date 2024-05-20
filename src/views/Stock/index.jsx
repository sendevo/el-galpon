import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import { OPERATION_TYPES } from "../../model/constants";
import MainView from "../../components/MainView";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemList from "./itemList";
import ActionsBlock from "./actionsBlock";
import EmptyListSection from "./emptyListSection";
import iconEmpty from "../../assets/icons/empty_folder.png";

const itemAttrs = ["store_id", "product_id", "stock", "packs", "expiration_date"];

const getItem = (items,id) => items.find(item => item.id === id);

const isOperationAllowed = (operation, items, selected) => {
    const selectedItem = getItem(items, selected[0]);
    switch(operation){
        case "BUY":
            return selected.every(id => {
                const item = getItem(items,id);
                return item.product_id === selectedItem?.product_id && item.store_id === selectedItem?.store_id;
            });
        case "SPEND":
            return selected.length > 0 && selected.every(id => getItem(items,id).stock > 0);
        case "MOVE_STOCK":
            return selected.length > 0 && selected.every(id => {
                const item = getItem(items,id);
                return item.stock > 0 && item.store_id === selectedItem.store_id;
            });
        case "MOVE_PACKS":
            return selected.length > 0 && selected.every(id => {
                const item = getItem(items,id);
                return item.packs > 0 && item.store_id === selectedItem.store_id;
            });
        case "RETURN_PACKS":
            return selected.length > 0 && selected.every(id => getItem(items,id).packs > 0);
        default:
            return false;
    }
};

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();    
    const [items, setItems] = useState([]);
    const [ignoredCols, setIgnoredCols] = useState([]);
    const [selected, setSelected] = useState([]);

    const enabledOperations = Object.keys(OPERATION_TYPES).reduce((acc, key) => {
        acc[key] = isOperationAllowed(key, items, selected);
        return acc;
    }, {});

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
        if(enabledOperations[operationType]){
            const urlItemList = selected.length > 0 ? `&items=${selected.join("_")}` : "";
            const url = `/operations-form?type=${operationType}${urlItemList}`;
            console.log(url);
            navigate(url);
        }
        else
            console.error("Operation not allowed");
    };

    return (
        <MainView title={"Insumos"}>
            {ignoredCols.includes("product_id") && items.length > 0 && <ProductDetails productData={items[0]?.productData}/>}
            
            {ignoredCols.includes("store_id") && items.length > 0 && <StoreDetails storeData={items[0]?.storeData}/>}
            
            {items.length > 0 ? 
                <>
                    <ItemList 
                        items={items} 
                        ignoredCols={ignoredCols}
                        selected={selected}
                        setSelected={setSelected}/>
                    <ActionsBlock
                        enabledOperations={enabledOperations}
                        onBuy={() => handleOperation('BUY')}
                        onMoveStock={() => handleOperation('STOCK')}
                        onSpend={() => handleOperation('SPEND')}
                        onMovePack={() => handleOperation('PACKS')}
                        onReturn={() => handleOperation('RETURN_PACKS')}/>
                </>
                :
                <EmptyListSection message={"La lista de insumos está vacía"} icon={iconEmpty} />
            }
        </MainView>
    );
};


export default View;