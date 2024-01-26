import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
    Box, 
    Paper, 
    Button,
    Typography,
    Table, 
    TableBody, 
    TableCell, 
    TableHead,
    Checkbox,
    TableContainer,  
    TableRow,  
    Grid
} from "@mui/material";
import moment from "moment";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import { componentsStyles } from "../../themes";
import { debug, cropString, latLng2GoogleMap } from "../../model/utils";
import { isValidQuery } from "../../model/DB";
import iconEmpty from "../../assets/icons/empty_folder.png";


const ProductDetails = ({productData}) => (
    <TableContainer component={Paper} sx={componentsStyles.paper}>
        <Box sx={{p:1}}>
            <Typography sx={componentsStyles.title}>{productData.name || "Producto sin nombre"}</Typography>
        </Box>
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Presentación</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{productData.pack_size} {productData.pack_unit}</TableCell>
                </TableRow>
                {productData.brand && 
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Marca/Fabricante</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{productData.brand || "-"}</TableCell>
                </TableRow>}
                {productData.comments && 
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Comentarios</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{cropString(productData.comments || "-", 10)}</TableCell>
                </TableRow>}
                {productData.categories && 
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Categorías</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{productData.categories?.join(', ') || "-"}</TableCell>
                </TableRow>}
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Creado</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{moment(productData.created).format("DD/MM/YYYY HH:mm")}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Modificado</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{moment(productData.modified).format("DD/MM/YYYY HH:mm")}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);

const StoreDetails = ({storeData}) => (
    <TableContainer component={Paper} sx={componentsStyles.paper}>
        <Box sx={{p:1}}>
            <Typography sx={componentsStyles.title}>{productData.name || "Depósito sin nombre"}</Typography>
        </Box>
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Nombre</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{storeData.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Ubicación</TableCell>
                    <TableCell sx={{...componentsStyles.tableCell, textAlign:"center"}}>
                        <Link 
                            target="_blank"
                            rel="nooreferrer"
                            href={latLng2GoogleMap(storeData.lat, storeData.lng)}>
                                Ver en Google Maps 
                        </Link>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Creado</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{moment(storeData.created).format("DD/MM/YYYY HH:mm")}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Modificado</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{moment(storeData.modified).format("DD/MM/YYYY HH:mm")}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);


const ItemList = ({queryName, queryArguments}) => {

    const db = useDatabase();   
    const [itemsData, setitemsData] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {        
        if(isValidQuery(queryName))
            db[queryName](...queryArguments)
                .then(setitemsData)
                .catch(console.error);
        else
            debug("Query did not return any items.", "error");
    }, []);

    const handleSelect = itemId => {
        const selectedIndex = selected.indexOf(itemId);
        const newSelected = [...selected];
        if (selectedIndex === -1)
            newSelected.push(itemId);
        else
            newSelected.splice(selectedIndex, 1);
        setSelected(newSelected);
    };

    const handleSelectAll = selected => {
        if(selected)
            setSelected(itemsData.map(d => d.id));
        else 
            setSelected([]);
    };

    const handleAdd = () => {

    };

    const handleMove = () => {

    };

    const handleRemove = () => {

    };

    return (
        <Box>
            {itemsData.length > 0 ? 
                <Box sx={{mt:2}}>
                    <TableContainer component={Paper} sx={componentsStyles.paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={componentsStyles.headerCell}>
                                        <Checkbox 
                                            checked={selected.length === itemsData.length} 
                                            onChange={e => handleSelectAll(e.target.checked)} />
                                    </TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Ubicación</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Stock</TableCell>
                                    {productData.returnable && <TableCell sx={componentsStyles.headerCell}>Envases</TableCell>}
                                    {productData.expirable && <TableCell sx={componentsStyles.headerCell}>Vencimiento</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemsData.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell sx={componentsStyles.tableCell}>
                                            <Checkbox 
                                                checked={selected.indexOf(item.id) !== -1} 
                                                onChange={() => handleSelect(item.id)} />
                                        </TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{item.storeData?.name || "S/D"}</TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{item.stock} {productData.pack_size === 1 ? "" : `x ${productData.pack_size}`} {productData.pack_unit}</TableCell>
                                        {productData.returnable && <TableCell sx={componentsStyles.tableCell}>{item.packs}</TableCell>}
                                        {productData.expirable && <TableCell sx={componentsStyles.tableCell}>{moment(item.expiration_date).format("DD/MM/YYYY")}</TableCell>}
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
                            spacing={1}
                            justifyContent="space-around">
                            <Grid item>
                                <Button 
                                    color="green"
                                    variant="contained"
                                    onClick={handleAdd}>
                                    Agregar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    disabled={selected.length !== 1}
                                    onClick={handleMove}>
                                    Mover
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button     
                                    color="red"
                                    variant="contained"
                                    disabled={selected.length === 0}
                                    onClick={handleRemove}>
                                    Quitar
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                :
                <Box 
                    height="70vh"
                    display="flex"
                    justifyContent="center"
                    alignItems="center">
                    <Box 
                        display={"flex"} 
                        flexDirection={"column"} 
                        alignItems={"center"}
                        sx={{mt: 2}}>
                        <img src={iconEmpty} height="100px" alt="Sin datos" />
                        <Typography variant="h5" fontWeight={"bold"}>Aún no hay insumos</Typography>
                        <Button 
                            sx={{mt: 2}}
                            variant="contained"
                            component={Link}
                            to="/products">
                            Agregar ítems de producto
                        </Button>
                    </Box>
                </Box>
            }
        </Box>
    );
};

const View = () => {
    const db = useDatabase();   
    const [searchParams] = useSearchParams();        
    const [productData, setProductData] = useState();
    
    useEffect(() => {
        const productId = parseInt(searchParams.get("id"));
        if(Boolean(productId)){
            db.getItem(productId, 'products')
                .then(setProductData)
                .catch(console.error);
        }else
            debug("Product not found.", "error");
    }, []);

    return (
        <MainView title={"Insumos"}>
            {productData && <ProductDetails productData={productData}/>}
            <ItemList queryName={""} queryArguments={[]}/>
        </MainView>
    );
};


export default View;