import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDatabase } from '../../context/Database';
import { 
    Box, 
    Paper,
    Table, 
    TableBody, 
    TableCell, 
    TableHead,
    TableContainer,  
    TableRow
} from "@mui/material";
import moment from "moment";
import { isValidRowData } from "../../model/DB";
import { OPERATION_TYPES_NAMES } from '../../model/constants';
import { componentsStyles } from "../../themes";

const attributes = ["type", "product", "presentation", "stock_amount", "pack_amount", "store_from", "store_to", "date", "observations"];
const HeaderCell = ({ attribute }) => {
    return (
        <TableCell sx={componentsStyles.headerCell}>
            {attribute}
        </TableCell>
    );
};

const OperationsTable = ({ operations }) => {

    const db = useDatabase();
    const { t } = useTranslation('operations');

    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const productsIds = operations.map(op => op.product_id);
        db.query("products", productsIds)
            .then(data => {
                const names = data.reduce((acc, item) => {
                    acc[item.id] = item.name;
                    return acc;
                }, {});
                setProducts(names);
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                debug(error, "error");
            });
        const storesIds = operations.map(op => op.store_from_id).concat(operations.map(op => op.store_to_id));
        db.query("stores", storesIds)
            .then(data => {
                const names = data.reduce((acc, item) => {
                    acc[item.id] = item.name;
                    return acc;
                }, {});
                setStores(names);
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                debug(error, "error");
            });
    }, [operations]);


    return (
        <Box>
            <TableContainer component={Paper} sx={componentsStyles.paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {attributes.map((attr, index) => (
                                <HeaderCell key={index} attribute={t(attr)} />
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {operations.map((item, index) => (
                            isValidRowData(item, "operations") && <TableRow key={item.id}>
                                <TableCell sx={componentsStyles.tableCell}>{OPERATION_TYPES_NAMES[item.type]}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{products[item.product_id] || "S/D"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{item.presentation_id}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{item.stock_amount}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{item.pack_amount}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{stores[item.store_from_id] || "-"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{stores[item.store_to_id] || "-"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{moment(item.timestamp).format("DD/MM/YYYY")}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{item.observations}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OperationsTable;