import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
    Box, 
    Paper, 
    Typography,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer,  
    TableRow  
} from "@mui/material";
import moment from "moment";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import { componentsStyles } from "../../themes";
import background from "../../assets/backgrounds/background1.jpg";
import { debug, cropString } from "../../model/utils";

const ProductData = () => {
    
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
        <TableContainer component={Paper} sx={componentsStyles.paper}>
            <Box sx={{p:1}}>
                <Typography sx={componentsStyles.title}>{productData.name || "Producto sin nombre"}</Typography>
            </Box>
            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>Capacidad</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{productData.pack_size} {productData.pack_unit}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>Marca/Fabricante</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{productData.brand || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>Comentarios</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{cropString(productData.comments || "-", 10)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>Categorías</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{productData.categories?.join(', ') || "-"}</TableCell>
                    </TableRow>
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
};


const GoodData = () => {

    const db = useDatabase();   
    const [goodData, setGoodData] = useState([]);
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

    return (
        <Paper sx={{...componentsStyles.paper, mt:1}}>
            <Box sx={{p:1}}>
                <Typography>Cantidad de items: {goodData.length}</Typography>
            </Box>
        </Paper>
    );
};

const View = () => (
    <MainView title={"Registro de movimiento"} background={background}>
        <ProductData />
        <GoodData />
    </MainView>
);


export default View;