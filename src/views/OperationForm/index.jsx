import { useEffect, useState } from "react";
import { 
    Grid,
    Typography,
    Paper
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import ActionsBlock from "../../components/ActionsBlock";
import { 
    Select,
    Switch,
    Input
} from "../../components/Inputs";
import ProductBlock from "./productBlock";
import { debug } from "../../model/utils";
import { validOperationType, OPERATION_TYPES_NAMES } from "../../model/constants";
import { componentsStyles } from "../../themes";
import storeIcon from "../../assets/icons/barn.png";
import observationsIcoon from "../../assets/icons/observations.png";


const requireStock = ["MOVE_STOCK", "SPEND"];
const requirePacks = ["MOVE_PACKS", "RETURN_PACKS"];
const requireStore = ["MOVE_STOCK", "MOVE_PACKS", "BUY"];
const requireDestination = ["SPEND", "RETURN_PACKS"];

const validForm = formData => {
    const {operation, products} = formData;
    switch(operation){
        case "MOVE_STOCK":
        case "MOVE_PACKS":
        case "BUY":
            return products.every(p => p.amount > 0 && p.toStoreId !== "");
        case "SPEND":
        case "RETURN_PACKS":
            return products.every(p => p.amount > 0);
        default:
            return false;
    }
};

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
};

const getMaxAmount = (item, operation) => {
    if(requireStock.includes(operation))
        return item?.stock;
    if(requirePacks.includes(operation))
        return item?.empty_packs;
    return -1;
};

const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const { t } = useTranslation("operations");

    const toast = useToast();
    
    const db = useDatabase();

    const [viewTitle, setViewTitle] = useState(t("new_operation"));
    const [stores, setStores] = useState([]);
    const [formData, setFormData] = useState({
        operation: "",
        products: [],
        stores: [],
        sameStore: true,
        globalStoreId: "",
        obs: ""
    });

    const hasDestination = requireDestination.includes(formData.operation);
    const showGlobalStoreBlock = !hasDestination && formData.products.length > 1;
    const hideStoreInput = (formData.products.length > 1 && formData.sameStore) || hasDestination;

    useEffect(() => {
        const queryData = validateParams(searchParams);
        if(queryData.valid) {
            db.query("stores", []).then(storesData => {
                const stores = storesData.map(s => ({id: s.id, name: s.name}));
                const operation = queryData.operation;
                // Generate list of products to apply operation
                // For repeated ids, db.query will not return duplicates
                db.query(queryData.table, queryData.ids) // Get items or products depending on operation
                    .then(data => {
                        const products = data.map(row => {
                            let product, amount, maxAmount, toStoreId, currentStoreId;
                            if(queryData.table === "items"){ // Selected from existing stock
                                product = row.productData;
                                maxAmount = getMaxAmount(row, operation);
                                amount = maxAmount;
                                toStoreId = row.store_id;
                                currentStoreId = row.store_id; // Inmutable
                            } else { // Selected from product list
                                product = row;
                                amount = 0;
                                maxAmount = -1; // No limit
                                toStoreId = "";
                                currentStoreId = ""; // Inmutable
                            }
                            const {id, name, presentations, brand} = product;
                            return {
                                presentationIndex: 0, // By default, select first presentation
                                id, 
                                name, 
                                presentations, 
                                brand, 
                                amount, 
                                maxAmount,
                                toStoreId,
                                currentStoreId
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
        // These props are attributes of the form, not the object to store in DB
        prevProducts[index][prop] = value;
        setFormData({
            ...formData,
            products: prevProducts
        });   
    };

    const handleObservationsChange = value => {
        setFormData({
            ...formData,
            obs: value
        });
    };

    const handleSwitchChange = value => {
        setFormData({
            ...formData,
            sameStore: value
        });
    };

    const handleGlobalStoreSelect = value => {
        setFormData(prevForm => ({
            ...prevForm,
            globalStoreId: value,
            products: prevForm.products.map(p => ({...p, toStoreId: value}))
        }));
    };

    const handleSubmit = () => { /* Set operation data and add to DB*/
        if(validForm(formData)){
            console.log(formData.operation);
            console.log(formData.products); // Product list
            
            /*
            db.handleOperation(formData.operation, formData.products)
                .then(() => {
                    toast(t("operation_saved"), "success", 2000);
                    navigate(-1);
                })
                .catch(console.error);
            */

            toast(t("operation_completed"), "success", 2000);
            setTimeout(() => navigate(-1), 1000);
        }else{
            debug("Complete all fields", "error");
            toast("Complete los campos obligatorios", "error");
        }
    };

    return(
        <MainView title={t(viewTitle)}>
            <Grid container spacing={1} direction="column">
                {/*This block shows global configuration when more than one product is selected*/}
                {showGlobalStoreBlock &&
                    <Grid item xs={12}>
                        <Paper sx={componentsStyles.paper}>
                            <Grid container direction="column" spacing={2}> 
                                <Grid item>
                                    <Typography lineHeight={"1em"}>{t("destination")}</Typography>
                                </Grid>
                                <Grid item>
                                    <Switch 
                                        labelFalse={t("choose_each")}
                                        labelTrue={t("same_location")}
                                        name="sameStore"
                                        value={formData.sameStore}
                                        onChange={e => handleSwitchChange(e.target.value)}/>
                                </Grid>
                                { formData.sameStore &&
                                    <Grid item>
                                        <Select
                                            icon={storeIcon}
                                            label={t("select_location") + "*"}
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
                }

                <Grid item>
                    {formData.products?.map((product, pIndex) => (
                        <ProductBlock 
                            key={pIndex}
                            product={product} 
                            hideStoreInput={hideStoreInput}
                            storeSelectionError={product.toStoreId === product.currentStoreId && requireStore.includes(formData.operation)}
                            stores={stores} 
                            onPropChange={(prop, value) => handleProductPropChange(prop, pIndex, value)}/>
                    ))}
                </Grid>

                <Grid item>
                    <Paper sx={componentsStyles.paper}>
                        <Input
                            icon={observationsIcoon}
                            label={t("observations")}
                            name="obs"
                            type="text"
                            value={formData.obs || ""}
                            onChange={e => handleObservationsChange(e.target.value)}/>
                    </Paper>
                </Grid>

                <Grid item sx={{mt:1}}>
                    <Typography 
                        fontSize="15px"
                        color="rgb(50,50,50)">
                            * {t("mandatory_fields")}
                    </Typography>
                </Grid>

                {/*}
                <Grid item>
                    <Typography 
                        fontSize="12px"
                        color="#666"
                        lineHeight={"1em"}
                        mb={1}>
                            <i>{t("buttons_tip")}</i>
                    </Typography>
                </Grid>
                */}

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