import {createRef, useEffect, useState } from "react";
import { 
    Grid,
    Typography,
    Paper,
    Modal
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../context/Database";
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import ActionsBlock from "../../components/ActionsBlock";
import { Input } from "../../components/Inputs";
import ProductBlock from "./productBlock";
import DestinationBlock from "./destinationBlock";
import OperationConfirmModal from "./operationConfirmModal";
import { 
    getMissingFields, 
    validateOperation, 
    getURLParams, 
    getProductData 
} from "./helpers";
import { debug } from "../../model/utils";
import { componentsStyles } from "../../themes";
import observationsIcon from "../../assets/icons/observations.png";


const View = () => {

    const ref = createRef();
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

    // The validation modal shows operation data before confirming
    const [modalOpen, setModalOpen] = useState(false);

    const operation = searchParams.get("type");

    useEffect(() => {
        const urlParams = getURLParams(searchParams);
        if(urlParams.valid){
            db.query("stores") // First, get list of stores for selects
                .then(st => { // Then get item or products data depending on URL params
                    const {table, ids} = urlParams;
                    if(table === "items" || table === "products"){
                        db.query(table, ids)
                            .then(data => { // Data may be items or products
                                setFormData({
                                    ...formData,
                                    products: getProductData(table, data)
                                });
                                setStores(st);
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

        // For the case of stores, add stores names to avoid passing the stores list to the modal
        if(prop === "toStoreId")
            prevProducts[index].toStoreName = stores.find(s => s.id === value).name;
        
        if(prop === "fromStoreId")
            prevProducts[index].fromStoreName = stores.find(s => s.id === value).name;

        if(prop === "min_stock" && value < 0)
            prevProducts[index][prop] = 0;
        
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

    const handleGlobalStoreSelect = (prop, value) => {
        if(prop === "toStoreId"){
            const toStoreName = stores.find(s => s.id === value).name;
            setFormData(prevForm => ({
                ...prevForm,
                globalStoreId: value,
                products: prevForm.products.map(p => ({
                    ...p, 
                    toStoreId: value, 
                    toStoreName}))
            }));
        }else{
            console.error("Invalid prop", prop);
        }
    };

    const handleValidate = () => {
        const missingFields = getMissingFields(formData.products, operation);

        if(missingFields.length === 0){
            const validationErrors = validateOperation(formData.products, operation);
            if(validationErrors.length === 0){
                setModalOpen(true);
            }else{
                console.error(validationErrors);
                toast(t(validationErrors), "error");
            }
        }else{
            console.error(missingFields);
            toast(t(missingFields), "error");
        }
    }

    const handleSubmit = () => { /* Set operation data and add to DB*/

        console.log("Submitting operation data", formData);
        toast("Operación finalizada", "success", 2000);
        setTimeout(() => {
            toast("(Datos no registrados)", "info", 2000);
            setModalOpen(false);
            navigate("/operations-list");
        }, 2000);
        

        /*
        db.handleOperation(formData.operation, formData.products)
            .then(() => {
                toast(t("operation_saved"), "success", 2000);
                navigate(-1);
            })
            .catch(console.error);
        */
    };

    return (
        <MainView title={t(operation.toLowerCase())}>
            <Grid container spacing={1} direction="column">
                {/*This block shows global configuration when more than one product is selected*/}
                {formData.products.length > 1 && operation !== "SPEND" && operation !== "RETURN_PACKS" &&
                    <DestinationBlock
                        formData={formData}
                        stores={stores}
                        handleSwitchChange={handleSwitchChange}
                        handleGlobalStoreSelect={handleGlobalStoreSelect}/>
                }

                <Grid item>
                    {formData.products?.map((product, pIndex) => (
                        <ProductBlock 
                            key={pIndex}
                            product={product} 
                            //storeSelectionError={false}
                            showStoreTo={operation !== "SPEND" && !formData.sameStore}
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

                <Grid item>
                    <ActionsBlock 
                        submitText={t('validate')}
                        onSubmit={handleValidate} 
                        onCancel={() => navigate(-1)}/>
                </Grid>
            </Grid>

            <Modal 
                sx={{overflow:"auto"}}
                open={modalOpen} 
                onClose={()=>setModalOpen(false)}>
                <OperationConfirmModal
                    ref={ref}
                    products={formData.products}
                    onConfirm={handleSubmit}
                    onCancel={()=>setModalOpen(false)}/>
            </Modal>
        </MainView>
    );
};

export default View;