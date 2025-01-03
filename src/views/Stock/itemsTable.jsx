import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { 
    Box, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead,
    Checkbox,
    TableContainer,  
    TableRow
} from "@mui/material";
import moment from "moment";
import HeaderCell from "../../components/HeaderCell";
import { isValidRowData } from "../../model/DB";
import { componentsStyles } from "../../themes";


const ItemsTable = ({items, setItems, columns}) => {

    // Sorting columns, key and direction
    const [sortConfig, setSortConfig] = useState({ key: "product_id", direction: "asc" });
    const { t } = useTranslation('itemList');

    const selected = items.filter(it => it.selected);

    const toggleSelect = item => {
        setItems(prevItems => {
            const index = prevItems.findIndex(it => it.id === item.id);
            prevItems[index].selected = !prevItems[index].selected;
            const newItems = [...prevItems];
            return newItems;
        });
    };

    const setAllSelected = select => setItems(prevItems => prevItems.map(it => ({...it, selected: select})));

    const getStock = item => {
        const pIndex = item.presentation_index;
        const presentation = item.productData.presentations[pIndex];
        const stockText = `${item.stock} ${t(presentation.unit)}`;
        return stockText;
    };

    const requestSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const sortingFunction = (a, b) => {
        switch(sortConfig.key){
            case "product_id":
                return a.productData.name.localeCompare(b.productData.name);
            case "store_id":
                return a.storeData.name.localeCompare(b.storeData.name);
            case "stock":
                return a.stock - b.stock;
            case "empty_packs":
                return a.empty_packs - b.empty_packs;
            case "expiration_date":
                return a.expiration_date - b.expiration_date;
            default:
                return 0;
        }
    }

    // stock and empty_packs columns are not shown simultaneously, so filter null data
    // For the case of empty_packs, it is not necessary because its done in the DB query
    const filteredItems = items.filter(it => {
        if(columns.includes("stock")) return it.stock > 0;
        //if(columns.includes("empty_packs")) return it.empty_packs > 0;
        return true;
    });

    const sortedItems = [...filteredItems].sort((a, b) => 
        sortConfig.direction === "asc" ? 
            sortingFunction(a, b) : sortingFunction(b, a));

    return (
        <Box>
            <TableContainer component={Paper} sx={componentsStyles.paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={componentsStyles.headerCell}>
                                <Checkbox 
                                    checked={selected.length === items.length} 
                                    onChange={e => setAllSelected(e.target.checked)} />
                            </TableCell>
                            {columns.map((attr, index) => (
                                <HeaderCell 
                                    sortedDirection={sortConfig.key === attr ? sortConfig.direction : ""}
                                    onClick={() => requestSort(attr)}
                                    key={index} 
                                    attribute={t(attr)}/>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedItems.map(item => (
                            isValidRowData(item, "items") && // This is a DB related fn that uses schema
                                <TableRow key={item.id}>
                                    <TableCell sx={componentsStyles.tableCell}>
                                        <Checkbox 
                                            checked={item.selected} 
                                            onChange={() => toggleSelect(item)} />
                                    </TableCell>
                                    {columns.includes("product_id") && <TableCell sx={componentsStyles.tableCell}>{item.productData.name || "S/D"}</TableCell>}
                                    {columns.includes("stock") && <TableCell sx={componentsStyles.tableCell}>{item.stock ? getStock(item) : ""}</TableCell>}
                                    {columns.includes("store_id") && <TableCell sx={componentsStyles.tableCell}>{item.storeData.name || "S/D"}</TableCell>}
                                    {columns.includes("empty_packs") && <TableCell sx={componentsStyles.tableCell}>{item.empty_packs ? item.empty_packs : "0"}</TableCell>}
                                    {columns.includes("expiration_date") && <TableCell sx={componentsStyles.tableCell}>{item.productData?.expirable ? moment(item.expiration_date).format("DD/MM/YYYY") : "-"}</TableCell>}
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ItemsTable;