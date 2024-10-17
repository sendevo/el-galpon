import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { componentsStyles } from "../../themes";
import { debug, latLng2GoogleMap, cropString } from "../../model/utils";
import iconEmpty from "../../assets/icons/empty_folder.png";
import { FaExternalLinkAlt } from "react-icons/fa";


const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);

    const toast = useToast();
    const confirm = useConfirm();
    
    useEffect(() => {
        db.query("stores")
            .then(setData)
            .catch(error => {
                toast("Error al cargar depósitos", "error");
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
            "Confirmar operación", 
            "¿Desea eliminar los ítems seleccionados?",
            () => { // On success
                const len = selected.length;
                db.delete("stores", selected)
                    .then(() => {
                        db.query("stores")
                            .then(updatedData => {
                                setData(updatedData);
                                setSelected([]);
                                toast(`Se ${len > 1 ? "eliminaron":"eliminó"} ${len} depósito${len>1 ? "s":""}`, "success");
                            });
                    })
                    .catch(error => {
                        toast(
                            error.type === ERROR_CODES.DB.WITH_ITEMS ? 
                                    "No se puede eliminar depósitos con stock"
                                    :
                                    "Error al eliminar productos"
                                    , "error");
                        debug(error, "error");
                    });
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
        <MainView title={"Depósitos"}>
            <SearchForm 
                fields={["dateFrom", "dateTo"]} 
                onFiltersChange={handleFilter}
                onQueryChange={handleSearch}/>
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
                                    <TableCell sx={componentsStyles.headerCell}>Nombre</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Ubicación</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Comentarios</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Creado</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Modificado</TableCell>
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
                                    <TableCell sx={componentsStyles.tableCell}>{store.name || "Sin nombre"}</TableCell>
                                    <TableCell sx={{...componentsStyles.tableCell, textAlign:"center"}}>
                                        <Link 
                                            target="_blank"
                                            rel="nooreferrer"
                                            to={latLng2GoogleMap(store.lat, store.lng)}>
                                                <FaExternalLinkAlt/>
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{cropString(store.comments || "-", 10)}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{moment(store.created).format("DD/MM/YYYY HH:mm")}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{moment(store.modified).format("DD/MM/YYYY HH:mm")}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
                        <Grid container sx={{mb:1}} direction={"column"}>
                            <Typography sx={{fontWeight:"bold"}}>Acciones</Typography>
                            {selected.length===0 && <Typography sx={componentsStyles.hintText}>Seleccione uno o más insumos</Typography>}
                        </Grid>
                        <Grid 
                            container 
                            direction="row"
                            spacing={0} 
                            justifyContent="space-between">
                            <Grid item>
                                <Button 
                                    color="success"
                                    variant="contained"
                                    onClick={handleNew}>
                                    Crear
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained"
                                    disabled={selected.length !== 1}
                                    onClick={handleEdit}>
                                    Editar        
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    disabled={selected.length !== 1}
                                    onClick={handleStock}>
                                    Insumos
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button     
                                    color="error"
                                    variant="contained"
                                    disabled={selected.length === 0}
                                    onClick={handleDelete}>
                                    Borrar
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
                    <Typography variant="h5" fontWeight={"bold"}>Aún no hay depósitos</Typography>
                    <Button 
                        sx={{mt: 2}}
                        variant="contained"
                        onClick={handleNew}>
                        Crear nuevo
                    </Button>
                </Box>
            }
        </MainView>
    );
};

export default View;