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
import { isValidRowData } from "../../model/DB";
import { componentsStyles } from "../../themes";

const ItemList = ({items, setItems, ignoredCols}) => {

    const selected = items.filter(it => it.selected);
    const { t } = useTranslation('itemList');

    const toggleSelect = index => {
        setItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index].selected = !newItems[index].selected;
            return newItems;
        });
    };

    const setAllSelected = select => setItems(prevItems => prevItems.map(it => ({...it, selected: select})));

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
                            {!ignoredCols.includes("product_id") && <TableCell sx={componentsStyles.headerCell}>{t('product')}</TableCell>}
                            {!ignoredCols.includes("store_id") && <TableCell sx={componentsStyles.headerCell}>{t('location')}</TableCell>}
                            {/*<TableCell sx={componentsStyles.headerCell}>Stock</TableCell>*/}
                            {!ignoredCols.includes("stock") && <TableCell sx={componentsStyles.headerCell}>{t('stock')}</TableCell>}
                            {!ignoredCols.includes("packs") && <TableCell sx={componentsStyles.headerCell}>{t('emptyPacks')}</TableCell>}
                            {!ignoredCols.includes("expiration_date") && <TableCell sx={componentsStyles.headerCell}>{t('expiration')}</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, index) => (
                            isValidRowData(item, "items") && <TableRow key={item.id}>
                                <TableCell sx={componentsStyles.tableCell}>
                                    <Checkbox 
                                        checked={item.selected} 
                                        onChange={() => toggleSelect(index)} />
                                </TableCell>
                                {!ignoredCols.includes("product_id") && <TableCell sx={componentsStyles.tableCell}>{item.productData?.name || "S/D"}</TableCell>}
                                {!ignoredCols.includes("store_id") && <TableCell sx={componentsStyles.tableCell}>{item.storeData?.name || "S/D"}</TableCell>}
                                {/*<TableCell sx={componentsStyles.tableCell}>{item.stock} unidades</TableCell>*/}
                                {!ignoredCols.includes("stock") && <TableCell sx={componentsStyles.tableCell}>{item.totalAmount} {item.productData?.pack_unit}</TableCell>}
                                {!ignoredCols.includes("packs") && <TableCell sx={componentsStyles.tableCell}>{item.packs ? item.packs : 0}</TableCell>}
                                {!ignoredCols.includes("expiration_date") && <TableCell sx={componentsStyles.tableCell}>{item.expiration_date ? moment(item.expiration_date).format("DD/MM/YYYY") : "-"}</TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ItemList;