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

const findStoreData = (stores, id) => stores.find(s => s.id === id);

const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const toast = useToast();
    
    const db = useDatabase();
        
    const [viewTitle, setViewTitle] = useState("Nuevo movimiento");
    const [stores, setStores] = useState([]);
    const [formData, setFormData] = useState({
        opType: "",
        products: [],
        items: [],
        stores: [],
        sameStore: true,
        globalStoreId: ""
    });

    useEffect(() => {
        const opType = searchParams.get("type");

        if(validOperationType(opType)){
            setViewTitle(OPERATION_TYPES_NAMES[opType]);
            db.query("stores", []).then(stores => {
                setStores(stores.map(s => ({id: s.id, name: s.name})));
                if(opType === "BUY"){  // Buy operation requires product data
                    const productsId = searchParams.get("products");
                    if(Boolean(productsId)){
                        const pIds = productsId.split("_");
                        db.query("products", pIds)
                            .then(products => {
                                setFormData({
                                    ...formData,
                                    products: products.map(p => {
                                        const {id, pack_size, name, pack_unit, brand} = p;
                                        return {id, pack_size, name, pack_unit, brand};
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
            });
        }else{
            console.error("Unrecognised operation type");
            navigate(-1);
        }
    }, []);

    const handleInputChange = event => {
        const {name, value} = event.target;

        const input = name.split("_");
        if(input.length === 2){ // Input is a product field
            switch(input[0]){
                case "amountp":
                    const products = [...formData.products];
                    products[input[1]].amount = value;
                    setFormData({
                        ...formData,
                        products,
                        modified: Date.now()
                    });   
                    break;
                case "storep":
                    const stores = [...formData.stores];
                    stores[input[1]] = value;
                    setFormData({
                        ...formData,
                        stores,
                        modified: Date.now()
                    });
                    break;
                default: 
                    break;
            }
            return;
        }

        if(name === "globalStore"){
            setFormData({
                ...formData,
                globalStoreId: value,
                modified: Date.now()
            });
            return;
        }

        setFormData({
            ...formData,
            modified: Date.now(),
            [name]: value
        });
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
                        <Grid container direction="column" spacing={2}> 
                            <Grid item>
                                <Typography lineHeight={"1em"} paddingBottom={"10px"}>Destino del movimiento</Typography>
                            </Grid>
                            <Grid item>
                                <Switch 
                                    labelFalse="Elegir cada uno"
                                    labelTrue="Mismo depósito"
                                    name="sameStore"
                                    value={formData.sameStore}
                                    onChange={handleInputChange}/>
                            </Grid>
                            { formData.sameStore &&
                                <Grid item>
                                    <Select
                                        label="Destino*"
                                        name="globalStore"
                                        value={formData.globalStoreId || ""}
                                        error={formData.globalStore === ""}
                                        options={stores.map(s => ({label: s.name, value: s.id}))}
                                        onChange={handleInputChange}/>
                                </Grid> 
                            }
                        </Grid>
                    </Paper>
                </Grid>
                {formData.products?.map((product, pIndex) => (
                    <Grid item key={product.id}>
                        <Paper sx={componentsStyles.paper}>
                            <Typography lineHeight={"2em"} paddingBottom={"15px"}><b>Producto: </b>{product.name}</Typography>
                            <Input 
                                icon={amountIcon}
                                label="Cantidad*"
                                name={"amountp_"+pIndex}
                                type="number"
                                value={product.amount || ""}
                                error={formData.name === ""}
                                onChange={handleInputChange}/>
                            <Typography sx={{...componentsStyles.hintText, textAlign:"right", p:1}}>
                                {product.amount ? `Cantidad total = ${product.pack_size*product.amount} ${product.pack_unit}` : ""}
                            </Typography>
                            <Select
                                label="Destino*"
                                name={"storep_"+pIndex}
                                value={formData.stores.at(pIndex)?.name || ""}
                                error={formData.stores.at(pIndex)?.name === ""}
                                options={formData.stores?.map(s => ({label: s.name, value: s.id}))}
                                onChange={handleInputChange}/>
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