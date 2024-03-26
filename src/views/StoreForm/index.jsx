import { useEffect, useState } from "react";
import { 
    Button, 
    Grid,
    Paper,
    Typography 
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import { 
    Input
} from "../../components/Inputs";
import { debug } from "../../model/utils";
import { componentsStyles } from "../../themes";


const validateForm = formData => Boolean(formData.name && formData.lat && formData.lng);

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    const [searchParams] = useSearchParams();    
    const [viewTitle, setViewTitle] = useState("Depósitos");
    const [formData, setFormData] = useState({});
    const toast = useToast();

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){ // Editing form
            db.getRow(parseInt(id), "stores")
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
            db.addRow(formData,"stores")
                .then(()=>{
                    if(formData.id){ // Editing
                        debug("Store item updated successfully");
                        toast("Datos actualizados", "success", 2000);
                    }else{ // Create new
                        debug("New store item created successfully");
                        toast("Depósito creado", "success", 2000);
                    }
                    navigate(-1);
                })
                .catch(console.error);
        }else{
            debug("Complete all fields", "error");
            toast("Complete los campos obligatorios", "error");
        }
    };

    const handleInputChange = event => {
        const {name, value} = event.target;
        if(name.includes("contact_")){ // Contact data is nested
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
        <MainView title={viewTitle} >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper sx={{...componentsStyles.paper, padding:"10px"}}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>Básico</Typography>
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
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{...componentsStyles.paper, padding:"10px"}}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>Ubicación</Typography>
                        <Grid container spacing={1}>
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
                        <Typography sx={{fontSize:10, color:"gray", mt:1, textAlign:"right"}}>Selección manual desde mapa disponible próximamente</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{...componentsStyles.paper, padding:"10px"}}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>Datos de contacto</Typography>
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