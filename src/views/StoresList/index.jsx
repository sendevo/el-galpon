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
import { ERROR_CODES } from "../../model/constants";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import StoresTable from "./storesTable";
import MainView from "../../components/MainView";
import { Search } from "../../components/Inputs";
import EmptyList from "../../components/EmptyList";
import { componentsStyles } from "../../themes";


const View = () => {
    const db = useDatabase();   
    const navigate = useNavigate();
    const toast = useToast();
    const {t} = useTranslation('storesList');

    const [stores, setStores] = useState([]);
    const selectedStores = stores.filter(st => st.selected);
    
    const confirm = useConfirm();
    
    useEffect(() => {
        db.query("stores")
            .then( sData => {
                setStores(sData.map(st => ({
                    ...st, 
                    selected: false
                })));
            })
            .catch(error => {
                toast(t("error_loading", "error"));
                console.error(error);
            });
    }, []);

    const handleNew = () => navigate("/store-form");

    const unSelectAll = () => setStores(prevStores => prevStores.map(st => ({...st, selected: false})));

    const handleEdit = () => {
        if(selectedStores.length === 1){
            const index = stores.findIndex(st => st.selected);
            const storeId = stores[index].id;
            navigate(`/store-form?id=${storeId}`);
        }else{
            console.log("Multpiple selection for edit");
            unSelectAll();
        }
    };

    const handleStock = () => {
        if(selectedStores.length === 1){
            const index = stores.findIndex(st => st.selected);
            const storeId = stores[index].id;;
            navigate(`/stock?store_id:eq:${storeId}`);
        }else{
            console.error("Multpiple selection for edit");
            unSelectAll();
        }
    };

    const handleDelete = () => {
        confirm(
            t("confirm_operation"), 
            t("confirm_text"),
            () => { // On success
                const len = selectedStores.length;
                const ids = selectedStores.map(st => st.id);
                db.delete("stores", ids)
                    .then(() => {
                        db.query("stores")
                            .then(updatedData => {
                                setStores(updatedData);
                                unSelectAll();
                                toast
                                    (len > 1 ? 
                                        t("loc_deleted_plural", {len})
                                        :
                                        t("loc_deleted_singular", {len}), 
                                    "success"
                                );
                            });
                    })
                    .catch(error => {
                        toast(
                            error.type === ERROR_CODES.DB.WITH_ITEMS ? 
                                    t("cannot_delete_with_stock")
                                    :
                                    t("error_delete"), "error");
                            console.error(error);
                    });
            }
        );
    };

    const handleSearch = query => {
        console.log(query);
    };

    return(
        <MainView title={t('title')}>
            <Paper sx={componentsStyles.paper}>
                <Search submit={handleSearch}/>
            </Paper>
            {stores.length > 0 ?
                <Box sx={{mt:2}}>
                    
                    <StoresTable stores={stores} setStores={setStores}/>

                    <Paper sx={{...componentsStyles.paper, pl:2, pr:2, mt:2}}>
                        <Grid container sx={{mb:1}} direction={"column"}>
                            <Grid item>
                                <Typography sx={{fontWeight:"bold"}}>{t('actions')}</Typography>
                                {selectedStores.length===0 && 
                                    <Typography sx={{...componentsStyles.hintText, mb:1}}>{t('selection')}</Typography>
                                }
                            </Grid>
                            <Grid item>
                                <Button
                                    fullWidth
                                    color="secondary"
                                    variant="contained"
                                    disabled={selectedStores.length !== 1}
                                    onClick={handleStock}>
                                    {t('stock')}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid 
                            container 
                            direction="row"
                            spacing={0} 
                            justifyContent="space-between">
                            <Grid item>
                                <Button 
                                    disabled={selectedStores.length > 0}
                                    color="success"
                                    variant="contained"
                                    onClick={handleNew}>
                                    {t('create')}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained"
                                    disabled={selectedStores.length !== 1}
                                    onClick={handleEdit}>
                                    {t('edit')}    
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button     
                                    color="error"
                                    variant="contained"
                                    disabled={selectedStores.length === 0}
                                    onClick={handleDelete}>
                                    {t('delete')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                :
                <Box sx={{p: 1}}>    
                    <EmptyList message={t('empty_list')} />
                    <Paper sx={{...componentsStyles.paper, mt:2}}>
                        <Button 
                            size="small"
                            fullWidth
                            color="success"
                            variant="contained"
                            onClick={handleNew}>
                                {t("create_new")}
                        </Button>
                    </Paper>
                </Box>
            }
        </MainView>
    );
};

export default View;