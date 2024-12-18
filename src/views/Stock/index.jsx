import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Box, Button } from "@mui/material";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
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

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const toast = useToast();
    const { t } = useTranslation('itemList');

    // Complete list of items
    const [items, setItems] = useState([]);
    const selectedItems = items.filter(it => it.selected);

    // Default table columns. Some are removed depending of following conditions
    const tableColumns = ["product_id", "store_id", "stock", "expiration_date"];

    // Check if all items have same store_id
    const sameStore = items.length > 0 && items.every(it => it.store_id === items[0].store_id);
    // If same store, remove store_id column
    if(sameStore){
        const index = tableColumns.indexOf("store_id");
        if(index > -1) tableColumns.splice(index, 1);
    }

    // Check if all items have same product_id
    let sameProduct = items.length > 0 && items.every(it => it.product_id === items[0].product_id);
    // If the store has a unique product, do not show productDetails card 
    if(sameStore && sameProduct) 
        sameProduct = false; 
    // If same product, remove product_id column
    if(sameProduct){
        const index = tableColumns.indexOf("product_id");
        if(index > -1) tableColumns.splice(index, 1);
    }

    // Check if query string is empty_packs:gt:0 (used when coming from returns menu)
    const decodedSearchParams = decodeURIComponent(searchParams.toString());
    const emptyPacksView = decodedSearchParams === "empty_packs:gt:0=";
    // If the table needs to show empty packs only, then remove stock column, and add the empty_packs column instead
    if(emptyPacksView){
        const index = tableColumns.indexOf("stock");
        if(index > -1) tableColumns[index] = "empty_packs";
    }

    // TODO: TEMP
    const enabledOperations = ["BUY", "BUY_OTHER", "MOVE_STOCK", "RETURN_PACKS", "MOVE_PACKS", "SPEND"].reduce((acc, op) => {
        acc[op] = true;
        return acc;
    }, {});

    useEffect(() => {
        db.query("items", [], searchParams.toString())
            .then(iData => {
                setItems(iData.map(it => ({
                    ...it, 
                    selected: false
                })));
            });
    }, []);

    const handleOperation = operationType => {// Redirect to operation form 
        if(operationType === "BUY_OTHER"){ // No product selected
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
        <MainView title={t("stock")}>
            <SearchForm 
                sx={{mb:2}}
                fields={["categories", "expirable", "returnable", "dateFrom", "dateTo", "brand"]} 
                onFiltersChange={handleFilter}
                onQueryChange={handleSearch}/>

            {sameStore && <StoreDetails storeData={items[0]?.storeData}/>}
            {sameProduct && <ProductDetails productData={items[0]?.productData}/>}
            
            {items.length > 0 ? 
                <Box>
                    <ItemsTable 
                        items={items} 
                        setItems={setItems}
                        columns={tableColumns}/>

                    {/*
                    <OperationsBlock
                        enabledOperations={enabledOperations}
                        onOperation={handleOperation}
                        onExport={handleExport}/>
                    */}
                </Box>
                :
                <EmptyList message={t("emptyList")}/>
            }
            
            { enabledOperations.BUY_OTHER &&
                <Box style={buyButtonStyle}>
                    <Button 
                        color="success"
                        variant="contained"
                        onClick={()=>handleOperation("BUY_OTHER")}>
                        {t('buy')}
                    </Button>
                </Box>
            }
            
        </MainView>
    );
};


export default View;