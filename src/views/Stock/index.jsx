import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useDatabase } from "../../context/Database";
import { OPERATION_TYPES } from "../../model/constants";
import MainView from "../../components/MainView";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemList from "./itemList";
import ActionsBlock from "./actionsBlock";
import EmptyListSection from "./emptyListSection";
import iconEmpty from "../../assets/icons/empty_folder.png";

const buyButtonStyle = {
    marginTop: "20px",
    display:"flex", 
    alignItems:"center", 
    justifyContent:"center"
};

const itemAttrs = ["store_id", "product_id", "stock", "packs", "expiration_date"];

const getItem = (items,id) => items.find(item => item.id === id);

const isOperationAllowed = (operation, items, selected) => {
    const selectedItem = getItem(items, selected[0]);
    switch(operation){
        case "BUY":
            return selected.every(id => {
                const item = getItem(items,id);
                return item.product_id === selectedItem?.product_id;
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

const getEnabledOperations = (items, selected) => {
    return Object.keys(OPERATION_TYPES).reduce((acc, key) => {
        acc[key] = isOperationAllowed(key, items, selected);
        return acc;
    }, {});
};

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();    
    const [items, setItems] = useState([]);
    const [ignoredCols, setIgnoredCols] = useState([]);
    const [selected, setSelected] = useState([]);

    const enabledOperations = getEnabledOperations(items, selected);
    const showActionBlock = Object.values(enabledOperations).splice(1).some(value => value);

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
            let url = "";
            if(operationType === "BUY"){
                if(selected.length === 0)
                    url = `/products-list?type=BUY`;
                else{
                    const sameProduct = selected.every(id => getItem(items,id).product_id === getItem(items,selected[0]).product_id);
                    if(sameProduct){
                        const storesIds = selected.map(id => getItem(items,id).store_id);
                        url = `/operation-form?type=BUY&product=${getItem(items,selected[0]).product_id}&stores=${storesIds.join("_")}`;
                    }
                }
            }else{
                const urlItemList = selected.length > 0 ? `&items=${selected.join("_")}` : "";
                url = `/operation-form?type=${operationType}${urlItemList}`;
            }
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
                <Box>
                    <ItemList 
                        items={items} 
                        ignoredCols={ignoredCols}
                        selected={selected}
                        setSelected={setSelected}/>
                    {showActionBlock &&
                        <ActionsBlock
                            enabledOperations={enabledOperations}
                            onMoveStock={() => handleOperation('STOCK')}
                            onSpend={() => handleOperation('SPEND')}
                            onMovePack={() => handleOperation('PACKS')}
                            onReturn={() => handleOperation('RETURN_PACKS')}/>
                    }
                </Box>
                :
                <EmptyListSection message={"La lista de insumos está vacía"} icon={iconEmpty} />
            }
            <Box style={buyButtonStyle}>
                <Button 
                    disabled={!enabledOperations.BUY}
                    color="green"
                    variant="contained"
                    onClick={()=>handleOperation("BUY")}>
                    Comprar insumos
                </Button>
            </Box>
        </MainView>
    );
};


export default View;