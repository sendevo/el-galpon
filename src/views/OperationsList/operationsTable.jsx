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
    TableRow,
    Typography,
} from "@mui/material";
import CollapsibleRow from './collapsibleRow';
import useToast from '../../hooks/useToast';
import { isValidRowData } from "../../model/DB";
import { OPERATION_TYPES_NAMES } from '../../model/constants';
import { componentsStyles } from "../../themes";


const HeaderCell = ({ onClick, attribute, sortedDirection }) => {
    const sortedArrow = sortedDirection ? (sortedDirection === "asc" ? "▲" : "▼") : "";
    return (
        <TableCell sx={componentsStyles.headerCell} onClick={onClick}>
            {attribute + sortedArrow}
        </TableCell>
    );
};

const OperationsTable = ({ operations }) => {

    const db = useDatabase();
    const toast = useToast();
    const { t } = useTranslation('operations');

    // Data from database
    const [products, setProducts] = useState({});
    const [storesNames, setStoresNames] = useState({});
    
    // Sorting columns, key and direction
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

    // The following keys must match the keys defined in the translations file. This is to sepparate data attributes from it converstions,
    // for example: date (unix) -> date (formatted) or product (ID) -> product (name).
    const mainFields = ["date", "type", "observations"];    
    const mainSortableFields = ["date", "type"];

    useEffect(() => { // Fetch products and stores names
        const itemsData = operations.map(op => op.items_data);
        const productsIds = itemsData.flat().map(item => item.product_id);
        const storesFromIds = itemsData.flat().map(item => item.store_from_id);
        const storesToIds = itemsData.flat().map(item => item.store_to_id);
        
        db.query("products", productsIds)
            .then(result => {
                // Array to object
                const prods = result.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, {});
                setProducts(prods);
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                debug(error, "error");
            });
    
        const storesIds = [...new Set([...storesFromIds, ...storesToIds])];
        db.query("stores", storesIds)
            .then(result => {
                const storesNames = result.reduce((acc, store) => {
                    acc[store.id] = store.name;
                    return acc;
                }, {});
                setStoresNames(storesNames);
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                debug(error, "error");
            });
    }, []);

    const requestSort = (key) => {
        if(!mainSortableFields.includes(key)) return;
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
            default:
                return 0;
        };
        return cond ? 1 : -1;
    };

    const sortedData = [...operations].sort((a, b) => 
            sortConfig.direction === "asc" ? 
                sortingFunction(a, b) : sortingFunction(b, a));

    return (
        <Box>
            {Object.keys(products).length > 0 && Object.keys(storesNames).length > 0 &&
                <TableContainer component={Paper} sx={componentsStyles.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography fontWeight={"bold"} fontSize={"14px"}>
                                        {t("expand_details")}
                                    </Typography>
                                </TableCell>
                                {mainFields.map((attr, index) => (
                                    <HeaderCell 
                                        sortedDirection={sortConfig.key === attr ? sortConfig.direction : ""}
                                        onClick={() => requestSort(attr)}
                                        key={index} 
                                        attribute={t(attr)}/>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.map((operation, index) => (
                                isValidRowData(operation, "operations") && 
                                    <CollapsibleRow 
                                        key={index} 
                                        operation={operation}
                                        products={products}
                                        storesNames={storesNames}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </Box>
    );
};

export default OperationsTable;