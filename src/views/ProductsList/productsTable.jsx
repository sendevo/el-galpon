import { useState } from "react";
import { useTranslation } from 'react-i18next';
import {  
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Checkbox
} from '@mui/material';
import HeaderCell from "../../components/HeaderCell";
import { componentsStyles } from "../../themes";
import { cropString } from "../../model/utils";
import { FaCheck, FaTimes } from "react-icons/fa";


const ProductsTable = ({products, setProducts}) => {

    const [sortConfig, setSortConfig] = useState({ key: "product_id", direction: "asc" });
    const { t } = useTranslation('productsList');

    const attributes = ["name", "presentations", "expirable", "returnable", "brand", "sku", "comments", "categories"];
    const sortableFields = ["name", "expirable", "returnable", "brand", "sku", "categories"];

    const selected = products.filter(p => p.selected);

    const toggleSelect = product => {
        setProducts(prevProducts => {
            const index = prevProducts.findIndex(p => p.id === product.id);
            prevProducts[index].selected = !prevProducts[index].selected;
            const newProducts = [...prevProducts];
            return newProducts  ;
        });
    };

    const setAllSelected = select => setProducts(prevProducts => prevProducts.map(p => ({...p, selected: select})));

    const getPresentation = product => {
        let presentation = "";

        for(let p = 0; p < product.presentations.length; p++){
            if(product.presentations[p].bulk){
                presentation += `${t(product.presentations[p].unit)} (${t("bulk")})`;
            }else{
                presentation += `${product.presentations[p].pack_size} ${t(product.presentations[p].unit)}`;
            }
            presentation += p < product.presentations.length - 1 ? " / " : "";
        }
        return presentation;
    };

    const requestSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const sortingFunction = (a, b) => {
        switch(sortConfig.key){
            case "name":
                return a.name.localeCompare(b.name);
            
            default:
                return 0;
        }
    }

    const sortedProducts = [...products].sort((a, b) => 
        sortConfig.direction === "asc" ? 
            sortingFunction(a, b) : sortingFunction(b, a));

    return(
        <TableContainer component={Paper} sx={componentsStyles.paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={componentsStyles.headerCell}>
                            <Checkbox 
                                checked={selected.length === sortedProducts.length} 
                                onChange={e => setAllSelected(e.target.checked)} />
                        </TableCell>
                        {attributes.map((attr, index) => (
                            <HeaderCell 
                                sortedDirection={sortConfig.key === attr ? sortConfig.direction : ""}
                                onClick={() => requestSort(attr)}
                                key={index} 
                                attribute={t(attr)}/>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                {sortedProducts.map(product => (
                    <TableRow key={product.id}>
                        <TableCell sx={componentsStyles.tableCell}>
                            <Checkbox 
                                checked={product.selected} 
                                onChange={() => toggleSelect(product)} />
                        </TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{product.name || t('no_name')}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{getPresentation(product)}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{product.expirable ? <FaCheck color="green"/> : <FaTimes color="red"/>}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{product.returnable ? <FaCheck color="green"/> : <FaTimes color="red"/>}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{product.brand || "-"}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{product.sku || ""}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{cropString(product.comments || "-", 10)}</TableCell>
                        <TableCell sx={componentsStyles.tableCell}>{product.categories?.join(', ') || "-"}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductsTable;