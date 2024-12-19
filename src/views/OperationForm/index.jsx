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
import { getMissingFields, getURLParams, getProductData } from "./helpers";
import { debug } from "../../model/utils";
import { componentsStyles } from "../../themes";
import storeIcon from "../../assets/icons/barn.png";
import observationsIcon from "../../assets/icons/observations.png";


const View = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation("operations");
    const toast = useToast();    
    const db = useDatabase();

    const [stores, setStores] = useState([]); // Download all stores for selects

    const [formData, setFormData] = useState({
        products: [], // at least: {product_id, presentations, presentation_index, name, toStoreId, fromStoreId, amount}
        sameStore: false, // Use same store for all products
        globalStoreId: "", // For the switch
        obs: "" // Observations field
    });

    const operation = searchParams.get("type");
    const needLocation = operation !== "SPEND" && !formData.sameStore;

    useEffect(() => {
        const urlParams = getURLParams(searchParams);
        if(urlParams.valid){
            db.query("stores") // First, get list of stores for selects
                .then(stores => { // Then get item or products data depending on URL params
                    const {table, ids} = urlParams;
                    if(table === "items" || table === "products"){
                        db.query(table, ids)
                            .then(data => { // Data may be items of products
                                setFormData({
                                    ...formData,
                                    products: getProductData(table, data)
                                });
                                setStores(stores);
                            })
                            .catch(console.error);
                    }else{
                        debug("Invalid table", "error");
                        toast(t("invalid_url_params"), "error");
                        navigate(-1);
                    }
                })
                .catch(console.error);
        }else{
            debug("Invalid operation", "error");
            toast(t("invalid_url_params"), "error");
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

        const missingFields = getMissingFields(formData);

        if(missingFields.length === 0){
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
        }else{
            debug("Complete all fields", "error");
            toast(t(missingFields), "error");
        }
    };

    return (
        <MainView title={t(operation.toLowerCase())}>
            <Grid container spacing={1} direction="column">
                {/*This block shows global configuration when more than one product is selected*/}
                {formData.products.length > 1 && needLocation &&
                    <Grid item xs={12}>
                        <Paper sx={componentsStyles.paper}>
                            <Grid container direction="column" spacing={2}> 
                                <Grid item>
                                    <Typography sx={{lineHeight:"1em", fontWeight:"bold"}}>{t("destination")}</Typography>
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
                            //storeSelectionError={false}
                            showStoreTo={needLocation}
                            stores={stores} 
                            onPropChange={(prop, value) => handleProductPropChange(prop, pIndex, value)}/>
                    ))}
                </Grid>

                <Grid item>
                    <Paper sx={componentsStyles.paper}>
                        <Input
                            icon={observationsIcon}
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