import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import i18next from "i18next";
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
import moment from "moment";
import { ERROR_CODES } from "../../model/constants";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import MainView from "../../components/MainView";
import SearchForm from "../../components/SearchForm";
import EmptyList from "../../components/EmptyList";
import { componentsStyles } from "../../themes";
import { debug, cropString } from "../../model/utils";
import { FaCheck, FaTimes } from "react-icons/fa";

const attributes = ["name", "presentation", "expirable", "returnable", "brand", "sku", "comments", "categories", "created", "modified"];
const HeaderCell = ({ attribute }) => {
    return (
        <TableCell sx={componentsStyles.headerCell}>
            {attribute}
        </TableCell>
    );
};

const View = () => {

    const navigate = useNavigate();
    
    const db = useDatabase();   

    const { t } = useTranslation('productsList');
    
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    
    const toast = useToast();
    const confirm = useConfirm();

    const getPresentation = product => {
        let presentation = "";
        for(let p = 0; p < product.pack_sizes.length; p++){
            if(product.pack_sizes[p] === -1){ // Bulk
                presentation = `${t(product.pack_units[p])} (${t("bulk")})`;
            }else{
                presentation = `${product.pack_sizes[p]} ${t(product.pack_units[p])}`;
            }
        }
        return presentation;
    };

    useEffect(() => {
        db.query("products")
            .then(setData)
            .catch(error => {
                toast(t("error_loading"), "error");
                debug(error, "error");
            });
    }, []);

    const handleSelect = productId => {
        const selectedIndex = selected.indexOf(productId);
        const newSelected = [...selected];
        if (selectedIndex === -1)
            newSelected.push(productId);
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

    const handleNew = () => navigate("/product-form");

    const handleBuy = () => {
        const products = selected.join("_");
        navigate(`/operation-form?type=BUY&products=${products}`);
    };
        
    const handleEdit = () => {
        if(selected.length === 1){
            const productId = selected[0];
            navigate(`/product-form?id=${productId}`);
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
                db.delete("products", selected)
                    .then(() => {
                        db.query("products")
                            .then(updatedData => {
                                setData(updatedData);
                                setSelected([]);
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
                                t("cannot_delete_with_sotck")
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
                        fields={["categories", "expirable", "returnable", "dateFrom", "dateTo", "brand"]} 
                        onFiltersChange={handleFilter}
                        onQueryChange={handleSearch}/>
                    <TableContainer component={Paper} sx={componentsStyles.paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={componentsStyles.headerCell}>
                                        <Checkbox 
                                            checked={selected.length === data.length} 
                                            onChange={e => handleSelectAll(e.target.checked)} />
                                    </TableCell>
                                    {attributes.map((attr, index) => (
                                        <HeaderCell key={index} attribute={t(attr)} />
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {data.map(product => (
                                <TableRow key={product.id}>
                                    <TableCell sx={componentsStyles.tableCell}>
                                        <Checkbox 
                                            checked={selected.indexOf(product.id) !== -1} 
                                            onChange={() => handleSelect(product.id)} />
                                    </TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{product.name || "Sin nombre"}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{getPresentation(product)}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{product.expirable ? <FaCheck color="green"/> : <FaTimes color="red"/>}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{product.returnable ? <FaCheck color="green"/> : <FaTimes color="red"/>}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{product.brand || "-"}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{product.sku || ""}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{cropString(product.comments || "-", 10)}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{product.categories?.join(', ') || "-"}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{moment(product.created).format("DD/MM/YYYY HH:mm")}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{moment(product.modified).format("DD/MM/YYYY HH:mm")}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
                        <Grid container sx={{mb:1}} direction={"column"}>
                            <Grid item>
                                <Typography sx={{fontWeight:"bold"}}>{t("actions")}</Typography>
                            </Grid>
                            <Grid item mb={1}>
                                {selected.length===0 && <Typography sx={componentsStyles.hintText}>{t("select_one_or_more")}</Typography>}
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
                                            disabled={selected.length === 0}
                                            variant="contained"
                                            onClick={handleBuy}>
                                            {t("buy")}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            disabled={selected.length !== 1}
                                            onClick={handleEdit}>
                                            {t("edit")}       
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button     
                                            color="red"
                                            variant="contained"
                                            disabled={selected.length === 0}
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
                                        disabled={selected.length !== 0}
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