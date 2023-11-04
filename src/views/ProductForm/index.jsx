import { useEffect, useState } from "react";
import { 
    Button, 
    Grid,
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
import background from "../../assets/backgrounds/background1.jpg";


const sectionStyle = {
    fontWeight: "bold",
    fontSize: "14px"
};

const defaultValues = {
    pack_unit: "l",
    expirable: false,
    returnable: false
};

const validateForm = formData => Boolean(formData.name && formData.pack_size);

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    const [searchParams] = useSearchParams();
    
    const [formData, setFormData] = useState(defaultValues);

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){
            db.getItem(parseInt(id), 'products')
                .then(data => {
                    setFormData(data);
                })
                .catch(console.error);
        }
    }, []);

    const handleSubmit = () => {
        if(validateForm(formData)){
            debug(formData);
            db.addItem(formData,'products')
                .then(()=>{
                    console.log("Data pushed to db");
                    navigate(-1);
                })
                .catch(console.error);
        }else{
            debug("Complete all fields", "error");
        }
    };

    const handleInputChange = event => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return(
        <MainView title={"Edición de producto"} background={background}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Input 
                        label="Nombre"
                        name="name"
                        type="text"
                        value={formData.name || ""}
                        error={formData.name === ""}
                        onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={sectionStyle}>Presentación</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Input 
                                label="Capacidad"
                                name="pack_size"
                                type="number"
                                value={formData.pack_size || ""}
                                onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                label="Unidad"
                                name="pack_unit"
                                value={formData.pack_unit}
                                options={UNITS.map(u => ({label: u, value: u}))}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Switch 
                        title="Caducidad"
                        labelLeft="Sin vencimiento"
                        labelRight="Con vencimiento"
                        name="expirable"
                        value={formData.expirable}
                        onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={12}>
                    <Switch 
                        title="Reciclaje"
                        labelLeft="No retornable"
                        labelRight="Retornable"
                        name="returnable"
                        value={formData.returnable}
                        onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={sectionStyle}>Detalles adicionales</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Input 
                        label={"Marca/Fabricante"}
                        name="brand"
                        type="text"
                        value={formData.brand || ""}
                        onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={12}>
                    <SuggesterInput 
                        multiple
                        type="text"                                
                        label="Categorías"
                        name="categories"
                        value={formData.categories || []}
                        onChange={handleInputChange}
                        options={CATEGORIES}/>
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