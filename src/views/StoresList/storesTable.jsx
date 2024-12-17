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
import { componentsStyles } from "../../themes";
import { latLng2GoogleMap, cropString } from "../../model/utils";
import { FaExternalLinkAlt } from "react-icons/fa";


const StoresTable = ({stores, setStores}) => {

    const { t } = useTranslation('storesList');

    const selected = stores.filter(st => st.selected);

    const toggleSelect = index => {
        setStores(prevStores => {
            const newStores = [...prevStores];
            newStores[index].selected = !newStores[index].selected;
            return newStores;
        });
    };

    const setAllSelected = select => setStores(prevStores => prevStores.map(it => ({...it, selected: select})));

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
                            <TableCell sx={componentsStyles.headerCell}>{t('name')}</TableCell>
                            <TableCell sx={componentsStyles.headerCell}>{t('location')}</TableCell>
                            <TableCell sx={componentsStyles.headerCell}>{t('comments')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {stores.map((store, index) => (
                        <TableRow key={store.id}>
                            <TableCell sx={componentsStyles.tableCell}>
                                <Checkbox 
                                    checked={store.selected} 
                                    onChange={() => toggleSelect(index)} />
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