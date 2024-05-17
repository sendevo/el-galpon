import { useState } from "react";
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
import { componentsStyles } from "../../themes";
import EmptyListSection from "./emptyListSection";
import iconEmpty from "../../assets/icons/empty_folder.png";

const ItemList = ({items, ignoredCols, selected, setSelected}) => {

    const handleSelect = itemId => {
        const selectedIndex = selected.indexOf(itemId);
        const newSelected = [...selected];
        if (selectedIndex === -1)
            newSelected.push(itemId);
        else
            newSelected.splice(selectedIndex, 1);
        setSelected(newSelected);
    };

    const handleSelectAll = selected => {
        if(selected)
            setSelected(items.map(d => d.id));
        else 
            setSelected([]);
    };

    return (
        <Box>
            {items.length > 0 ? 
                <Box>
                    <TableContainer component={Paper} sx={componentsStyles.paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={componentsStyles.headerCell}>
                                        <Checkbox 
                                            checked={selected.length === items.length} 
                                            onChange={e => handleSelectAll(e.target.checked)} />
                                    </TableCell>
                                    {!ignoredCols.includes("store_id") && <TableCell sx={componentsStyles.headerCell}>Ubicación</TableCell>}
                                    {!ignoredCols.includes("product_id") && <TableCell sx={componentsStyles.headerCell}>Producto</TableCell>}
                                    <TableCell sx={componentsStyles.headerCell}>Stock</TableCell>
                                    {!ignoredCols.includes("stock") && <TableCell sx={componentsStyles.headerCell}>Total</TableCell>}
                                    {!ignoredCols.includes("packs") && <TableCell sx={componentsStyles.headerCell}>Envases</TableCell>}
                                    {!ignoredCols.includes("expiration_date") && <TableCell sx={componentsStyles.headerCell}>Vencimiento</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map(item => (
                                    item && <TableRow key={item.id}>
                                        <TableCell sx={componentsStyles.tableCell}>
                                            <Checkbox 
                                                checked={selected.indexOf(item.id) !== -1} 
                                                onChange={() => handleSelect(item.id)} />
                                        </TableCell>
                                        {!ignoredCols.includes("store_id") && <TableCell sx={componentsStyles.tableCell}>{item.storeData?.name || "S/D"}</TableCell>}
                                        {!ignoredCols.includes("product_id") && <TableCell sx={componentsStyles.tableCell}>{item.productData?.name || "S/D"}</TableCell>}
                                        <TableCell sx={componentsStyles.tableCell}>{item.stock} unidades</TableCell>
                                        {!ignoredCols.includes("stock") && <TableCell sx={componentsStyles.tableCell}>{item.productData ? item.stock * item?.productData?.pack_size : item.stock} {item.productData?.pack_unit}</TableCell>}
                                        {!ignoredCols.includes("packs") && <TableCell sx={componentsStyles.tableCell}>{item.packs ? item.packs : 0}</TableCell>}
                                        {!ignoredCols.includes("expiration_date") && <TableCell sx={componentsStyles.tableCell}>{item.expiration_date ? moment(item.expiration_date).format("DD/MM/YYYY") : "-"}</TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                :
                <EmptyListSection message={"La lista de insumos está vacía"} icon={iconEmpty} />
            }
        </Box>
    );
};

export default ItemList;