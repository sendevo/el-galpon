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
            db.query("stores",[parseInt(id)])
                .then(data => {
                    if(data.length === 1){
                        setFormData(data[0]);
                        setViewTitle("Edición de depósito");
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
            db.insert(formData,"stores")
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

        if(name.includes("contact_")){
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

        if(name === "lat" || name === "lng"){
            if(formData.lat && formData.lng){
                const gglLnk = latLng2GoogleMap(formData.lat, formData.lng);
                console.log(gglLnk);
                setFormData({
                    ...formData,
                    gglLnk,
                    [name]: value
                });
                return;
            }
        }

        if(name === "gglLnk"){
            const result = googleMap2LatLng(value);
            if(result){ // Google map url link
                setFormData({
                    ...formData,
                    lat: result?.latitude,
                    lng: result?.longitude,
                    gglLnk: value
                });
                return;
            }else{ // Value is comma separated
                const values = value.split(",");
                if(values.length === 2){
                    setFormData({
                        ...formData,
                        lat: values[0],
                        lng: values[1],
                        gglLnk: value
                    });
                    return;
                }else{ // Value is in DMS format
                    const result = dms2LatLng(value);
                    if(result){
                        setFormData({
                            ...formData,
                            lat: result?.latitude,
                            lng: result?.longitude,
                            gglLnk: value
                        });
                        return;
                    }else{
                        console.error("Invalid value for lat/lng");
                    }
                }
            }

        }

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
                    <Paper sx={{...componentsStyles.paper, padding:"10px"}}>
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
                    <Paper sx={{...componentsStyles.paper, padding:"10px"}}>
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
                                name="gglLnk"
                                type="text"
                                value={formData.gglLnk || ""}
                                onChange={handleInputChange}/>
                        </Box>
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