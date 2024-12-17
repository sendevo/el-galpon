import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
    Grid, 
    Button, 
    Paper, 
    Typography, 
    Box 
} from '@mui/material';
import ProductsTable from "./productsTable";
import { ERROR_CODES } from "../../model/constants";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import MainView from "../../components/MainView";
import SearchForm from "../../components/SearchForm";
import EmptyList from "../../components/EmptyList";
import { componentsStyles } from "../../themes";
import { debug } from "../../model/utils";


const View = () => {

    const db = useDatabase();   
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation('productsList');
    
    const [data, setData] = useState([]);    
    const selectedProducts = data.filter(p => p.selected);
    
    const confirm = useConfirm();

    useEffect(() => {
        db.query("products")
            .then(pData => {
                setData(pData.map(p => ({
                    ...p, 
                    selected: false
                })));
            })
            .catch(error => {
                toast(t("error_loading"), "error");
                debug(error, "error");
            });
    }, []);

    const handleNew = () => navigate("/product-form");

    const unSelectAll = () => setData(prevProducts => prevProducts.map(p => ({...p, selected: false})));

    const handleBuy = () => {
        const products = selectedProducts.map(p => p.id).join("_");
        navigate(`/operation-form?type=BUY&products=${products}`);
    };
        
    const handleEdit = () => {
        if(selectedProducts.length === 1){
            const index = data.findIndex(p => p.selected);
            const productId = data[index].id;
            navigate(`/product-form?id=${productId}`);
        }else{
            debug("Multpiple selection for edit", "error");
            unSelectAll();
        }
    };

    const handleDelete = () => {
        confirm(
            t("confirm_operation"),
            t("confirm_text"),
            () => { // On success
                const len = selectedProducts.length;
                const ids = selectedProducts.map(p => p.id);
                db.delete("products", ids)
                    .then(() => {
                        db.query("products")
                            .then(updatedData => {
                                setData(updatedData);
                                unSelectAll();
                                toast(len > 1 ? 
                                    t("prod_deleted_plural", {len})
                                    :
                                    t("prod_deleted_singular", {len}), 
                                "success");
                            })
                            .catch(error => {
                                toast(t("error_delete"), "error");
                                debug(error, "error");
                            });
                    })
                    .catch(error => {
                        toast(
                        error.type === ERROR_CODES.DB.WITH_ITEMS ? 
                                t("cannot_delete_with_stock")
                                :
                                t("error_delete")
                                , "error");
                        console.error(error);
            }       );
            }
        );
    };

    const handleSearch = query => {
        console.log(query);
    };

    const handleFilter = filters => {
        console.log(filters);
    };

    return(
        <MainView title={"Productos"}>
            {data.length > 0 ?
                <Box>
                    <SearchForm 
                        sx={{mb:2}}
                        fields={["categories", "expirable", "returnable", "brand"]} 
                        onFiltersChange={handleFilter}
                        onQueryChange={handleSearch}/>

                    <ProductsTable products={data} setProducts={setData}/>
                    
                    <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
                        <Grid container sx={{mb:1}} direction={"column"}>
                            <Grid item>
                                <Typography sx={{fontWeight:"bold"}}>{t("actions")}</Typography>
                            </Grid>
                            <Grid item mb={1}>
                                {selectedProducts.length===0 && <Typography sx={componentsStyles.hintText}>{t("select_one_or_more")}</Typography>}
                            </Grid>
                            <Grid item>
                                <Grid 
                                    container 
                                    direction="row"
                                    spacing={0}
                                    justifyContent="space-between">
                                    <Grid item>
                                        <Button 
                                            color="success"
                                            disabled={selectedProducts.length === 0}
                                            variant="contained"
                                            onClick={handleBuy}>
                                            {t("buy")}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            disabled={selectedProducts.length !== 1}
                                            onClick={handleEdit}>
                                            {t("edit")}       
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button     
                                            color="red"
                                            variant="contained"
                                            disabled={selectedProducts.length === 0}
                                            onClick={handleDelete}>
                                            {t("delete")}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent={"center"} alignItems={"center"}>
                                <Grid item>
                                    <Button 
                                        sx={{mt: 2}}
                                        disabled={selectedProducts.length !== 0}
                                        variant="contained"
                                        onClick={handleNew}>
                                        {t("create_new")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                :
                <Box 
                    display={"flex"} 
                    flexDirection={"column"} 
                    alignItems={"center"}>
                    <EmptyList message={"La lista de productos está vacía"}/>
                    <Button 
                        sx={{mt: 2}}
                        variant="contained"
                        onClick={handleNew}>
                        {t("create_new")}
                    </Button>
                </Box>
            }
        </MainView>
    );
};

export default View;