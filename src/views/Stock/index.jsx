import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
    Box, 
    Button, 
    Paper, 
    Grid, 
    Typography
} from "@mui/material";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import SearchForm from "../../components/SearchForm";
import EmptyList from "../../components/EmptyList";
import ProductDetails from "./productDetails";
import StoreDetails from "./storeDetails";
import ItemsTable from "./itemsTable";
import { componentsStyles } from "../../themes";


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
    const tableColumns = ["product_id", "stock", "store_id", "expiration_date"];

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

    useEffect(() => {
        db.query("items", [], searchParams.toString())
            .then(iData => {
                setItems(iData.map(it => ({
                    ...it, 
                    selected: emptyPacksView
                })));
            });
    }, []);

    const handleOperation = operationType => {// Redirect to operation form 
        if(operationType === "BUY_OTHER"){ // No product selected
            navigate("/products-list"); // Go to product list
        }else{ // Go to operation form            
            
            const itemIds = selectedItems.map(it => it.id).join("_");
            const itemsURLParams = selectedItems.length > 0 ? `&items=${itemIds}` : "";
            
            if(itemsURLParams === ""){ 
                console.error("Error redirecting to operation"); // Check buttons enabling logic
                toast(t("operationURLError"), "error");
                return;
            }
            
            const operationURL = `/operation-form?type=${operationType}${itemsURLParams}`;

            console.log(operationURL);

            navigate(operationURL);
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
        <MainView title={emptyPacksView ? t("returns") : t("stock")}>
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
                </Box>
                :
                <EmptyList message={!emptyPacksView ? t("empty_list") : t("empty_pack_list")}/>
            }
            
            {emptyPacksView ? 
                selectedItems.length > 0 &&
                    <Paper sx={{...componentsStyles.paper, mt:2}}>
                        <Box sx={{p:1}}>
                            <Button 
                                size="small"
                                fullWidth
                                color="red"
                                variant="contained"
                                onClick={()=>handleOperation("RETURN_PACKS")}>
                                {t('return')}
                            </Button>
                        </Box>
                    </Paper>
                :
                <Paper sx={{...componentsStyles.paper, mt:2}}>
                    { selectedItems.length > 0 && 
                        <>
                            <Typography sx={{mb:1}}>{t('selected')}</Typography>
                            <Grid container direction="row" justifyContent="space-around">
                                
                                <Grid item>
                                    <Button
                                        size="small"
                                        color="primary"
                                        variant="contained"
                                        onClick={()=>handleOperation("BUY")}>
                                        {t('buy')}
                                    </Button>
                                </Grid>
                                
                                <Grid item>
                                    <Button
                                        size="small"
                                        disabled={selectedItems.every(it => it.stock <= 0)}
                                        color="secondary"
                                        variant="contained"
                                        onClick={()=>handleOperation("MOVE_STOCK")}>
                                        {t('move')}
                                    </Button>
                                </Grid>
                                
                                <Grid item>
                                    <Button
                                        size="small"
                                        disabled={selectedItems.every(it => it.stock <= 0)}
                                        color="red"
                                        variant="contained"
                                        onClick={()=>handleOperation("SPEND")}>
                                        {t('spend')}
                                    </Button>
                                </Grid>
                                
                            </Grid>
                        </>
                    }
                    { selectedItems.length === 0 && !emptyPacksView &&
                        <Box sx={{p:1}}>
                            <Button 
                                size="small"
                                fullWidth
                                color="success"
                                variant="contained"
                                onClick={()=>handleOperation("BUY_OTHER")}>
                                {t('buy_other')}
                            </Button>
                        </Box>
                    }
                </Paper>
            }
            
        </MainView>
    );
};


export default View;