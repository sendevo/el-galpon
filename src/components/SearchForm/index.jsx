import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
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
import { 
    CATEGORIES,
    OPERATION_TYPES, 
    OPERATION_TYPES_NAMES 
} from "../../model/constants";
import { options2Select } from "../../model/utils";
import { useDatabase } from "../../context/Database";
import { 
    FaFilter,
    FaCalendarAlt,
    FaRegHandPointRight,
    FaRecycle,
    FaCalendarDay,
    FaShoppingBag
} from "react-icons/fa";
import i18next from "i18next";

const defaultFilters = { // Filter values
    // Common
    dateFrom: Date.now() - 1296000000,
    dateTo: Date.now(),
    // For stock
    categories: [],
    expirable: false,
    returnable: false,
    brand: "",
    // For operations
    types: [],
    productsIds: [],
    storesIds: [],

    // States
    dateFrom_active: false,
    dateTo_active: false,
    categories_active: false,
    expirable_active: false,
    returnable_active: false,
    brand_active: false,
    types_active: false,
    productsIds_active: false,
    storesIds_active: false
};

const isAllFiltersDisabled = filters => Object.keys(filters) // Used for filters icon state in query table
        .filter(fk => fk.includes("_active")) // Get only "..._active" attributes
        .map(fka => filters[fka]) // Get values of _active attributes
        .every(fkv => !fkv); // If all values are "false" --> all filters disabled


const OPERATIONS = Object.keys(OPERATION_TYPES).map(op => OPERATION_TYPES_NAMES[op]);

const SearchForm = ({fields, onFiltersChange, onQueryChange, sx}) => {

    const db = useDatabase();
    const {t} = useTranslation('search');

    const [accExpanded, setAccExpanded] = useState(false);
    const [filters, setFilters] = useState(defaultFilters); // Paralell state to avoid re-renders when editing fields
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    
    useEffect(() => {
        if(fields.includes("productsIds")){
            db.query("products")
                .then(data => {
                    const names = data.map(item => item.name);
                    setProducts(names);
                });
        }
        if(fields.includes("storesIds")){
            db.query("stores")
                .then(data => {
                    const names = data.map(item => item.name);
                    setStores(names);
                });
        }
    }, []);
        
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
            categories: filters.categories.map(c => c.label),
            types: filters.types.map(ty => ty.label),
            productsIds: filters.productsIds.map(p => p.label),
            storesIds: filters.storesIds.map(st => st.label)
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
        <Box sx={sx}>
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
                            style={{
                                padding:"1px",
                                margin:`0px ${accExpanded ? "10px" : "0px"} 0px ${accExpanded ? "0px" : "10px"}`
                            }}
                        />
                    }>
                    <Search submit={onQueryChange}/>
                </AccordionSummary>
                <AccordionDetails sx={{pt:0}}>
                    <Typography fontWeight="bold" sx={{mt: 0, mb: 2}}>
                        {t('filter')}
                    </Typography>
                    <Grid container spacing={3}>
                        {fields.includes("categories") && 
                            <Grid item xs={12}>
                                <SuggesterInput 
                                    multiple
                                    type="text"                                
                                    label={t('categories')}
                                    name="categories"
                                    value={filters.categories}
                                    onChange={handleInputChange}
                                    options={options2Select(CATEGORIES[i18next.language])}
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
                                    labelTrue={t('expirable')}
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
                                    labelTrue={t('returnable')}
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
                                    label={t('brand')}
                                    name="brand"
                                    onChange={handleInputChange}
                                    icon={<FaShoppingBag color={filters.brand_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}/>
                            </Grid>
                        }
                        {fields.includes("types") && 
                            <Grid item xs={12}>
                                <SuggesterInput 
                                    multiple
                                    type="text"                                
                                    label={t('type')}
                                    name="types"
                                    value={filters.types}
                                    onChange={handleInputChange}
                                    options={options2Select(OPERATIONS.map(op => t(op)))}
                                    icon={<FaRegHandPointRight color={filters.types_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}/>
                            </Grid>
                        }
                        {fields.includes("productsIds") && 
                            <Grid item xs={12}>
                                <SuggesterInput 
                                    multiple
                                    type="text"                                
                                    label={t('productsIds')}
                                    name="productsIds"
                                    value={filters.productsIds}
                                    onChange={handleInputChange}
                                    options={options2Select(products)}
                                    icon={<FaRegHandPointRight color={filters.productsIds_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}/>
                            </Grid>
                        }
                        {fields.includes("storesIds") && 
                            <Grid item xs={12}>
                                <SuggesterInput 
                                    multiple
                                    type="text"                                
                                    label={t('storesIds')}
                                    name="storesIds"
                                    value={filters.storesIds}
                                    onChange={handleInputChange}
                                    options={options2Select(stores)}
                                    icon={<FaRegHandPointRight color={filters.storesIds_active ? "green":"gray"} size={20}/>}
                                    rIcon={true}/>
                            </Grid>
                        }
                        {fields.includes("dateFrom") &&
                            <Grid item xs={12}>
                                <Input 
                                    type="date"
                                    value={moment(filters.dateFrom).format("YYYY-MM-DD")} 
                                    label={t('dateFrom')}
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
                                    label={t('dateTo')}
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
                                color="error"
                                onClick={handleFiltersReset}>
                                    {t('clear')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={handleFiltersApply}>
                                {t('apply')}
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
};

export default SearchForm;