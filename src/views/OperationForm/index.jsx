import { useEffect, useState } from "react";
import { 
    Button, 
    Grid,
    Typography 
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import { debug } from "../../model/utils";
import { validOperationType, OPERATION_TYPES_NAMES } from "../../model/constants";

const validForm = formData => (false);

const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const db = useDatabase();
        
    const [viewTitle, setViewTitle] = useState("Nuevo movimiento");
    const [formData, setFormData] = useState({});
    
    const toast = useToast();

    useEffect(() => {
        db.query("stores").then(stores => setFormData({...formData, stores}));

        const opType = searchParams.get("type");
        if(validOperationType(opType)){
            setViewTitle(OPERATION_TYPES_NAMES[opType]);
            if(opType === "BUY"){  // Buy operation requires product data
                const productsId = searchParams.get("products");
                if(Boolean(productsId)){
                    const pIds = productsId.split("_").map(id => parseInt(id));
                    db.query("products", pIds)
                        .then(products => setFormData({
                            ...formData,
                            products,
                            opType: "BUY"
                        }))
                        .catch(console.error);
                }else{
                    console.error("Product not specified for operation", opType);
                }
            }else{ // Other operations require item data (stock and packs)
                const itemsId = searchParams.get("items");
                if(Boolean(itemsId)){
                    const iIds = itemsId.split("_").map(id => parseInt(id));
                    db.query("items", iIds)
                        .then(items => {
                            setFormData({
                                ...formData,
                                items,
                                opType
                            });
                        })
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

    return(
        <MainView title={viewTitle}>
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Typography> Productos = {formData.products?.map(p => p.name).join(", ") || ""} </Typography>
                    <Typography> Items = {formData.items?.map(i => i.id).join(", ") || ""} </Typography>
                </Grid>
                <Grid item>
                    <Grid container>
                        <Typography 
                        fontSize="15px"
                        color="rgb(50,50,50)">
                            * Campos obligatorios
                        </Typography>
                    </Grid>
                    <Grid container spacing={2} direction={"row"} justifyContent={"space-around"}>
                        <Grid item>
                            <Button 
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}>
                                Confirmar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained"
                                color="error"
                                onClick={() => navigate(-1)}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>     
        </MainView>
    );
};

export default View;