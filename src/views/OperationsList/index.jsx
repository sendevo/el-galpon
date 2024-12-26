import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import SearchForm from "../../components/SearchForm";
import MainView from "../../components/MainView";
import EmptyList from "../../components/EmptyList";
import OperationsTable from "./operationsTable";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";


const View = () => {
    const db =       useDatabase();
    const toast =    useToast();
    const { t } =    useTranslation('operations');

    const [operations, setOperations] = useState([]);

    useEffect(() => {
        db.query("operations")
            .then(data => {
                setOperations(data);
            })
            .catch(error => {
                toast(t('errorLoading'), "error");
                console.error(error);
            });
    }, []);

    const handleSearch = query => {
        console.log(query);
    };

    const handleFilter = filters => {
        console.log(filters);
    };

    return(
        <MainView title={t('title')}>
            {operations.length > 0 ? 
            <Box>
                <SearchForm 
                        sx={{mb:2}}
                        fields={["types", "productsIds", "storesIds", "dateFrom", "dateTo"]} 
                        onFiltersChange={handleFilter}
                        onQueryChange={handleSearch}/>
                <OperationsTable operations={operations}/>
            </Box>
            :
                <EmptyList message={"Aún no se realizaron movimientos"}/>
            }
        </MainView>
    );
};

export default View;