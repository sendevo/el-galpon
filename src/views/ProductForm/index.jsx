import React, { useEffect, useState } from "react";
import {  
    Paper,
    Grid,
    Typography,
    Fab,
    Divider,
    Button,
    IconButton
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import ActionsBlock from "../../components/ActionsBlock";
import { 
    Input,
    Switch
} from "../../components/Inputs";
import PresentationInput from "./presentationInput";
import DetailsForm from "./detailsForm";
import { debug } from "../../model/utils";
import { componentsStyles } from "../../themes";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";

// Required fields: name, pack_sizes, pack_units
const validateForm = productData => {
    const missingFields = [];
    if(!productData.name) missingFields.push("name");
    if(productData.pack_sizes.some(s => !s) || productData.pack_sizes.length === 0) missingFields.push("pack_sizes");
    if(productData.pack_units.some(u => !u) || productData.pack_units.length === 0) missingFields.push("pack_units");
    return missingFields;
};

const removeButtonStyle = {
    container: {
        display: "flex",
        justifyContent: "center"
    },
    button: {
        minWidth: "30px",
        minHeight: "30px",
        padding: "0px",
        bottom: "4px",
        borderRadius: "50%"
    }
};

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();
    const [searchParams] = useSearchParams();    
    const toast = useToast();
    const { t } = useTranslation("productForm");

    const [productData, setProductData] = useState({
        name: undefined,
        pack_sizes: [undefined], 
        pack_units: [undefined],
        expirable: false,
        returnable: false
    });

    // In editing mode, saved product presentation cannot be edited
    const [inmutablePresentation, setInmutablePresentation] = useState(0); // Index of last

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){ // If id in URL -> edit
            db.query("products", [id])
                .then(data => {
                    if(data.length === 1) {
                        const product = data[0];
                        setInmutablePresentation(product.pack_sizes.length);
                        setProductData(product);
                    }else{
                        debug("Error when queryin data: more than one product", "error");
                    }
                })
                .catch(console.error);
        }
    }, []);

    const handleAddPresentation = () => {
        setProductData({
            ...productData,
            pack_sizes: [...productData.pack_sizes, undefined],
            pack_units: [...productData.pack_units, undefined]
        });
    };

    const handleRemovePresentation = index => {
        if(index < inmutablePresentation){
            toast(t("cannot_remove_this_presentation"), "error");
            return;
        }

        if(productData.pack_sizes.length === 1){
            toast(t("at_least_one_presentation"), "error");
            return;
        }
        setProductData({
            ...productData,
            pack_sizes: productData.pack_sizes.filter((_, i) => i !== index),
            pack_units: productData.pack_units.filter((_, i) => i !== index)
        });
    };

    const handlePresentationChange = (event, index) => {
        const newProductData = productData;
        const {name, value} = event.target;

        if(name === "packSize") {
            newProductData.pack_sizes[index] = value;
        }

        if(name === "packUnit") {
            newProductData.pack_units[index] = value;
        }

        setProductData(currentState => ({
            ...currentState,
            ...newProductData
        }));
    }

    const handleInputChange = event => {
        let {name, value} = event.target;

        // For category input, value is an array of objects
        if(name === "categories"){ 
            value = value.map(v => v.label);
        }
        
        setProductData({
            ...productData,
            modified: Date.now(),
            [name]: value
        });
    };

    const handleSubmit = () => {
        const missingFields = validateForm(productData);
        if(missingFields.length > 0){
            missingFields.forEach(f => {
                toast(t("missing_field") + t(f), "error");
            })
            return;
        }
        db.insert("products", productData)
            .then(()=>{
                if(productData.id){ // Editing
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

    const viewTitle = Boolean(productData.id) ? "edit_title":"creation_title";

    return(
        <MainView title={t(viewTitle)}>
            <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>{t("product")}</Typography>
                        <Input 
                            label={t("name")+"*"}
                            name="name"
                            type="text"
                            value={productData.name || ""}
                            error={productData.name === ""}
                            onChange={handleInputChange}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Grid container direction={"column"} spacing={2}>
                            <Grid item>
                                <Typography lineHeight={"1em"} paddingBottom={"20px"}>{t("presentations")}</Typography>
                            </Grid>
                            {productData.pack_units.map((_, index) => (
                                <Grid item sx={{mt:2}} key={index}>
                                    <Grid container alignItems={"flex-start"}>
                                        <Grid item xs>
                                            <PresentationInput 
                                                editable={index >= inmutablePresentation || viewTitle === "creation_title"}
                                                packSize={productData.pack_sizes[index]}
                                                packUnit={productData.pack_units[index]}
                                                onChange={e => handlePresentationChange(e, index)}/>
                                        </Grid>
                                        <Grid item>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleRemovePresentation(index)}
                                                sx={{ color: "#888", alignSelf:"flex-start", mt:-6 }}>
                                                <FaTimes />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    {(index !== productData.pack_units.length-1) && 
                                        <Divider 
                                            sx={{ 
                                                borderBottomWidth: 1, 
                                                mt:1, 
                                                boxShadow: "1px 1px 2px #999",
                                                backgroundColor: "#888" }}/>}
                                </Grid>
                            ))}
                            <Grid 
                                item 
                                container 
                                justifyContent="flex-end">
                                <Fab size="small" color="primary" onClick={handleAddPresentation}>
                                    <FaPlus/>
                                </Fab>
                            </Grid>
                        </Grid>
                        {Boolean(productData.id) && <Typography sx={{...componentsStyles.hintText, textAlign:"center", p:1}}>
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
                                    value={productData.expirable}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Switch 
                                    labelFalse={t("not_returnable")}
                                    labelTrue={t("returnable")}
                                    name="returnable"
                                    value={productData.returnable}
                                    onChange={handleInputChange}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <DetailsForm props={productData} onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={12} sx={{mb:2}}>
                    <Typography 
                        lineHeight={"1em"}
                        fontSize="15px"
                        color="rgb(50,50,50)">* {t("mandatory_fields")}</Typography>
                </Grid>
            </Grid>
            <ActionsBlock onSubmit={handleSubmit} onCancel={() => navigate(-1)}/>
        </MainView>
    );
};

export default View;