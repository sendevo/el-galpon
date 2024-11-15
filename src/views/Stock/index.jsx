import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Box, Button } from "@mui/material";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import { OPERATION_TYPES } from "../../model/constants";
import MainView from "../../components/MainView";
import SearchForm from "../../components/SearchForm";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemsTable from "./itemsTable";
import OperationsBlock from "./operationsBlock";
import EmptyList from "../../components/EmptyList";

const buyButtonStyle = {
    marginTop: "20px",
    display:"flex", 
    alignItems:"center", 
    justifyContent:"center"
};

const isOperationAllowed = (operation, selectedItems) => { // Button status based on selected items
    const moreThanOne = selectedItems.length > 0;
    return operation === "BUY" && moreThanOne || // When BUY = true: buy selected products else go to product list (enable other buy button)
        operation === "SPEND" && moreThanOne && selectedItems.every(it => it.stock > 0) || // Enabled if all selected items have stock
        operation === "MOVE_STOCK" && moreThanOne && selectedItems.every(it => it.stock > 0) || // Enabled if all selected items have stock
        operation === "MOVE_PACKS" && moreThanOne && selectedItems.every(it => it.empty_packs > 0) || // Enabled if all selected items have packs
        operation === "RETURN_PACKS" && moreThanOne && selectedItems.every(it => it.empty_packs > 0); // Enabled if all selected items have packs
};

const getEnabledOperations = (selectedItems) => { // Get enabled operations based on selected items
    const enabledOperations = Object.keys(OPERATION_TYPES).reduce((enabledOp, op) => {
        enabledOp[op] = isOperationAllowed(op, selectedItems);
        return enabledOp;
    }, {});
    return enabledOperations;
};

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const toast = useToast();

    const [items, setItems] = useState([]);
    const [ignoredCols, setIgnoredCols] = useState([]);
    const [viewTitle, setViewTitle] = useState("title");

    const { t } = useTranslation('itemList');

    const selectedItems = items.filter(it => it.selected);

    const enabledOperations = getEnabledOperations(selectedItems);
    const showActionBlock = Object.values(enabledOperations).splice(1).some(value => value) || enabledOperations.BUY;

    const itemAttrs = ["id", "store_id", "product_id", "stock", "empty_packs", "expiration_date"];

    useEffect(() => {
        const ignored = [];
        searchParams.forEach((value, key) => {
            const params = key.split(":");
            if(params.length === 3){
                const paramKey = params[0];
                if(paramKey !== "empty_packs"){
                    if(itemAttrs.includes(paramKey))
                        ignored.push(paramKey);
                }else{
                    setViewTitle("returns");
                }
            }else{
                console.log("Invalid param: ", key, value);
            }
        });
        db.query("items", [], searchParams.toString())
            .then(iData => {
                setItems(iData.map(it => ({...it, selected: false})));
                setIgnoredCols(ignored);
            });
    }, []);

    const handleOperation = operationType => {// Redirect to operation form 
        if(operationType === "BUY" && !enabledOperations.BUY){ // No product selected
            navigate("/products-list"); // Go to product list
        }else{ // Go to operation form
            if(enabledOperations[operationType]){
                const products = selectedItems.map(it => it.product_id);
                const urlProductList = products.length > 0 ? `&products=${products.join("_")}` : "";
                const urlItemList = (selectedItems.length > 0 && operationType !=="BUY") ? `&items=${selectedItems.map(it => it.id).join("_")}` : "";
                navigate(`/operation-form?type=${operationType}${urlItemList}${urlProductList}`);
            } else {
                toast(t('operationError'), "error");
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

    const handleExport = () => {
        toast(t('not_available'), "info");
    };

    return (
        <MainView title={t(viewTitle)}>
            {ignoredCols.includes("product_id") && items.length > 0 && <ProductDetails productData={items[0]?.productData}/>}
            {ignoredCols.includes("store_id") && items.length > 0 && <StoreDetails storeData={items[0]?.storeData}/>}
            {items.length > 0 ? 
                <Box>
                    <SearchForm 
                        sx={{mb:2}}
                        fields={["categories", "expirable", "returnable", "dateFrom", "dateTo", "brand"]} 
                        onFiltersChange={handleFilter}
                        onQueryChange={handleSearch}/>
                    <ItemsTable 
                        items={items} 
                        setItems={setItems}
                        ignoredCols={ignoredCols}/>
                    {/*handleOperation(TYPE) redirect to operation-form with operation parameters*/}
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
                <EmptyList message={"La lista de insumos está vacía"}/>
            }
            
            { !enabledOperations.BUY &&
                <Box style={buyButtonStyle}>
                    <Button 
                        color="success"
                        variant="contained"
                        onClick={()=>handleOperation("BUY")}>
                        {t('buy')}
                    </Button>
                </Box>
            }
            <Box sx={buyButtonStyle}>
                <Button
                    color="info"
                    variant="contained"
                    onClick={() => toast("Funcionalidad aún no disponible")}>
                    {t('export')}
                </Button>
            </Box>
        </MainView>
    );
};


export default View;