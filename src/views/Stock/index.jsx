import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
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

const isOperationAllowed = (operation, items, selectedIds) => {
    const sameStore = selectedIds.every(id => getItem(items,id).store_id === getItem(items,selectedIds[0]).store_id);
    if(operation !== "BUY" && !sameStore) // Cannot move or spend items from different stores
        return false;
    else{
        const selectedItem = getItem(items, selectedIds[0]);
        switch(operation){    
            case "BUY": // BUY = true: buy selected products. Buy = false: buy other products
                return selectedIds.length > 0;
            case "SPEND":
                return selectedIds.length > 0 && selectedIds.every(id => getItem(items,id).stock > 0);
            case "MOVE_STOCK":
                return selectedIds.length > 0 && selectedIds.every(id => {
                    const item = getItem(items,id);
                    return item.stock > 0 && item.store_id === selectedItem.store_id;
                });
            case "MOVE_PACKS":
                return selectedIds.length > 0 && selectedIds.every(id => {
                    const item = getItem(items,id);
                    return item.packs > 0 && item.store_id === selectedItem.store_id;
                });
            case "RETURN_PACKS":
                return selectedIds.length > 0 && selectedIds.every(id => getItem(items,id).packs > 0);
            default:
                return false;
        }
    }
};

const getEnabledOperations = (items, selectedIds) => {
    return Object.keys(OPERATION_TYPES).reduce((acc, key) => {
        acc[key] = isOperationAllowed(key, items, selectedIds);
        return acc;
    }, {});
};

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const toast = useToast();

    const [items, setItems] = useState([]);
    const [ignoredCols, setIgnoredCols] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const enabledOperations = getEnabledOperations(items, selectedIds);
    const showActionBlock = Object.values(enabledOperations).splice(1).some(value => value);

    useEffect(() => {
        let filters = {}; // Filter names and their values
        let filterComparators = {}; // 
        let ignored = [];
        for(let index = 0; index < itemAttrs.length; index++){
            const paramValue = searchParams.get(itemAttrs[index]);
            if(!isNaN(paramValue)){
                if(paramValue){
                    filters[itemAttrs[index]] = parseInt(paramValue);
                    ignored.push(itemAttrs[index]);
                }
            }
        }
        console.log("Filters", filters);
        db.query("items", [], filters)
            .then(iData => {
                setItems(iData);
                setIgnoredCols(ignored);
            });
    }, []);

    const handleOperation = operationType => {
        if(enabledOperations[operationType]){
            const products = selectedIds.map(id => getItem(items,id).product_id);
            const urlProductList = products.length > 0 ? `&products=${products.join("_")}` : "";
            const urlItemList = selectedIds.length > 0 && operationType !=="BUY" ? `&items=${selectedIds.join("_")}` : "";
            navigate(`/operation-form?type=${operationType}${urlItemList}${urlProductList}`);
        } else {
            toast("Operación no permitida", "error");
            console.error("Operation not allowed");
        }
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
                        selected={selectedIds}
                        setSelected={setSelectedIds}/>
                    {showActionBlock &&
                        <ActionsBlock
                            enabledOperations={enabledOperations}
                            onBuy={() => handleOperation('BUY')}
                            onMoveStock={() => handleOperation('STOCK')}
                            onSpend={() => handleOperation('SPEND')}
                            onMovePack={() => handleOperation('PACKS')}
                            onReturn={() => handleOperation('RETURN_PACKS')}/>
                    }
                </Box>
                :
                <EmptyListSection message={"La lista de insumos está vacía"} icon={iconEmpty} />
            }
            
            { !enabledOperations.BUY &&
                <Box style={buyButtonStyle}>
                    <Button 
                        color="green"
                        variant="contained"
                        onClick={()=>handleOperation("BUY")}>
                        Comprar insumos
                    </Button>
                </Box>
            }
        </MainView>
    );
};


export default View;