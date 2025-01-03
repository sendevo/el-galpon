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
import { OPERATION_TYPES_NAMES } from '../../model/constants';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';


const collapseTableHeaderStyle = {
    fontSize:"12px", 
    fontWeight:"bold",
    textAlign: "left"
};

const CollapsibleRow = props => {

    const { operation, products, storesNames } = props;

    const [open, setOpen] = useState(false);
    const { t } = useTranslation('operations');

    const getStock = item => { // Duplicate from src/views/Stock/itemsTable.jsx
        const pIndex = item.presentation_index;
        const product = products[item.product_id];
        const presentation = product.presentations[pIndex];
        const amountText =  `${item.amount} ${operation.type === "RETURN_PACKS" ? t("packs") : t(presentation.unit)}`;
        return amountText;
    };

    const getPresentation = item => {
        const pIndex = item.presentation_index;
        const product = products[item.product_id];
        const presentation = product.presentations[pIndex];
        return presentation.bulk ? t("bulk") : `${presentation.pack_size} ${t(presentation.unit)}`;
    }

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
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography sx={collapseTableHeaderStyle}>
                                                {t("product")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography sx={collapseTableHeaderStyle}>
                                                {t("stock")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography sx={collapseTableHeaderStyle}>
                                                {t("presentation")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography sx={collapseTableHeaderStyle}>
                                                {t("store_from")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography sx={collapseTableHeaderStyle}>
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
                                            <TableCell sx={{textAlign:"left", minWidth:"150px"}}>{getStock(item)}</TableCell>
                                            <TableCell sx={{textAlign:"left"}}>{getPresentation(item)}</TableCell>
                                            <TableCell sx={{textAlign:"left"}}>{storesNames[item.store_from_id] || "-"}</TableCell>
                                            <TableCell sx={{textAlign:"left"}}>{storesNames[item.store_to_id] || "-"}</TableCell>
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