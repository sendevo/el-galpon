import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
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

const StoreDetails = ({storeData}) => {
    const { t } = useTranslation('itemList');

    return(
        <TableContainer component={Paper} sx={{...componentsStyles.paper, mb:2}}>
            <Box sx={{pt:1, pl:1}}>
                <Typography sx={componentsStyles.title}>{t("store")}</Typography>
            </Box>
            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>{t("name")}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{storeData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>{t('location')}</TableCell>            
                            <TableCell sx={{...componentsStyles.tableCell}}>
                            {(storeData.lat && storeData.lng) ?
                                <Link 
                                    target="_blank"
                                    rel="nooreferrer"
                                    to={latLng2GoogleMap(storeData.lat, storeData.lng)}>
                                        {t('viewMap')}
                                </Link>
                                :
                                t("notAvailableLocation")
                            }
                            </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>{t("created")}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{moment(storeData.created).format("DD/MM/YYYY HH:mm")}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>{t("modified")}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{moment(storeData.modified).format("DD/MM/YYYY HH:mm")}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StoreDetails;