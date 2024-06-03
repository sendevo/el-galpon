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

const validateParams = searchParams => {
    const operation = searchParams.get("type");
    const itemsId = searchParams.get("items");
    const productsId = searchParams.get("products");
    const ids = itemsId ? itemsId.split("_") : productsId ? productsId.split("_") : [];
    const table = itemsId ? "items" : productsId ? "products" : "";
    return { 
        operation,
        table, 
        ids, 
        valid: validOperationType(operation) && ids.length > 0 
    };
}

const getMaxAmount = (item, operation) => {
    if(operation === "MOVE_STOCK" || operation === "SPEND")
        return item?.stock;
    if(operation === "MOVE_PACKS" || operation === "RETURN_PACKS")
        return item?.packs;
    return -1;
};

const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const toast = useToast();
    
    const db = useDatabase();
        
    const [viewTitle, setViewTitle] = useState("Nuevo movimiento");
    const [stores, setStores] = useState([]);
    const [formData, setFormData] = useState({
        operation: "",
        products: [],
        stores: [],
        sameStore: true,
        globalStoreId: ""
    });

    useEffect(() => {
        const queryData = validateParams(searchParams);
        if(queryData.valid){
            db.query("stores", []).then(storesData => {
                const stores = storesData.map(s => ({id: s.id, name: s.name}));
                const operation = queryData.operation;
                // Generate list of products to apply operation
                db.query(queryData.table, queryData.ids) // Get items or products depending on operation
                    .then(data => {
                        const products = data.map(row => {
                            let product, amount, maxAmount, store_id;
                            if(queryData.table === "items"){
                                product = row.productData;
                                maxAmount = getMaxAmount(row, operation);
                                amount = maxAmount;
                                store_id = row.store_id;
                            } else { // products
                                product = row;
                                amount = 0;
                                maxAmount = -1;
                                store_id = "";
                            }
                            const {id, pack_size, name, pack_unit, brand} = product;
                            return {
                                id, 
                                pack_size, 
                                name, 
                                pack_unit, 
                                brand, 
                                amount, 
                                maxAmount,
                                store_id,
                            };
                        });
                        setViewTitle(OPERATION_TYPES_NAMES[operation]);
                        setStores(stores);
                        setFormData({
                            ...formData,
                            products,
                            stores,
                            operation
                        });
                    })
                    .catch(console.error);
            });
        }else{
            console.error("Invalid URL parameters");
            navigate(-1);
        }
    }, []);

    const handleProductPropChange = (prop, index, value) => {
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
        setFormData(prevForm => ({
            ...prevForm,
            globalStoreId: value,
            products: prevForm.products.map(p => ({...p, store_id: value})),
            modified: Date.now()
        }));
    };

    const handleSubmit = () => {
        if(validForm(formData)){
            debug("Valid form");
        }else{
            debug("Complete all fields", "error");
            toast("Complete los campos obligatorios", "error");
        }
        debug(formData);
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
                            key={pIndex}
                            product={product} 
                            hideStore={formData.sameStore}
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