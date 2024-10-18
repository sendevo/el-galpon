import { useEffect, useState } from "react";
import { 
    Button, 
    Paper,
    Grid,
    Typography 
} from "@mui/material";
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


const validateForm = formData => Boolean(formData.name && formData.pack_size);

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();
    const [searchParams] = useSearchParams();    
    const [viewTitle, setViewTitle] = useState("Productos");
    const [formData, setFormData] = useState({});
    const toast = useToast();

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
        setFormData({
            ...formData,
            modified: Date.now(),
            [name]: name === "categories" ? value.map(v => v.label) : value
        });
    };

    const handleSubmit = () => {
        if(validateForm(formData)){
            db.insert("products", formData)
                .then(()=>{
                    if(formData.id){ // Editing
                        debug("Product data updated successfully");
                        toast("Datos actualizados", "success", 2000);
                    }else{ // Create new
                        debug("New product created successfully");
                        toast("Producto creado", "success", 2000);
                    }
                    navigate(-1);
                })
                .catch(console.error);
        }else{
            debug("Complete all fields", "error");
            toast("Complete los campos obligatorios", "error");
        }
    };

    return(
        <MainView title={viewTitle}>
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
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>Presentación</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Input 
                                    disabled={Boolean(formData.id)}
                                    label="Presentación*"
                                    name="pack_size"
                                    type="number"
                                    value={formData.pack_size || ""}
                                    error={formData.pack_size === ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Select
                                    disabled={Boolean(formData.id)}
                                    label="Unidad*"
                                    name="pack_unit"
                                    value={formData.pack_unit || ""}
                                    error={formData.pack_unit === ""}
                                    options={UNITS.map(u => ({label: u, value: u}))}
                                    onChange={handleInputChange}
                                />
                            </Grid>
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
                                    options={options2Select(CATEGORIES)}/>
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