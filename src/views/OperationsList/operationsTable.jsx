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


const HeaderCell = ({ onClick, attribute, sortedDirection }) => {
    const sorted = sortedDirection ? (sortedDirection === "asc" ? "▲" : "▼") : "";
    return (
        <TableCell sx={componentsStyles.headerCell} onClick={onClick}>
            {attribute + sorted}
        </TableCell>
    );
};

const OperationsTable = ({ operations }) => {

    const db = useDatabase();
    const { t } = useTranslation('operations');

    const [names, setNames] = useState({
        productsNames: {},
        storesNames: {}
    });

    // Combine stock_amount and pack_amount into amount
    operations = operations.map(op => {
        op.amount = op.stock_amount || op.pack_amount;
        return op;
    });

    // The following keys must match the keys defined in the translations file. This is to sepparate data attributes from it converstions,
    // for example: date (unix) -> date (formatted) or product (ID) -> product (name).
    const fields = ["date", "type", "product", "presentation", "amount", "store_from", "store_to", "observations"];    
    const sortableFields = ["date", "type", "product", "amount", "store_from", "store_to"];
    
    // Sorting columns, key and direction
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });


    useEffect(() => { // Fetch products and stores names
        const productsIds = operations.map(op => op.product_id);
        db.query("products", productsIds)
            .then(result => {
                const productsNames = result.reduce((acc, item) => {
                    acc[item.id] = item.name;
                    return acc;
                }, {});
                setNames(names => ({ ...names, productsNames }));
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                debug(error, "error");
            });
        
        const storesFromIds = operations.map(op => op.store_from_id);
        const storesToIds = operations.map(op => op.store_to_id);
        const storesIds = [...new Set([...storesFromIds, ...storesToIds])];
        db.query("stores", storesIds)
            .then(result => {
                const storesNames = result.reduce((acc, item) => {
                    acc[item.id] = item.name;
                    return acc;
                }, {});
                setNames(names => ({...names, storesNames}));
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                debug(error, "error");
            });
    }, []);


    const requestSort = (key) => {
        if(!sortableFields.includes(key)) return;
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortingFunction = (op1, op2) => {
        let cond = false;
        switch(sortConfig.key) {
            case "date":
                cond = op1.timestamp > op2.timestamp;
                break;
            case "type":
                cond = t(OPERATION_TYPES_NAMES[op1.type]) > t(OPERATION_TYPES_NAMES[op2.type]);
                break;
            case "product":
                cond = names.productsNames[op1.product_id] > names.productsNames[op2.product_id];
                break;
            case "amount":
                cond = op1.amount > op2.amount;
                break;
            case "store_from":
                if(!op1.store_from_id) return 1;
                cond = names.storesNames[op1.store_from_id] > names.storesNames[op2.store_from_id];
                break;
            case "store_to":
                if(!op1.store_to_id) return 1;
                cond = names.storesNames[op1.store_to_id] > names.storesNames[op2.store_to_id];
                break;
            default:
                return 0;
        };
        return cond ? 1 : -1;
    };

    const sortedData = [...operations].sort((a, b) => sortConfig.direction === "asc" ? sortingFunction(a, b) : sortingFunction(b, a));


    return (
        <Box>
            <TableContainer component={Paper} sx={componentsStyles.paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {fields.map((attr, index) => (
                                <HeaderCell 
                                    sortedDirection={sortConfig.key === attr ? sortConfig.direction : ""}
                                    onClick={() => requestSort(attr)}
                                    key={index} 
                                    attribute={t(attr)}/>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((item, index) => (
                            isValidRowData(item, "operations") && <TableRow key={item.id}>
                                <TableCell sx={componentsStyles.tableCell}>{moment(item.timestamp).format("DD/MM/YYYY")}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{t(OPERATION_TYPES_NAMES[item.type])}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{names.productsNames[item.product_id] || "S/D"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{item.presentation_id}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{item.amount}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{names.storesNames[item.store_from_id] || "-"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{names.storesNames[item.store_to_id] || "-"}</TableCell>
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