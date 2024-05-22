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
import { 
    Input,
    SuggesterInput,
    Select,
    Switch
} from "../../components/Inputs";
import { debug, categories2Select } from "../../model/utils";
import { UNITS, CATEGORIES, validOperationType } from "../../model/constants";
import { componentsStyles } from "../../themes";

const validForm = formData => (false);

const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const db = useDatabase();
        
    const [viewTitle, setViewTitle] = useState("Nuevo movimiento");
    const [formData, setFormData] = useState({});
    
    const toast = useToast();

    useEffect(() => {
        const opType = searchParams.get("type");
        if(validOperationType(opType)){
            if(opType === "BUY"){ 
                console.log("buy");
            }else{ 
                // Other operations require item data (already in stock)
                const itemId = searchParams.get("itemId");
                if(Boolean(itemId)){
                    db.getItemData(itemId)
                        .then(setItemData)
                        .catch(console.error);
                }else{
                    console.error("Item not specified for operation", opType);
                    navigate(-1);
                }
            }
        }else{
            console.error("Unrecognised operation type");
            navigate(-1);
        }
    }, []);

    const handleSubmit = () => {
        if(validForm(formData)){
            debug(formData);
        }else{
            debug("Complete all fields", "error");
            toast("Complete los campos obligatorios", "error");
        }
    };

    const handleInputChange = event => {
        
    };

    return(
        <MainView title={viewTitle}>
            <Grid container spacing={2}>
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
                        <Grid item xs={6}>
                            <Button 
                                variant="contained"
                                onClick={handleSubmit}>
                                Continuar
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button 
                                variant="contained"
                                onClick={() => navigate(-1)}>
                                Cancelar
                            </Button>
                        </Grid>
                </Grid>
            </Grid>     
        </MainView>
    );
};

export default View;