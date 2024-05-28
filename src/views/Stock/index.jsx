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

const itemAttrs = ["store_id", "product_id", "stock", "totalAmount", "packs", "expiration_date"];

const getItem = (items,id) => items.find(item => item.id === id);

const isOperationAllowed = (operation, items, selectedIds) => {
    const sameStore = selectedIds.every(id => getItem(items,id).store_id === getItem(items,selectedIds[0]).store_id);
    const moreThanOne = selectedIds.length > 0;
    return operation === "BUY" && moreThanOne || // When BUY = true: buy selected products else go to product list (enable other buy button)
        operation === "SPEND" && moreThanOne && selectedIds.every(id => getItem(items,id).stock > 0) || // Enabled if all selected items have stock (items with stock=0 should not be in the list)
        operation === "MOVE_STOCK" && moreThanOne && selectedIds.every(id => getItem(items,id).stock > 0 && sameStore) || // Enabled if all selected items have stock and are in different stores
        operation === "MOVE_PACKS" && moreThanOne && selectedIds.every(id => getItem(items,id).packs > 0 && sameStore) || // Enabled if all selected items have packs and are in different stores
        operation === "RETURN_PACKS" && moreThanOne && selectedIds.every(id => getItem(items,id).packs > 0); // Enabled if all selected items have packs
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
    const showActionBlock = Object.values(enabledOperations).splice(1).some(value => value) || enabledOperations.BUY;

    useEffect(() => {
        const ignored = [];
        searchParams.forEach((value, key) => {
            const params = key.split(":");
            if(params.length === 3){
                const paramKey = params[0];
                if(itemAttrs.includes(paramKey))
                    ignored.push(paramKey);
                else
                    console.log("Invalid param: ", paramKey, value);
            }else
                console.log("Invalid param: ", key, value);
        });
        db.query("items", [], searchParams.toString())
            .then(iData => {
                setItems(iData);
                setIgnoredCols(ignored);
            });
    }, []);

    const handleOperation = operationType => {
        if(operationType === "BUY" && !enabledOperations.BUY){ // No product selected
            navigate("/products-list"); // Go to product list
        }else{ // More than one selected -> go to operation form
            if(enabledOperations[operationType]){
                const products = selectedIds.map(id => getItem(items,id).product_id);
                const urlProductList = products.length > 0 ? `&products=${products.join("_")}` : "";
                const urlItemList = (selectedIds.length > 0 && operationType !=="BUY") ? `&items=${selectedIds.join("_")}` : "";
                navigate(`/operation-form?type=${operationType}${urlItemList}${urlProductList}`);
            } else {
                toast("Operación no permitida", "error");
                console.error("Operation not allowed:", operationType);
            }
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
                            onMoveStock={() => handleOperation('MOVE_STOCK')}
                            onSpend={() => handleOperation('SPEND')}
                            onMovePack={() => handleOperation('MOVE_PACKS')}
                            onReturn={() => handleOperation('RETURN_PACKS')}/>
                    }
                </Box>
                :
                <EmptyListSection message={"La lista de insumos está vacía"} icon={iconEmpty} />
            }
            
            { !enabledOperations.BUY &&
                <Box style={buyButtonStyle}>
                    <Button 
                        color="success"
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