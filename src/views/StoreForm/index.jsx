import { useEffect, useState } from "react";
import { 
    Box,
    Button, 
    Grid,
    Paper,
    Typography 
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import usePrompt from "../../hooks/usePrompt";
import MainView from "../../components/MainView";
import { 
    Input
} from "../../components/Inputs";
import { 
    debug,
    latLng2GoogleMap,
    googleMap2LatLng,
    dms2LatLng
} from "../../model/utils";
import { componentsStyles } from "../../themes";
import { FaInfoCircle } from "react-icons/fa";


const validateForm = formData => Boolean(formData.name && formData.lat && formData.lng);

const getLatLong = locationInput => { // Get latitude and longitude from location input
    const result = googleMap2LatLng(locationInput) || dms2LatLng(locationInput);
    if(result){ // Google map url link
        return {
            lat: result?.latitude,
            lng: result?.longitude
        };
    }
    const values = locationInput.replace(/\s/g, "").split(",");
    if(values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])){
        return {
            lat: values[0],
            lng: values[1]
        };
    }    

    return null;
}


const View = () => {

    const [searchParams] = useSearchParams();    
    const navigate = useNavigate();
    
    const db = useDatabase();   
    
    const [viewTitle, setViewTitle] = useState("Depósitos");
    const [formData, setFormData] = useState({});

    const toast = useToast();
    const prmpt = usePrompt();

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){ // Editing form
            db.query("stores",[id])
                .then(data => {
                    if(data.length === 1){
                        setViewTitle("Edición de depósito");
                        setFormData({
                            ...data[0],
                            gmLink: latLng2GoogleMap(data[0]?.lat, data[0]?.lng)
                        });
                    }else{
                        console.error("Multiple items found with the same id");
                    }
                })
                .catch(console.error);
        }else{
            setViewTitle("Creación de depósito");
        }
    }, []);

    const handleSubmit = () => {
        if(validateForm(formData)){
            debug(formData);
            db.insert("stores",formData)
                .then(id => {
                    if(formData.id){ // Editing
                        toast("Datos actualizados", "success", 2000);
                    }else{ // Create new
                        debug("Item id = " + id);
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
        if(name.includes("contact_")){ // Contact fields are nested
            const contactField = name.replace("contact_", "");
            setFormData({
                ...formData,
                contact: {
                    ...formData.contact, 
                    [contactField]: value
                }
            });
            return;
        }

        if(name === "lat" || name === "lng"){ // For lat and lng fields, update google maps link
            if(formData.lat && formData.lng){
                setFormData({
                    ...formData,
                    gmLink: latLng2GoogleMap(formData.lat, formData.lng),
                    [name]: value
                });
                return;
            }
        }

        if(name === "gmLink"){ // For google maps link, update lat and lng fields
            const result = getLatLong(value);
            console.log(result);
            if(result){
                setFormData({
                    ...formData,
                    gmLink: value,
                    lat: result.lat,
                    lng: result.lng
                });
                return;
            }
        }

        // For other fields
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleLocationHelp = () => {
        prmpt({
            title: "Importar ubicación", 
            message: "En este campo de texto puede escribir o pegar un enlace de Google Maps; los valores de Latitud y Longitud separados por coma; o bien utilizar el formato GMS (grados, minutos, segundos).", 
            showCancelButton: false
        });
    };

    return(
        <MainView title={viewTitle} >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>Generales</Typography>
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
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"20px"}> Coordenadas </Typography>
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
                        <Typography lineHeight={"1em"} marginTop={"5px"} paddingBottom={"5px"}>
                            Importar
                            <Button 
                                onClick={handleLocationHelp} 
                                sx={{minWidth: "0px", padding: "6px 3px"}}>
                                <FaInfoCircle/>
                            </Button>
                        </Typography>
                        <Box sx={{mt:1}}>
                            <Input 
                                label="Ubicación"
                                name="gmLink"
                                type="text"
                                value={formData.gmLink || ""}
                                onChange={handleInputChange}/>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
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