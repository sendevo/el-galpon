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
import { UNITS, CATEGORIES, OPERATION_TYPES } from "../../model/constants";
import { componentsStyles } from "../../themes";


const validOperationType = type => Object.keys(OPERATION_TYPES).includes(type);

const validForm = formData => {
    return false;
};

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();
    const [searchParams] = useSearchParams();    
    const [viewTitle, setViewTitle] = useState("Movimientos");
    const [formData, setFormData] = useState({created: Date.now()});
    const [itemData, setItemData] = useState({
        productData: null,
        storeData: null
    });
    const [operationType, setOperationType] = useState(OPERATION_TYPES.UNDEFINED);
    const toast = useToast();

    useEffect(() => {
        const opType = searchParams.get("operationType");
        if(validOperationType(opType)){
            if(opType === OPERATION_TYPES.BUY){ 
                // Buying operation requires product to buy
                const productId = searchParams.get("productId");
                if(Boolean(productId)){
                    db.getRow(parseInt(productId), 'products')
                        .then(data => {
                            setItemData(prevData => ({
                                ...prevData,
                                productData: data
                            }));
                            setViewTitle("Compra de insumo");
                        })
                        .catch(console.error);
                }else{ // No product id provided
                    console.error("Product not specified for operation BUY");
                    navigate(-1);
                }
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
            setOperationType(OPERATION_TYPES[opType]);
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

    const handleCancel = () => {
        navigate(-1);
    };

    const handleInputChange = event => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            modified: Date.now()
        });
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
                                onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </Grid>
                </Grid>
            </Grid>     
        </MainView>
    );
};

export default View;