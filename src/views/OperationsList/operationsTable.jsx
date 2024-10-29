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
import useToast from '../../hooks/useToast';
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
    const toast = useToast();
    const { t } = useTranslation('operations');

    const [ready, setReady] = useState(false);
    const [products, setProducts] = useState({});
    const [storesNames, setStoresNames] = useState({});


    // The following keys must match the keys defined in the translations file. This is to sepparate data attributes from it converstions,
    // for example: date (unix) -> date (formatted) or product (ID) -> product (name).
    const fields = ["date", "type", "product", "stock", "store_from", "store_to", "observations"];    
    const sortableFields = ["date", "type", "product", "stock", "store_from", "store_to"];
    
    // Sorting columns, key and direction
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });


    useEffect(() => { // Fetch products and stores names
        const productsIds = operations.map(op => op.product_id);
        db.query("products", productsIds)
            .then(result => {
                // Array to object
                const prods = result.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, {});
                setReady(true);
                setProducts(prods);
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
                setStoresNames(storesNames);
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                debug(error, "error");
            });
    }, []);

    // Get item stock
    const getStock = item => {
        let presentation = "";
        const product = products[item.product_id];
        const pIndex = item.presentation_index;
        const amount = item.stock_amount || item.pack_amount;
        if(product?.pack_sizes[pIndex] === -1){
            presentation = `${amount} ${t(product.pack_units[pIndex])}`;
        }else{
            presentation = `${amount} x ${product.pack_sizes[pIndex]} ${t(product.pack_units[pIndex])}`;
        }
        return presentation;
    };

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
                cond = products[op1.product_id].name > products[op2.product_id].name;
                break;
            case "stock":
                const amount1 = op1.stock_amount || op1.pack_amount;
                const amount2 = op2.stock_amount || op2.pack_amount;
                cond = amount1 > amount2;
                break;
            case "store_from":
                if(!op1.store_from_id) return 1;
                cond = storesNames[op1.store_from_id] > storesNames[op2.store_from_id];
                break;
            case "store_to":
                if(!op1.store_to_id) return 1;
                cond = storesNames[op1.store_to_id] > storesNames[op2.store_to_id];
                break;
            default:
                return 0;
        };
        return cond ? 1 : -1;
    };

    const sortedData = [...operations].sort((a, b) => sortConfig.direction === "asc" ? sortingFunction(a, b) : sortingFunction(b, a));


    return (
        <Box>
            {ready && <TableContainer component={Paper} sx={componentsStyles.paper}>
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
                                <TableCell sx={componentsStyles.tableCell}>{products[item.product_id].name || "S/D"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{getStock(item)}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{storesNames[item.store_from_id] || "-"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{storesNames[item.store_to_id] || "-"}</TableCell>
                                <TableCell sx={componentsStyles.tableCell}>{item.observations}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </Box>
    );
};

export default OperationsTable;