import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import { OPERATION_TYPES } from "../../model/constants";
import MainView from "../../components/MainView";
import SearchForm from "../../components/SearchForm";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemList from "./itemList";
import OperationsBlock from "./operationsBlock";
import EmptyList from "../../components/EmptyList";
import iconEmpty from "../../assets/icons/empty_folder.png";

const buyButtonStyle = {
    marginTop: "20px",
    display:"flex", 
    alignItems:"center", 
    justifyContent:"center"
};

const itemAttrs = ["store_id", "product_id", "stock", "totalAmount", "packs", "expiration_date"];

const isOperationAllowed = (operation, selectedItems) => {
    const moreThanOne = selectedItems.length > 0;
    return operation === "BUY" && moreThanOne || // When BUY = true: buy selected products else go to product list (enable other buy button)
        operation === "SPEND" && moreThanOne && selectedItems.every(it => it.stock > 0) || // Enabled if all selected items have stock
        operation === "MOVE_STOCK" && moreThanOne && selectedItems.every(it => it.stock > 0) || // Enabled if all selected items have stock
        operation === "MOVE_PACKS" && moreThanOne && selectedItems.every(it => it.packs > 0) || // Enabled if all selected items have packs
        operation === "RETURN_PACKS" && moreThanOne && selectedItems.every(it => it.packs > 0); // Enabled if all selected items have packs
};

const getEnabledOperations = (selectedItems) => {
    return Object.keys(OPERATION_TYPES).reduce((enabledOp, op) => {
        enabledOp[op] = isOperationAllowed(op, selectedItems);
        return enabledOp;
    }, {});
};

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const toast = useToast();

    const [items, setItems] = useState([]);
    const [ignoredCols, setIgnoredCols] = useState([]);

    const selectedItems = items.filter(it => it.selected);

    const enabledOperations = getEnabledOperations(selectedItems);
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
                setItems(iData.map(it => ({...it, selected: false})));
                setIgnoredCols(ignored);
            });
    }, []);

    const handleOperation = operationType => {
        if(operationType === "BUY" && !enabledOperations.BUY){ // No product selected
            navigate("/products-list"); // Go to product list
        }else{ // Go to operation form
            if(enabledOperations[operationType]){
                const products = selectedItems.map(it => it.product_id);
                const urlProductList = products.length > 0 ? `&products=${products.join("_")}` : "";
                const urlItemList = (selectedItems.length > 0 && operationType !=="BUY") ? `&items=${selectedItems.map(it => it.id).join("_")}` : "";
                navigate(`/operation-form?type=${operationType}${urlItemList}${urlProductList}`);
            } else {
                toast("Operación no permitida", "error");
                console.error("Operation not allowed:", operationType);
            }
        }
    };

    const handleSearch = query => {
        console.log(query);
    };

    const handleFilter = filters => {
        console.log(filters);
    };

    return (
        <MainView title={"Insumos"}>
            {ignoredCols.includes("product_id") && items.length > 0 && <ProductDetails productData={items[0]?.productData}/>}
            {ignoredCols.includes("store_id") && items.length > 0 && <StoreDetails storeData={items[0]?.storeData}/>}
            {items.length > 0 ? 
                <Box>
                    <SearchForm 
                        sx={{mb:2}}
                        fields={["categories", "expirable", "returnable", "dateFrom", "dateTo", "brand"]} 
                        onFiltersChange={handleFilter}
                        onQueryChange={handleSearch}/>
                    <ItemList 
                        items={items} 
                        setItems={setItems}
                        ignoredCols={ignoredCols}/>
                    {showActionBlock &&
                        <OperationsBlock
                            enabledOperations={enabledOperations}
                            onBuy={() => handleOperation('BUY')}
                            onMoveStock={() => handleOperation('MOVE_STOCK')}
                            onSpend={() => handleOperation('SPEND')}
                            onMovePack={() => handleOperation('MOVE_PACKS')}
                            onReturn={() => handleOperation('RETURN_PACKS')}/>
                    }
                </Box>
                :
                <EmptyList message={"La lista de insumos está vacía"} icon={iconEmpty} />
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