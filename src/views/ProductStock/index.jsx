import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { debug, cropString } from "../../model/utils";
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


const GoodList = ({productData}) => {

    const db = useDatabase();   
    const [goodData, setGoodData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchParams] = useSearchParams();        

    useEffect(() => {
        const productId = parseInt(searchParams.get("id"));
        if(Boolean(productId))
            db.getStockOfProduct(productId)
                .then(setGoodData)
                .catch(console.error);
        else
            debug("Product not found.", "error");
    }, []);

    const handleSelect = goodId => {
        const selectedIndex = selected.indexOf(goodId);
        const newSelected = [...selected];
        if (selectedIndex === -1)
            newSelected.push(goodId);
        else
            newSelected.splice(selectedIndex, 1);
        setSelected(newSelected);
    };

    const handleSelectAll = selected => {
        if(selected)
            setSelected(goodData.map(d => d.id));
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
            {goodData.length > 0 ? 
                <Box sx={{mt:2}}>
                    <TableContainer component={Paper} sx={componentsStyles.paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={componentsStyles.headerCell}>
                                        <Checkbox 
                                            checked={selected.length === goodData.length} 
                                            onChange={e => handleSelectAll(e.target.checked)} />
                                    </TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Ubicación</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Stock</TableCell>
                                    {productData.returnable && <TableCell sx={componentsStyles.headerCell}>Envases</TableCell>}
                                    {productData.expirable && <TableCell sx={componentsStyles.headerCell}>Vencimiento</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {goodData.map(good => (
                                    <TableRow key={good.id}>
                                        <TableCell sx={componentsStyles.tableCell}>
                                            <Checkbox 
                                                checked={selected.indexOf(good.id) !== -1} 
                                                onChange={() => handleSelect(good.id)} />
                                        </TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{good.storeData?.name || "S/D"}</TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{good.stock} {productData.pack_size === 1 ? "" : `x ${productData.pack_size}`} {productData.pack_unit}</TableCell>
                                        {productData.returnable && <TableCell sx={componentsStyles.tableCell}>{good.packs}</TableCell>}
                                        {productData.expirable && <TableCell sx={componentsStyles.tableCell}>{moment(good.expiration_date).format("DD/MM/YYYY")}</TableCell>}
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
                    display={"flex"} 
                    flexDirection={"column"} 
                    alignItems={"center"}
                    sx={{mt: 2}}>
                    <img src={iconEmpty} height="100px" alt="Sin datos" />
                    <Typography variant="h5" fontWeight={"bold"}>No hay insumos de este producto</Typography>
                    <Button 
                        sx={{mt: 2}}
                        variant="contained"
                        onClick={handleAdd}>
                        Agregar insumos
                    </Button>
                </Box>
            }
        </Box>
    );
};

const View = () => {
    const db = useDatabase();   
    const [searchParams] = useSearchParams();        
    const [productData, setProductData] = useState({});
    
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
        <MainView title={"Insumos por producto"}>
            <ProductDetails productData={productData}/>
            <GoodList productData={productData}/>
        </MainView>
    );
};


export default View;