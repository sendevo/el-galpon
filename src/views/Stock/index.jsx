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
            <Typography sx={componentsStyles.title}>{storeData.name || "Depósito sin nombre"}</Typography>
        </Box>
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Nombre</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{storeData.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Ubicación</TableCell>
                    <TableCell sx={{...componentsStyles.tableCell}}>
                        <Link 
                            target="_blank"
                            rel="nooreferrer"
                            to={latLng2GoogleMap(storeData.lat, storeData.lng)}>
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

const EmptyListSection = ({message, icon}) => (
    <Box 
        sx={{
            height:"40vh",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
        <Box 
            display={"flex"} 
            flexDirection={"column"} 
            alignItems={"center"}
            sx={{mt: 2}}>
            <img src={icon} height="100px" alt="Sin datos" />
            <Typography variant="h5" fontWeight={"bold"}>{message}</Typography>
        </Box>
    </Box>
);

const ActionsBlock = ({onAdd, onMove, onRemove}) => (
    <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
        <Grid container sx={{mb:1}} direction={"column"}>
            <Typography sx={{fontWeight:"bold"}}>Acciones</Typography>
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
                    onClick={onAdd}>
                    Agregar
                </Button>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onMove}>
                    Mover
                </Button>
            </Grid>
            <Grid item>
                <Button     
                    color="red"
                    variant="contained"
                    onClick={onRemove}>
                    Usar
                </Button>
            </Grid>
        </Grid>
    </Paper>
)


const ItemList = ({itemsData}) => {
    const [selected, setSelected] = useState([]);

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
            {itemsData.length > 0 && 
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
                                    <TableCell sx={componentsStyles.headerCell}>Envases</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Vencimiento</TableCell>
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
                                        <TableCell sx={componentsStyles.tableCell}>{item.stock} {item.productData?.pack_size === 1 ? "" : `x ${item.productData?.pack_size}`} {item.productData?.pack_unit}</TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{item.packs ? item.packs : 0}</TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{item.expiration_date ? moment(item.expiration_date).format("DD/MM/YYYY") : "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            }
        </Box>
    );
};

const View = () => {
    const db = useDatabase();   

    const [searchParams] = useSearchParams();    

    const [title, setTitle] = useState("Insumos");
    const [emptyListMsg, setEmptyListMsg] = useState("Lista de insumos vacía");
    const [productData, setProductData] = useState();
    const [storeData, setStoreData] = useState();
    const [itemsData, setItemsData] = useState([]);
    
    useEffect(() => {
        const productId = parseInt(searchParams.get("productId"));
        if(Boolean(productId)){
            db.getItem(productId, 'products')
                .then(pData => {
                    setProductData(pData);
                    db.getStockOfProduct(productId)
                        .then(items => setItemsData(items.map(i => ({...i, productData:pData}))))
                        .catch(console.error);
                    })
                .catch(console.error);
            setTitle("Insumos de producto");
            setEmptyListMsg("No hay ítems de este producto");
        }
        const storeId = parseInt(searchParams.get("storeId"));
        if(Boolean(storeId)){
            db.getItem(storeId, 'stores')
                .then(sData => {
                    setStoreData(sData);
                    db.getStockInStore(storeId)
                        .then(items => setItemsData(items.map(i => ({...i, storeData:sData}))))
                        .catch(console.error);
                })
                .catch(console.error);
            
            setTitle("Insumos en depósito");
            setEmptyListMsg("El depósito está vacío");
        }
    }, []);

    return (
        <MainView title={title}>
            {productData && <ProductDetails productData={productData}/>}
            {storeData && <StoreDetails storeData={storeData}/>}
            {itemsData.length !== 0 ? 
                <ItemList itemsData={itemsData}/>
                :
                <EmptyListSection message={emptyListMsg} icon={iconEmpty} />
            }
            <ActionsBlock />
        </MainView>
    );
};


export default View;