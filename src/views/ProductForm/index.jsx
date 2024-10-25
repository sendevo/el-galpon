import { useEffect, useState } from "react";
import {  
    Paper,
    Grid,
    Typography,
    Button,
    Fab,
    Box
} from "@mui/material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import ActionsBlock from "../../components/ActionsBlock";
import { 
    Input,
    SuggesterInput,
    Select,
    Switch
} from "../../components/Inputs";
import { debug, options2Select } from "../../model/utils";
import { UNITS, CATEGORIES } from "../../model/constants";
import { componentsStyles } from "../../themes";
import { FaPlus, FaMinus } from "react-icons/fa";

// Required fields: name, pack_sizes, pack_units
const validateForm = formData => {
    const missingFields = [];
    if(!formData.name) missingFields.push("name");
    if(formData.pack_sizes.some(s => !s) || formData.pack_sizes.length === 0) missingFields.push("pack_sizes");
    if(formData.pack_units.some(u => !u) || formData.pack_units.length === 0) missingFields.push("pack_units");
    return missingFields;
};

const removeContainerStyle = {
    display: "flex",
    justifyContent: "center"
};

const removeButtonStyle = {
    minWidth: "30px",
    minHeight: "30px",
    padding: "0px",
    bottom: "2px",
    borderRadius: "50%"
};

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();
    const [searchParams] = useSearchParams();    
    const toast = useToast();
    const { t } = useTranslation("productForm");

    const [viewTitle, setViewTitle] = useState(t("default_title"));
    const [formData, setFormData] = useState({
        name: undefined,
        // If size === -1, presentation is bulk and size is hidden in other tables
        pack_sizes: [undefined], 
        pack_units: [undefined]
    });

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){ // Editing product
            db.query("products", [id])
                .then(data => {
                    if(data.length === 1) {
                        const product = data[0];
                        setFormData(product);
                    }
                    setViewTitle(t("edit_title"));
                })
                .catch(console.error);
        }else{
            setViewTitle(t("creation_title"));
        }
    }, []);

    const canEditPresentations = !Boolean(formData.id);

    const handleInputChange = event => {
        let {name, value} = event.target;

        // For category input, value is an array of objects
        if(name === "categories"){ 
            value = value.map(v => v.label);
        }
        
        // For presentation fields, values are set in pairs of sizes and units
        if(name.includes("pack_sizes") || name.includes("pack_units")){
            // Parse name, value and presentation index
            const str = name.split("_");
            if(str.length !== 3) {
                debug("Invalid name for presentation field", "error");
                return;
            }
            name = "pack_" + str[1]; // sizes or units depending on field
            const presentationIndex = parseInt(str[2]);
            const values = [...formData[name]];
            values[presentationIndex] = value;
            value = values;
        }

        setFormData({
            ...formData,
            modified: Date.now(),
            [name]: value
        });
    };

    const handleAddPresentation = () => {
        setFormData({
            ...formData,
            pack_sizes: [...formData.pack_sizes, undefined],
            pack_units: [...formData.pack_units, undefined]
        });
    };

    const handleRemovePresentation = index => {

        if(formData.pack_sizes.length === 1){
            toast(t("at_least_one_presentation"), "error");
            return;
        }

        setFormData({
            ...formData,
            pack_sizes: formData.pack_sizes.filter((_, i) => i !== index),
            pack_units: formData.pack_units.filter((_, i) => i !== index)
        });
        setBulk(currentValue => {
            const newValues = [...currentValue];
            newValues.splice(index, 1);
            return newValues;
        });
    };

    const handleSubmit = () => {
        const missingFields = validateForm(formData);
        if(missingFields.length > 0){
            missingFields.forEach(f => {
                toast(t("missing_field") + t(f), "error");
            })
            return;
        }
        db.insert("products", formData)
            .then(()=>{
                if(formData.id){ // Editing
                    debug("Product data updated successfully");
                    toast(t("updated_data"), "success", 2000);
                }else{ // Create new
                    debug("New product created successfully");
                    toast(t("new_product_created"), "success", 2000);
                }
                navigate(-1);
            })
            .catch(console.error);
    };

    return(
        <MainView title={t(viewTitle)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>{t("product")}</Typography>
                        <Input 
                            label={t("name")+"*"}
                            name="name"
                            type="text"
                            value={formData.name || ""}
                            error={formData.name === ""}
                            onChange={handleInputChange}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"20px"}>{t("presentations")}</Typography>
                        <Grid container spacing={0} direction={"column"}>
                            {formData.pack_units.map((_, index) => (
                                <Grid item key={index} sx={{mt:1}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Input 
                                                disabled={!canEditPresentations}
                                                label={t("presentation")+"*"}
                                                name={"pack_sizes_"+index}
                                                type="number"
                                                value={formData.pack_sizes[index] || ""}
                                                error={formData.pack_sizes[index] === ""}
                                                onChange={handleInputChange}/>
                                        </Grid>
                                        <Grid item xs={canEditPresentations ? 5:6}>
                                            <Select
                                                disabled={!canEditPresentations}
                                                label={t("unit")+"*"}
                                                name={"pack_units_"+index}
                                                value={formData.pack_units[index] || ""}
                                                error={formData.pack_units[index] === ""}
                                                options={UNITS[i18next.language].map(u => ({label: t(u), value: u}))}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        {canEditPresentations && <Grid item xs={1}>
                                            <Box sx={removeContainerStyle}>
                                                <Button  
                                                    sx={removeButtonStyle}
                                                    size="small"
                                                    color="red" 
                                                    variant="contained"
                                                    onClick={() => handleRemovePresentation(index)}>
                                                    <FaMinus/>
                                                </Button>
                                            </Box>
                                        </Grid>}
                                    </Grid>
                                </Grid>
                            ))}
                            {canEditPresentations && <Grid item container justifyContent="flex-end">
                                <Fab size="small" color="primary" onClick={handleAddPresentation}>
                                    <FaPlus/>
                                </Fab>
                            </Grid>}
                        </Grid>
                        {!canEditPresentations && <Typography sx={{...componentsStyles.hintText, textAlign:"center", p:1}}>
                            - {t("not_allowed_edit_fields")} -
                        </Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"10px"}>{t("expiration")}</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Switch 
                                    labelFalse={t("not_expirable")}
                                    labelTrue={t("expirable")}
                                    name="expirable"
                                    value={formData.expirable}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Switch 
                                    labelFalse={t("not_returnable")}
                                    labelTrue={t("returnable")}
                                    name="returnable"
                                    value={formData.returnable}
                                    onChange={handleInputChange}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"20px"}>{t("aditional_details")}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input 
                                    label={t("brand")}
                                    name="brand"
                                    type="text"
                                    value={formData.brand || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    multiline
                                    label={t("sku")}
                                    name="sku"
                                    type="text"
                                    value={formData.sku || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <SuggesterInput 
                                    multiple
                                    type="text"                                
                                    label={t("categories")}
                                    name="categories"
                                    value={options2Select(formData.categories) || []}
                                    onChange={handleInputChange}
                                    options={options2Select(CATEGORIES[i18next.language])}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    multiline
                                    label={t("comments")}
                                    name="comments"
                                    type="text"
                                    value={formData.comments || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{mb:1}}>
                    <Typography 
                        fontSize="15px"
                        color="rgb(50,50,50)">* {t("mandatory_fields")}</Typography>
                </Grid>
            </Grid>
            <ActionsBlock onSubmit={handleSubmit} onCancel={() => navigate(-1)}/>
        </MainView>
    );
};

export default View;