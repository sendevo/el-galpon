import { useEffect, useState } from "react";
import {  
    Paper,
    Grid,
    Typography 
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

// Required fields: name, pack_sizes, pack_units
const validateForm = formData => Boolean(formData.name && formData.pack_sizes && formData.pack_units);

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();
    const [searchParams] = useSearchParams();    
    const toast = useToast();
    const { t } = useTranslation("productForm");

    const [viewTitle, setViewTitle] = useState(t('default_title'));
    const [formData, setFormData] = useState({
        pack_sizes: [],
        pack_units: [],
    });
    
    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){ // Editing product
            db.query('products', [id])
                .then(data => {
                    if(data.length === 1) 
                        setFormData(data[0]);
                    setViewTitle("Edición de producto");
                })
                .catch(console.error);
        }else{
            setViewTitle("Creación de producto");
        }
    }, []);

    const handleInputChange = event => {
        const {name, value} = event.target;
        
        let val = value;
        if(name === "categories"){
            val = value.map(v => v.label);
        }else if(name.includes("pack_sizes")){
            const index = parseInt(name.split("_")[1]);
            const sizes = [...formData.pack_sizes];
            sizes[index] = value;
            val = sizes;
        }else if(name.includes("pack_units")){
            const index = parseInt(name.split("_")[1]);
            const units = [...formData.pack_units];
            units[index] = value;
            val = units;
        }

        setFormData({
            ...formData,
            modified: Date.now(),
            [name]: val
        });
    };

    const handleSubmit = () => {
        if(validateForm(formData)){
            console.log(formData);
            /*
            db.insert("products", formData)
                .then(()=>{
                    if(formData.id){ // Editing
                        debug("Product data updated successfully");
                        toast(t(updated_data), "success", 2000);
                    }else{ // Create new
                        debug("New product created successfully");
                        toast(t(new_product_created), "success", 2000);
                    }
                    navigate(-1);
                })
                .catch(console.error);
            */
        }else{
            debug("Complete all fields", "error");
            toast(t(complete_all_fields), "error");
        }
    };

    return(
        <MainView title={t(viewTitle)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>Producto</Typography>
                        <Input 
                            label="Nombre*"
                            name="name"
                            type="text"
                            value={formData.name || ""}
                            error={formData.name === ""}
                            onChange={handleInputChange}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>Presentaciones</Typography>
                        <Grid container spacing={2} direction={"column"}>
                            {formData.pack_units.map((_, index) => (
                                <Grid item key={index}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Input 
                                                disabled={Boolean(formData.id)}
                                                label="Presentación*"
                                                name={"pack_sizes_"+index}
                                                type="number"
                                                value={formData.pack_sizes[index] || ""}
                                                error={formData.pack_sizes[index] === ""}
                                                onChange={handleInputChange}/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Select
                                                disabled={Boolean(formData.id)}
                                                label="Unidad*"
                                                name={"pack_units_"+index}
                                                value={formData.pack_units[index] || ""}
                                                error={formData.pack_units[index] === ""}
                                                options={UNITS.map(u => ({label: u, value: u}))}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                        {Boolean(formData.id) && <Typography sx={{...componentsStyles.hintText, textAlign:"center", p:1}}>
                            - Estos campos no se pueden editar en productos creados -
                        </Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"10px"}>Reciclaje y caducidad de envases</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Switch 
                                    labelFalse="Sin vencimiento"
                                    labelTrue="Con vencimiento"
                                    name="expirable"
                                    value={formData.expirable}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Switch 
                                    labelFalse="No retornable"
                                    labelTrue="Retornable"
                                    name="returnable"
                                    value={formData.returnable}
                                    onChange={handleInputChange}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"20px"}>Detalles adicionales</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input 
                                    label={"Marca/Fabricante"}
                                    name="brand"
                                    type="text"
                                    value={formData.brand || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    multiline
                                    label="SKU"
                                    name="sku"
                                    type="text"
                                    value={formData.sku || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <SuggesterInput 
                                    multiple
                                    type="text"                                
                                    label="Categorías"
                                    name="categories"
                                    value={options2Select(formData.categories) || []}
                                    onChange={handleInputChange}
                                    options={options2Select(CATEGORIES[i18next.language])}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    multiline
                                    label="Comentarios"
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
                        color="rgb(50,50,50)">* Campos obligatorios</Typography>
                </Grid>
            </Grid>
            <ActionsBlock onSubmit={handleSubmit} onCancel={() => navigate(-1)}/>
        </MainView>
    );
};

export default View;