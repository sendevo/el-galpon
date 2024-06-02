import { useEffect, useState } from "react";
import { 
    Grid,
    Typography,
    Paper
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import ActionsBlock from "../../components/ActionsBlock";
import { 
    Select,
    Switch
} from "../../components/Inputs";
import ProductBlock from "./productBlock";
import { debug } from "../../model/utils";
import { validOperationType, OPERATION_TYPES_NAMES } from "../../model/constants";
import { componentsStyles } from "../../themes";
import storeIcon from "../../assets/icons/barn.png";

// TODO
const validForm = formData => (false);

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
                                        return {id, pack_size, name, pack_unit, brand, amount: 0, store: ""};
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

    const handleProductPropChange = (prop, index,value) => {
        const prevProducts = [...formData.products];
        prevProducts[index][prop] = value;
        setFormData({
            ...formData,
            products: prevProducts,
            modified: Date.now()
        });   
    };

    const handleSwitchChange = value => {
        setFormData({
            ...formData,
            sameStore: value,
            modified: Date.now()
        });
    };

    const handleGlobalStoreSelect = value => {
        setFormData({
            ...formData,
            globalStoreId: value,
            products: formData.products.map(p => ({...p, store: value})),
            modified: Date.now()
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
                                    onChange={e => handleSwitchChange(e.target.value)}/>
                            </Grid>
                            { formData.sameStore &&
                                <Grid item>
                                    <Select
                                        icon={storeIcon}
                                        label="Destino*"
                                        name="globalStore"
                                        value={formData.globalStoreId || ""}
                                        error={formData.globalStore === ""}
                                        options={stores.map(s => ({label: s.name, value: s.id}))}
                                        onChange={e => handleGlobalStoreSelect(e.target.value)}/>
                                </Grid> 
                            }
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item>
                    {formData.products?.map((product, pIndex) => (
                        <ProductBlock 
                            key={product.id}
                            product={product} 
                            hideStore={formData.sameStore}
                            pIndex={pIndex} 
                            stores={stores} 
                            onPropChange={(prop, value) => handleProductPropChange(prop, pIndex, value)}/>
                    ))}
                </Grid>

                <Grid item sx={{mt:5}}>
                    <Typography 
                        fontSize="15px"
                        color="rgb(50,50,50)">
                            * Campos obligatorios
                    </Typography>
                </Grid>

                <Grid item>
                    <ActionsBlock 
                        onSubmit={handleSubmit} 
                        onCancel={() => navigate(-1)}/>
                </Grid>
            </Grid>     
        </MainView>
    );
};

export default View;