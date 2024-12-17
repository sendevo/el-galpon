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

//const itemAttrs = ["id", "store_id", "product_id", "stock", "empty_packs", "expiration_date"];

const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const toast = useToast();
    const { t } = useTranslation('itemList');

    // Complete list of items
    const [items, setItems] = useState([]);
    const selectedItems = items.filter(it => it.selected);

    // TEMP
    const enabledOperations = ["BUY", "MOVE_STOCK", "RETURN_PACKS", "MOVE_PACKS", "SPEND"].reduce((acc, op) => {
        acc[op] = true;
        return acc;
    }, {});

    useEffect(() => {
        db.query("items", [], searchParams.toString())
            .then(iData => {
                setItems(iData.map(it => ({...it, selected: false})));
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
        <MainView title={t("returns")}>
            {false && <ProductDetails productData={items[0]?.productData}/>}
            {false && <StoreDetails storeData={items[0]?.storeData}/>}
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
                        columns={["id", "store_id", "product_id", "stock", "empty_packs", "expiration_date"]}/>

                    <OperationsBlock
                        enabledOperations={enabledOperations}
                        onOperation={handleOperation}
                        onExport={handleExport}/>
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