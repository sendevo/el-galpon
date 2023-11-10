import { useState } from "react";
import { 
    Accordion, 
    AccordionSummary, 
    AccordionDetails, 
    Box,
    Grid, 
    Button,
    Typography
} from "@mui/material";
import moment from "moment";
import {
    Search,
    SuggesterInput,
    Input,
    Switch
} from "../Inputs";
import { componentsStyles } from "../../themes";
import { CATEGORIES } from "../../model/constants";
import { categories2Select } from "../../model/utils";
import { 
    FaFilter,
    FaCalendarAlt,
    FaRegHandPointRight,
    FaRecycle,
    FaCalendarDay,
    FaShoppingBag
} from "react-icons/fa";

const defaultFilters = {
    // Values
    dateFrom: Date.now() - 1296000000,
    dateTo: Date.now(),
    categories: [],
    expirable: false,
    returnable: false,
    brand: "",
    // States
    dateFrom_active: false,
    dateTo_active: false,
    categories_active: false,
    expirable_active: false,
    returnable_active: false,
    brand_active: false
};

const isAllFiltersDisabled = filters => Object.keys(filters) // Used for filters icon state in query section
        .filter(fk => fk.includes("_active")) // Get only "..._active" attributes
        .map(fka => filters[fka]) // Get values of _active attributes
        .every(fkv => !fkv); // If all values are "false" --> all filters disabled

const SearchForm = ({fields, onFiltersChange, onQueryChange}) => {

    const [accExpanded, setAccExpanded] = useState(false);
    const [filters, setFilters] = useState(defaultFilters); // Paralell state to avoid re-renders when editing fields

    const handleInputChange = e => {
        const {name, value} = e.target;
        setFilters({
            ...filters,
            [name]: name === "dateFrom" || name === "dateTo" ? moment(value, "YYYY-MM-DD").unix()*1000 : value,
            [name+"_active"]: true
        });
    };

    const handleFiltersApply = () => {
        onFiltersChange({
            ...filters,
            categories: filters.categories.map(c => c.label)
        }); 
        setAccExpanded(false); // Collapse the query card on filter apply
    };

    const handleFiltersReset = () => {
        const df = defaultFilters;
        setFilters(df);
        onFiltersChange(df);
        setAccExpanded(false); // Collapse the query card on filter clear
    };

    return (
        <Box>
            <Accordion 
                sx={{
                    ...componentsStyles.paper,
                    ".Mui-focusVisible": {
                        backgroundColor: "rgba(255,255,255,0)!important"
                    }
                }}
                expanded={accExpanded}>
                <AccordionSummary
                    sx={{m:0, padding:"0px 5px"}}
                    size="small"
                    expandIcon={
                        <FaFilter 
                            onClick={()=>setAccExpanded(!accExpanded)} 
                            color={ isAllFiltersDisabled(filters) ? "gray" : "green"}
                            size={25} 
                            style={{padding:"2px"}}
                        />
                    }>
                    <Search submit={onQueryChange}/>
                </AccordionSummary>
                <AccordionDetails sx={{pt:0}}>
                    <Typography fontWeight="bold" sx={{mt: 0, mb: 2}}>
                            Filtrar resultados
                    </Typography>
                    <Grid container spacing={3}>
                        {fields.includes("categories") && 
                            <Grid item xs={12}>
                                <SuggesterInput 
                                    multiple
                                    type="text"                                
                                    label="Categorías"
                                    name="categories"
                                    value={filters.categories}
                                    onChange={handleInputChange}
                                    options={categories2Select(CATEGORIES)}
                                    icon={<FaRegHandPointRight color={filters.categories_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}/>
                            </Grid>
                        }
                        {fields.includes("expirable") && 
                            <Grid item xs={12}>
                                <Switch 
                                    icon={<FaCalendarDay color={filters.expirable_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}
                                    title=""
                                    labelRight="Con vencimiento"
                                    name="expirable"
                                    value={filters.expirable}
                                    onChange={handleInputChange}/>
                            </Grid>
                        }
                        {fields.includes("returnable") && 
                            <Grid item xs={12}>
                                <Switch 
                                    icon={<FaRecycle color={filters.returnable_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}
                                    title=""
                                    labelRight="Retornable"
                                    name="returnable"
                                    value={filters.returnable}
                                    onChange={handleInputChange}/>
                            </Grid>
                        }
                        {fields.includes("brand") && 
                            <Grid item xs={12}>
                                <Input 
                                    type="text"
                                    value={filters.brand}
                                    label="Marca"
                                    name="brand"
                                    onChange={handleInputChange}
                                    icon={<FaShoppingBag color={filters.brand_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}/>
                            </Grid>
                        }
                        {fields.includes("dateFrom") &&
                            <Grid item xs={12}>
                                <Input 
                                    type="date"
                                    value={moment(filters.dateFrom).format("YYYY-MM-DD")} 
                                    label="Fecha desde"
                                    name="dateFrom"
                                    onChange={handleInputChange}
                                    icon={<FaCalendarAlt color={filters.dateFrom_active ? "green":"gray"} size={20} />}
                                    rIcon={true}/>
                            </Grid>
                        }
                        {fields.includes("dateTo") && 
                            <Grid item xs={12}>
                                <Input 
                                    type="date"
                                    value={moment(filters.dateTo).format("YYYY-MM-DD")}
                                    label="Fecha hasta"
                                    name="dateTo"
                                    onChange={handleInputChange}
                                    icon={<FaCalendarAlt color={filters.dateTo_active ? "green":"gray"} size={20} />}
                                    rIcon={true}/>
                            </Grid>
                        }
                    </Grid>
                    <Grid 
                        sx={{mt:1}}
                        container 
                        direction={"row"}
                        spacing={2} 
                        justifyContent="space-around">
                        <Grid item>
                            <Button 
                                size="small"
                                variant="contained" 
                                color="red"
                                onClick={handleFiltersReset}>
                                    Limpiar filtros
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={handleFiltersApply}>
                                Aplicar
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
};

export default SearchForm;