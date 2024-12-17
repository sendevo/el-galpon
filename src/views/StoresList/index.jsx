import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
    Grid, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Checkbox, 
    Typography, 
    Box
} from '@mui/material';
import { ERROR_CODES } from "../../model/constants";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import MainView from "../../components/MainView";
import { Search } from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import { debug, latLng2GoogleMap, cropString } from "../../model/utils";
import iconEmpty from "../../assets/icons/empty_folder.png";
import { FaExternalLinkAlt } from "react-icons/fa";


const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const {t} = useTranslation('storesList');

    const toast = useToast();
    const confirm = useConfirm();
    
    useEffect(() => {
        db.query("stores")
            .then(setData)
            .catch(error => {
                toast(t("error_loading", "error"));
                debug(error, "error");
            });
    }, []);

    const handleSelect = storeId => {
        const selectedIndex = selected.indexOf(storeId);
        const newSelected = [...selected];
        if (selectedIndex === -1)
            newSelected.push(storeId);
        else
            newSelected.splice(selectedIndex, 1);
        setSelected(newSelected);
    };

    const handleSelectAll = selected => {
        if(selected)
            setSelected(data.map(d => d.id));
        else 
            setSelected([]);
    };

    const handleNew = () => navigate("/store-form");

    const handleEdit = () => {
        if(selected.length === 1){
            const storeId = selected[0];
            navigate(`/store-form?id=${storeId}`);
        }else{
            debug("Multpiple selection for edit", "error");
            setSelected([]);
        }
    };

    const handleStock = () => {
        if(selected.length === 1){
            const storeId = selected[0];
            navigate(`/stock?store_id:eq:${storeId}`);
        }else{
            debug("Multpiple selection for edit", "error");
            setSelected([]);
        }
    };

    const handleDelete = () => {
        confirm(
            t("confirm_operation"), 
            t("confirm_text"),
            () => { // On success
                const len = selected.length;
                db.delete("stores", selected)
                    .then(() => {
                        db.query("stores")
                            .then(updatedData => {
                                setData(updatedData);
                                setSelected([]);
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
                                    t("error_delete")
                                    , "error");
                        debug(error, "error");
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
            {data.length > 0 ?
                <Box sx={{mt:2}}>
                    
                    <TableContainer component={Paper} sx={componentsStyles.paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={componentsStyles.headerCell}>
                                        <Checkbox 
                                            checked={selected.length === data.length} 
                                            onChange={e => handleSelectAll(e.target.checked)} />
                                    </TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>{t('name')}</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>{t('location')}</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>{t('comments')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {data.map(store => (
                                <TableRow key={store.id}>
                                    <TableCell sx={componentsStyles.tableCell}>
                                        <Checkbox 
                                            checked={selected.indexOf(store.id) !== -1} 
                                            onChange={() => handleSelect(store.id)} />
                                    </TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{store.name || t('noname')}</TableCell>
                                    <TableCell sx={{...componentsStyles.tableCell, textAlign:"center"}}>
                                        {store.lat && store.lng ? 
                                            <Link 
                                                target="_blank"
                                                rel="nooreferrer"
                                                to={latLng2GoogleMap(store.lat, store.lng)}>
                                                    <FaExternalLinkAlt/>
                                            </Link>
                                            :
                                            "-"
                                        }
                                    </TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{cropString(store.comments || "-", 10)}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Paper sx={{...componentsStyles.paper, pl:2, pr:2, mt:2}}>
                        <Grid container sx={{mb:1}} direction={"column"}>
                            <Grid item>
                                <Typography sx={{fontWeight:"bold"}}>{t('actions')}</Typography>
                                {selected.length===0 && 
                                    <Typography sx={{...componentsStyles.hintText, mb:1}}>{t('selection')}</Typography>
                                }
                            </Grid>
                            <Grid item>
                                <Button
                                    fullWidth
                                    color="secondary"
                                    variant="contained"
                                    disabled={selected.length !== 1}
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
                                    disabled={selected.length > 0}
                                    color="success"
                                    variant="contained"
                                    onClick={handleNew}>
                                    {t('create')}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained"
                                    disabled={selected.length !== 1}
                                    onClick={handleEdit}>
                                    {t('edit')}    
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button     
                                    color="error"
                                    variant="contained"
                                    disabled={selected.length === 0}
                                    onClick={handleDelete}>
                                    {t('delete')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                :
                <Box 
                    display={"flex"} 
                    flexDirection={"column"} 
                    alignItems={"center"}
                    sx={{mt: "50%"}}>
                    <img src={iconEmpty} height="100px" alt="Sin datos" />
                    <Typography variant="h5" fontWeight={"bold"}>{t("no_stores_yet")}</Typography>
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