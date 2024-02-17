import { 
    Box,
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableRow,
    TableCell,
    Typography 
} from "@mui/material";
import moment from "moment";
import { componentsStyles } from "../../themes";
import { cropString } from "../../model/utils";

const ProductDetails = ({productData}) => (
    <TableContainer component={Paper} sx={{...componentsStyles.paper, mb:2}}>
        <Box sx={{pt:1, pl:1}}>
            <Typography sx={componentsStyles.title}>Producto</Typography>
        </Box>
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Nombre</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{productData.name}</TableCell>
                </TableRow>
                {productData.brand && 
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Marca/Fabricante</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{productData.brand || "-"}</TableCell>
                </TableRow>}
                <TableRow>
                    <TableCell sx={componentsStyles.headerCell}>Presentación</TableCell>
                    <TableCell sx={componentsStyles.tableCell}>{productData.pack_size} {productData.pack_unit}</TableCell>
                </TableRow>
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

export default ProductDetails;