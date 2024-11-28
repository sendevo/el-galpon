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

//const itemAttrs = ["id", "store_id", "product_id", "stock", "empty_packs", "expiration_date"];

const getEnabledOperations = selectedItems => { // Get enabled operations based on selected items
    // Returned object's format is, for example:
    // {BUY: true, MOVE_STOCK: false, SPEND: false, MOVE_PACKS: false, RETURN_PACKS: false}

    const isOperationAllowed = operation => { //Check allowed operations based on selected items
        const moreThanOne = selectedItems.length > 0; // At least one item selected
        if(moreThanOne){
            return operation === "BUY" || // When BUY = true: buy selected products else go to product list (enable other buy button)
                operation === "SPEND" && selectedItems.every(it => it.stock > 0) || // Enabled if all selected items have stock
                operation === "MOVE_STOCK" && selectedItems.every(it => it.stock > 0) || // Enabled if all selected items have stock
                operation === "MOVE_PACKS" && selectedItems.every(it => it.empty_packs > 0) || // Enabled if all selected items have packs
                operation === "RETURN_PACKS" && selectedItems.every(it => it.empty_packs > 0); // Enabled if all selected items have packs
        }
        return false;
    };

    const enabledOperations = Object.keys(OPERATION_TYPES)
        .reduce((operationTypes, operation) => {
            operationTypes[operation] = isOperationAllowed(operation);
            return operationTypes;
        }, {});
    return enabledOperations;
};

const getIgnoredColumns = searchParams => { // Get ignored columns based on search params
    const ignored = ["empty_packs"]; // List of ignored columns. By default, empty packs are not shown
    let title = "title"; // Default title
    // Search params are used to filter item
    searchParams.forEach((value, key) => { // searchParams has forEach method, but it is not an array
        const params = key.split(":"); // Conditions are separated by ":", e.g. empty_packs:gt:0 (more than 0 empty packs)
        if(params.length === 3){ // Number of params should be 3: attribute, operator, value
            const paramKey = params[0];
            // For the case of pack returns, hide the stock column and show the empty packs column
            if(paramKey === "empty_packs"){
                title = "returns";
                ignored.push("stock");
                const index = ignored.indexOf(paramKey);
                if (index > -1) {
                    ignored.splice(index, 1);
                }
            }
            ignored.push(paramKey);
        }else{
            console.log("Invalid param: ", key, value);
            toast(t('invalidParam'), "info");
        }
    });
    return {ignored, title};
}

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const toast = useToast();
    const { t } = useTranslation('itemList');

    // Complete list of items
    const [items, setItems] = useState([]);

    // When listing filtered items, some columns are ignored
    const [ignoredCols, setIgnoredCols] = useState([]); 

    // If the view shows list of empty packs only, the title is "returns"    
    const [viewTitle, setViewTitle] = useState("title"); // Default title

    const selectedItems = items.filter(it => it.selected);

    const enabledOperations = getEnabledOperations(selectedItems);
    const showActionBlock = Object.values(enabledOperations).splice(1).some(value => value) || enabledOperations.BUY;

    useEffect(() => {
        const {ignored, title} = getIgnoredColumns(searchParams);
        db.query("items", [], searchParams.toString())
            .then(iData => {
                setItems(iData.map(it => ({...it, selected: false})));
                setIgnoredCols(ignored);
                setViewTitle(title);
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
        toast(t('notAvailable'), "info");
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
                        ignoredCols={[...ignoredCols]}/>

                    {/*handleOperation(TYPE) redirect to operation-form with operation parameters*/}
                    {showActionBlock &&
                        <OperationsBlock
                            enabledOperations={enabledOperations}
                            onBuy={() => handleOperation('BUY')}
                            onMoveStock={() => handleOperation('MOVE_STOCK')}
                            onSpend={() => handleOperation('SPEND')}
                            onMovePack={() => handleOperation('MOVE_PACKS')}
                            onReturn={() => handleOperation('RETURN_PACKS')}
                            onExport={handleExport}/>
                    }
                </Box>
                :
                <EmptyList message={t("emptyList")}/>
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
            
        </MainView>
    );
};


export default View;