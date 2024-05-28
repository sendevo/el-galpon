import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import useConfirm from "../../hooks/useConfirm";
import MainView from "../../components/MainView";
import SearchForm from "../../components/SearchForm";
import { componentsStyles } from "../../themes";
import { debug, cropString } from "../../model/utils";
import { FaCheck, FaTimes } from "react-icons/fa";
import iconEmpty from "../../assets/icons/empty_folder.png";


const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const db = useDatabase();   
    
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);

    const opType = searchParams.get("op-type");
    
    const toast = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        db.query("products")
            .then(setData)
            .catch(console.error);
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
            "Confirmar operación",
            "¿Desea eliminar los ítems seleccionados?",
            () => { // On success
                const job = selected.map(productId => db.removeRow(productId, "products"));
                const len = selected.length;
                Promise.all(job)
                    .then(() => {
                        db.query("products",[])
                            .then(updatedData => {
                                setData(updatedData);
                                setSelected([]);
                                toast(`Se ${len > 1 ? "eliminaron":"eliminó"} ${len} producto${len>1 ? "s":""}`, "success");
                            });
                    })
                    .catch(console.error);
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
            <SearchForm 
                fields={["categories", "expirable", "returnable", "dateFrom", "dateTo", "brand"]} 
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
                                    <TableCell sx={componentsStyles.headerCell}>Capacidad</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Unidad</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Expirable</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Retornable</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Marca/Fabricante</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>SKU</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Comentarios</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Categorías</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Creado</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Modificado</TableCell>
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
                                    <TableCell sx={componentsStyles.tableCell}>{product.pack_size}</TableCell>
                                    <TableCell sx={componentsStyles.tableCell}>{product.pack_unit}</TableCell>
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
                                    disabled={selected.length === 0}
                                    variant="contained"
                                    onClick={handleBuy}>
                                    Comprar
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
                    <Typography variant="h5" fontWeight={"bold"}>Aún no hay productos</Typography>
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