import { useState } from "react";
import { 
    Box, 
    TableCell, 
    IconButton,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Collapse,
    Typography,
} from "@mui/material";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import { OPERATION_TYPES_NAMES, OPERATION_TYPES } from '../../model/constants';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';


const CollapsibleRow = props => {

    const { operation, products, storesNames } = props;

    const [open, setOpen] = useState(false);
    const { t } = useTranslation('operations');

    const getStock = (item, operationType) => { // Duplicate from src/views/Stock/itemsTable.jsx
        const pIndex = item.presentation_index;
        const product = products[item.product_id];
        const presentation = product.presentations[pIndex];
        const packOperation = (operationType === OPERATION_TYPES.RETURN_PACKS || OPERATION_TYPES.MOVE_PACKS);
        const amount = packOperation ? item.pack_amount : item.stock_amount;
        const suffix = packOperation ? ` × ${presentation.pack_size} ${t(presentation.unit)}` : t(presentation.unit);
        const amountText = `${amount} ${suffix}`;
        return amountText;
    };

    return (
        <>
            <TableRow sx={{backgroundColor: open ? "#CCC" : ""}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}>
                        {open ? <FaChevronUp /> : <FaChevronDown />}
                    </IconButton>
                </TableCell>
                <TableCell align="right">{moment(operation.timestamp).format("DD/MM/YYYY")}</TableCell>
                <TableCell align="right">{t(OPERATION_TYPES_NAMES[operation.type])}</TableCell>
                <TableCell align="right">{operation.observations}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: open ? "#DDD" : ""}} colSpan={4}>
                    <Collapse in={open} timeout={"auto"} unmountOnExit>
                        <Box sx={{m:1}}>
                            <Typography fontSize={"15px"} fontWeight={"bold"}>
                                {t("details")}
                            </Typography>
                            <Table size="small" fontSize="11px">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography fontSize={"12px"} fontWeight={"bold"}>
                                                {t("product")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontSize={"12px"} fontWeight={"bold"}>
                                                {t("stock")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontSize={"12px"} fontWeight={"bold"}>
                                                {t("store_from")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontSize={"12px"} fontWeight={"bold"}>
                                                {t("store_to")}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {operation.items_data.map((item, i) => (
                                        products && storesNames && 
                                        <TableRow key={i}>
                                            <TableCell>{products[item.product_id]?.name}</TableCell>
                                            <TableCell>{getStock(item, operation.type)}</TableCell>
                                            <TableCell>{storesNames[item.store_from_id]}</TableCell>
                                            <TableCell>{storesNames[item.store_to_id]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default CollapsibleRow;