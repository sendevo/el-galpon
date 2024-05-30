import { useEffect, useState } from "react";
import { 
    Button, 
    Grid,
    Typography,
    Paper
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
import { debug } from "../../model/utils";
import { validOperationType, OPERATION_TYPES_NAMES } from "../../model/constants";
import amountIcon from "../../assets/icons/productos.png"
import { componentsStyles } from "../../themes";

// TODO
const validForm = formData => (false);

const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const db = useDatabase();
        
    const [viewTitle, setViewTitle] = useState("Nuevo movimiento");
    const [formData, setFormData] = useState({
        products: [],
        items: [],
        sameStore:false
    });
    
    const toast = useToast();

    useEffect(() => {
        db.query("stores").then(stores => setFormData({...formData, stores}));

        const opType = searchParams.get("type");
        if(validOperationType(opType)){
            setViewTitle(OPERATION_TYPES_NAMES[opType]);
            if(opType === "BUY"){  // Buy operation requires product data
                const productsId = searchParams.get("products");
                if(Boolean(productsId)){
                    const pIds = productsId.split("_");
                    db.query("products", pIds)
                        .then(products => {
                            setFormData({
                                ...formData,
                                products: products.map(p => {
                                    const {pack_size, name, pack_unit, brand} = p;
                                    return {pack_size, name, pack_unit, brand};
                                }),
                                opType: "BUY"
                            })
                        })
                        .catch(console.error);
                }else{
                    console.error("Product not specified for operation", opType);
                }
            }else{ // Other operations require item data (stock and packs)
                const itemsId = searchParams.get("items");
                if(Boolean(itemsId)){
                    const iIds = itemsId.split("_");
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

    const handleInputChange = event => {
        const {name, value} = event.target;
        const input = name.split("_");
        if(input.length === 2){
            switch(input[0]){
                case "amountp":
                    console.log("updating",input[1]);
                    const products = [...formData.products];
                    products[input[1]].amount = value;
                    setFormData({
                        ...formData,
                        products,
                        modified: Date.now()
                    });   
                    break;
                default: 
                    break;
            }
        }
    };

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
                <Grid item xs={12}>
                    <Paper sx={componentsStyles.paper}>
                    <Typography lineHeight={"1em"} paddingBottom={"10px"}>Destino del movimiento</Typography>
                        <Switch 
                            labelLeft="Mismo depósito"
                            labelRight="Elegir cada uno"
                            name="sameStore"
                            value={formData.sameStore}
                            onChange={handleInputChange}/>
                    </Paper>
                </Grid>
                {formData.products?.map((product, index) => (
                    <Grid item key={product.id}>
                        <Paper sx={componentsStyles.paper}>
                            <Typography lineHeight={"2em"} paddingBottom={"15px"}><b>Producto: </b>{product.name}</Typography>
                            <Input 
                                icon={amountIcon}
                                label="Cantidad*"
                                name={"amountp_"+index}
                                type="number"
                                value={product.amount || ""}
                                error={formData.name === ""}
                                onChange={handleInputChange}/>
                            <Typography sx={{...componentsStyles.hintText, textAlign:"right", p:1}}>
                                {product.amount ? `Cantidad total = ${product.pack_size*product.amount} ${product.pack_unit}` : ""}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
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