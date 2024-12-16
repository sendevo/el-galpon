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



const ItemsTable = ({items, setItems, columns, divsx}) => {

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

    const getStock = item => {
        const pIndex = item.presentation_index;
        const presentation = item.productData.presentations[pIndex];
        const stockText = `${item.stock} ${t(presentation.unit)}`;
        return stockText;
    };

    return (
        <Box sx={divsx}>
            <TableContainer component={Paper} sx={componentsStyles.paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={componentsStyles.headerCell}>
                                <Checkbox 
                                    checked={selected.length === items.length} 
                                    onChange={e => setAllSelected(e.target.checked)} />
                            </TableCell>
                            {columns.includes("product_id") && <TableCell sx={componentsStyles.headerCell}>{t('product')}</TableCell>}
                            {columns.includes("store_id") && <TableCell sx={componentsStyles.headerCell}>{t('location')}</TableCell>}
                            {columns.includes("stock") && <TableCell sx={componentsStyles.headerCell}>{t('stock')}</TableCell>}
                            {columns.includes("empty_packs") && <TableCell sx={componentsStyles.headerCell}>{t('emptyPacks')}</TableCell>}
                            {columns.includes("expiration_date") && <TableCell sx={componentsStyles.headerCell}>{t('expiration')}</TableCell>}
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
                                {columns.includes("product_id") && <TableCell sx={componentsStyles.tableCell}>{item.productData.name || "S/D"}</TableCell>}
                                {columns.includes("store_id") && <TableCell sx={componentsStyles.tableCell}>{item.storeData.name || "S/D"}</TableCell>}
                                {columns.includes("stock") && <TableCell sx={componentsStyles.tableCell}>{item.stock ? getStock(item) : ""}</TableCell>}
                                {columns.includes("empty_packs") && <TableCell sx={componentsStyles.tableCell}>{item.empty_packs ? item.empty_packs : ""}</TableCell>}
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