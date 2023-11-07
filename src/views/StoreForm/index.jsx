import { useEffect, useState } from "react";
import { 
    Button, 
    Grid,
    Paper,
    Typography 
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import { 
    Input,
    SuggesterInput,
    Select,
    Switch
} from "../../components/Inputs";
import { debug } from "../../model/utils";
import { UNITS, CATEGORIES } from "../../model/constants";
import { componentsStyles } from "../../themes";
import background from "../../assets/backgrounds/background1.jpg";

const validateForm = formData => Boolean(formData.name && formData.lat && formData.lng);

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    const [searchParams] = useSearchParams();    
    const [viewTitle, setViewTitle] = useState("Depósitos");
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){ // Editing form
            db.getItem(parseInt(id), "stores")
                .then(data => {
                    setFormData(data);
                    setViewTitle("Edición de depósito");
                })
                .catch(console.error);
        }else{
            setViewTitle("Creación de depósito");
        }
    }, []);

    const handleSubmit = () => {
        if(validateForm(formData)){
            debug(formData);
            db.addItem(formData,"stores")
                .then(()=>{
                    if(formData.id) // Editing
                        debug("Item updated successfully");
                    else // Create new
                        debug("New item created successfully");
                    navigate(-1);
                })
                .catch(console.error);
        }else{
            debug("Complete all fields", "error");
        }
    };

    const handleInputChange = event => {
        const {name, value} = event.target;
        if(name.includes("contact_")){
            const contactField = name.replace("contact_", "");
            setFormData({
                ...formData,
                contact: {
                    ...formData.contact, 
                    [contactField]: value
                }
            });
        }else{
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    return(
        <MainView title={viewTitle} background={background}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Input 
                        label="Nombre*"
                        name="name"
                        type="text"
                        value={formData.name || ""}
                        error={formData.name === ""}
                        onChange={handleInputChange}/>
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
                <Grid item xs={12}>
                    <Paper sx={{...componentsStyles.paper, padding:"10px"}}>
                        <Typography lineHeight={"1em"} paddingBottom={"20px"}>Ubicación</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Input 
                                    label="Latitud*"
                                    name="lat"
                                    type="number"
                                    value={formData.lat || ""}
                                    error={formData.lat === ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Input 
                                    label="Longitud*"
                                    name="lng"
                                    type="number"
                                    value={formData.lng || ""}
                                    error={formData.lat === ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{...componentsStyles.paper, padding:"10px"}}>
                        <Typography lineHeight={"1em"} paddingBottom={"20px"}>Datos de contacto</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input 
                                    label="Responsable"
                                    name="contact_name"
                                    type="text"
                                    value={formData.contact?.name || ""}                                    
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label="Teléfono"
                                    name="contact_phone"
                                    type="text"
                                    value={formData?.contact?.phone || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label="Dirección"
                                    name="contact_address"
                                    type="text"
                                    value={formData?.contact?.address || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label="email"
                                    name="contact_email"
                                    type="text"
                                    value={formData?.contact?.email || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Typography 
                        fontSize="15px"
                        color="rgb(50,50,50)">* Campos obligatorios</Typography>
                </Grid>
                <Grid 
                    item 
                    container 
                    xs={12} 
                    alignItems="center" 
                    justifyContent="center">
                    <Button 
                        variant="contained"
                        onClick={handleSubmit}>
                        Guardar
                    </Button>
                </Grid>
            </Grid>     
        </MainView>
    );
};

export default View;