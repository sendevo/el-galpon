import { Link } from "react-router-dom";
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
import { latLng2GoogleMap } from "../../model/utils";

const StoreDetails = ({storeData}) => (
    <TableContainer component={Paper} sx={componentsStyles.paper}>
        <Box sx={{pt:1, pl:1}}>
            <Typography sx={componentsStyles.title}>Depósito</Typography>
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

export default StoreDetails;