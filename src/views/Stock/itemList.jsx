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

const ItemList = ({itemsData, productData, storeData}) => {
    const [selected, setSelected] = useState([]);

    console.table(itemsData);
    console.log(productData);
    console.log(storeData);

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
            setSelected(itemsData.map(d => d.id));
        else 
            setSelected([]);
    };

    const handleAdd = () => {

    };

    const handleMove = () => {

    };

    const handleRemove = () => {

    };

    return (
        <Box>
            {itemsData.length > 0 && 
                <Box sx={{mt:2}}>
                    <TableContainer component={Paper} sx={componentsStyles.paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={componentsStyles.headerCell}>
                                        <Checkbox 
                                            checked={selected.length === itemsData.length} 
                                            onChange={e => handleSelectAll(e.target.checked)} />
                                    </TableCell>
                                    {!storeData && <TableCell sx={componentsStyles.headerCell}>Ubicación</TableCell>}
                                    {!productData && <TableCell sx={componentsStyles.headerCell}>Producto</TableCell>}
                                    <TableCell sx={componentsStyles.headerCell}>Stock</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Envases</TableCell>
                                    <TableCell sx={componentsStyles.headerCell}>Vencimiento</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemsData.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell sx={componentsStyles.tableCell}>
                                            <Checkbox 
                                                checked={selected.indexOf(item.id) !== -1} 
                                                onChange={() => handleSelect(item.id)} />
                                        </TableCell>
                                        {!storeData && <TableCell sx={componentsStyles.tableCell}>{item.storeData?.name || "S/D"}</TableCell>}
                                        {!productData && <TableCell sx={componentsStyles.tableCell}>{item.productData?.name || "S/D"}</TableCell>}
                                        <TableCell sx={componentsStyles.tableCell}>{item.productData ? item.stock * item.productData.pack_size : item.stock}</TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{item.packs ? item.packs : 0}</TableCell>
                                        <TableCell sx={componentsStyles.tableCell}>{item.expiration_date ? moment(item.expiration_date).format("DD/MM/YYYY") : "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            }
        </Box>
    );
};

export default ItemList;