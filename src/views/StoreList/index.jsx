import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    Box, 
    Link
} from '@mui/material';
import moment from "moment";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import SearchForm from "../../components/SearchForm";
import { componentsStyles } from "../../themes";
import { debug, latLng2GoogleMap, cropString } from "../../model/utils";
import background from "../../assets/backgrounds/background1.jpg";
import iconEmpty from "../../assets/icons/empty_folder.png";
import { FaExternalLinkAlt } from "react-icons/fa";


const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    
    useEffect(() => {
        db.getAllItems("stores")
            .then(setData)
            .catch(console.error);
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

    const handleDelete = () => {
        // TODO: confirm modal && feedback
        const job = selected.map(storeId => db.removeItem(storeId, "stores"));
        Promise.all(job)
            .then(() => {
                db.getAllItems("stores")
                    .then(updatedData => {
                        setData(updatedData);
                        setSelected([]);
                    });
            })
            .catch(console.error);
    };

    const handleSearch = query => {
        console.log(query);
    };

    const handleFilter = filters => {
        console.log(filters);
    };

    return(
        <MainView title={"Depósitos"} background={background}>
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
                                            href={latLng2GoogleMap(store.lat, store.lng)}>
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
                            {selected.length===0 && <Typography sx={componentsStyles.hintText}>Seleccione uno o más ítems</Typography>}
                        </Grid>
                        <Grid 
                            container 
                            direction="row"
                            spacing={2} 
                            justifyContent="space-around">
                            <Grid item>
                                <Button 
                                    color="green"
                                    variant="contained"
                                    onClick={handleNew}>
                                    Nuevo
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
                                    color="red"
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