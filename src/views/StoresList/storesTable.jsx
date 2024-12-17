import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Checkbox, 
    Box
} from '@mui/material';
import HeaderCell from "../../components/HeaderCell";
import { componentsStyles } from "../../themes";
import { latLng2GoogleMap, cropString } from "../../model/utils";
import { FaExternalLinkAlt } from "react-icons/fa";


const StoresTable = ({stores, setStores}) => {

    const [sortDirection, setSortDirection] = useState("asc" );
    const { t } = useTranslation('storesList');

    const selected = stores.filter(st => st.selected);

    const toggleSelect = store => {
        setStores(prevStores => {
            const index = prevStores.findIndex(st => st.id === store.id);
            prevStores[index].selected = !prevStores[index].selected;
            const newStores = [...prevStores];
            return newStores;
        });
    };

    const setAllSelected = select => setStores(prevStores => prevStores.map(it => ({...it, selected: select})));

    const requestSort = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    const sortedStores = [...stores].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <Box>
            <TableContainer component={Paper} sx={componentsStyles.paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={componentsStyles.headerCell}>
                                <Checkbox 
                                    checked={selected.length === stores.length} 
                                    onChange={e => setAllSelected(e.target.checked)} />
                            </TableCell>
                            <HeaderCell 
                                sortedDirection={sortDirection}
                                onClick={() => requestSort()} 
                                attribute={t('name')}/>
                            <TableCell sx={componentsStyles.headerCell}>{t('location')}</TableCell>
                            <TableCell sx={componentsStyles.headerCell}>{t('comments')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {sortedStores.map(store => (
                        <TableRow key={store.id}>
                            <TableCell sx={componentsStyles.tableCell}>
                                <Checkbox 
                                    checked={store.selected} 
                                    onChange={() => toggleSelect(store)} />
                            </TableCell>
                            <TableCell sx={componentsStyles.tableCell}>{store.name || t('noname')}</TableCell>
                            <TableCell sx={{...componentsStyles.tableCell, textAlign:"center"}}>
                                {store.lat && store.lng ? 
                                    <Link 
                                        target="_blank"
                                        rel="nooreferrer"
                                        to={latLng2GoogleMap(store.lat, store.lng)}>
                                            <FaExternalLinkAlt/>
                                    </Link>
                                    :
                                    "-"
                                }
                            </TableCell>
                            <TableCell sx={componentsStyles.tableCell}>{cropString(store.comments || "-", 10)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default StoresTable;