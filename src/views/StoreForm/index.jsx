import { useEffect, useState } from "react";
import { 
    Box,
    Button, 
    Grid,
    Paper,
    Typography 
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import usePrompt from "../../hooks/usePrompt";
import MainView from "../../components/MainView";
import { 
    Input
} from "../../components/Inputs";
import { 
    latLng2GoogleMap,
    googleMap2LatLng,
    dms2LatLng
} from "../../model/utils";
import { componentsStyles } from "../../themes";
import { FaInfoCircle } from "react-icons/fa";


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

    const { t } = useTranslation("storeForm");
    
    const db = useDatabase();   
    
    const [viewTitle, setViewTitle] = useState(t("stores"));
    const [formData, setFormData] = useState({});

    const toast = useToast();
    const prmpt = usePrompt();

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){ // Editing form
            db.query("stores",[id])
                .then(data => {
                    if(data.length === 1){
                        setViewTitle(t("store_edit"));
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
            setViewTitle(t("store_create"));
        }
    }, []);

    const handleSubmit = () => {
        if(Boolean(formData.name)){ // Mandatory field
            db.insert("stores", [formData])
                .then(id => {
                    if(formData.id){ // Editing
                        toast(t("updated_data"), "success", 2000);
                    }else{ // Create new
                        console.log("Item id = " + id);
                        toast(t("store_create"), "success", 2000);
                    }
                    navigate(-1);
                })
                .catch(console.error);
        }else{
            console.error("Complete all fields");
            toast(t("complete_mandatory_fields"), "error");
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
            title: t("import_location_title"),
            message: t("import_location_text"), 
            showCancelButton: false
        });
    };

    return(
        <MainView title={viewTitle} >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>{t("common")}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input 
                                    label={t("name")+"*"}
                                    name="name"
                                    type="text"
                                    value={formData.name || ""}
                                    error={formData.name === ""}
                                    onChange={handleInputChange}/>
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
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"20px"}> {t("coordinates")} </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Input 
                                    label={t("latitude")}
                                    name="lat"
                                    type="number"
                                    value={formData.lat || ""}
                                    error={formData.lat === ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Input 
                                    label={t("longitude")}
                                    name="lng"
                                    type="number"
                                    value={formData.lng || ""}
                                    error={formData.lat === ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                        </Grid>
                        <Typography lineHeight={"1em"} marginTop={"5px"} paddingBottom={"5px"}>
                            {t("import")}
                            <Button 
                                onClick={handleLocationHelp} 
                                sx={{minWidth: "0px", padding: "6px 3px"}}>
                                <FaInfoCircle/>
                            </Button>
                        </Typography>
                        <Box sx={{mt:1}}>
                            <Input 
                                label={t("location")}
                                name="gmLink"
                                type="text"
                                value={formData.gmLink || ""}
                                onChange={handleInputChange}/>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                        <Typography lineHeight={"1em"} paddingBottom={"15px"}>{t("contact_data")}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Input 
                                    label={t("name")}
                                    name="contact_name"
                                    type="text"
                                    value={formData.contact?.name || ""}                                    
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label={t("phone")}
                                    name="contact_phone"
                                    type="text"
                                    value={formData?.contact?.phone || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label={t("address")}
                                    name="contact_address"
                                    type="text"
                                    value={formData?.contact?.address || ""}
                                    onChange={handleInputChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Input 
                                    label={t("email")}
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
                        color="rgb(50,50,50)">* {t("mandatory_fields")}</Typography>
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
                        {t("save")}
                    </Button>
                </Grid>
            </Grid>     
        </MainView>
    );
};

export default View;