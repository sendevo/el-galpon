import { Typography, Paper, Grid, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Input, Select } from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import { trimString } from "../../model/utils";
import amountIcon from "../../assets/icons/productos.png";
import storeIcon from "../../assets/icons/barn.png"; 
import scaleIcon from "../../assets/icons/scale.png";

const prodNameTrim = 30; // Maximum length of product name to display
const getStoreData = (stores, storeId) => stores.find(s => s.id === storeId);


const ProductBlock = props => {

    const {
        product, 
        stores, 
        showStoreTo,
        //storeSelectionError,
        onPropChange
    } = props;

    const [searchParams] = useSearchParams();
    const { t } = useTranslation("operations");
    
    const operation = searchParams.get("type");

    // Total amount is displayed at the bottom of the product block
    //const { totalAmount } = getPresentationData(product, product.presentation_index, t);
    let amount;
    const presentation = product.presentations[product.presentation_index];
    if(presentation.bulk)
        amount = product.amount;
    else
        amount = Math.ceil(product.amount / presentation.pack_size);
    const unitSuffix = presentation.bulk ? `(${t("bulk")})` : "";
    const totalAmount = amount + " " + t(presentation.unit) + " " + unitSuffix;

    // Get list of presentations for the select input
    const presentations = product.presentations.map((p, index) => {
        const {bulk, pack_size, unit} = p;
        return {
            label: bulk ? t(unit) : pack_size + " " + t(unit), 
            value: index
        };
    });

    return (
        <Paper sx={{...componentsStyles.paper, mt:1}}>
            <Grid 
                container 
                justifyContent="space-between" 
                direction={"column"} 
                spacing={1}>
                <Grid item xs={12}>
                    <Typography sx={{lineHeight:"1em", pt:1}}>
                        <b>{t("product") + ": "}</b> {trimString(product.name, prodNameTrim)}
                    </Typography>
                </Grid>

                {presentations.length > 1 ? 
                    <Grid item xs={12}>
                        <Select
                            icon={amountIcon}
                            label={t("presentation") + "*"}
                            value={product.presentation_index}
                            options={presentations}
                            onChange={e => onPropChange("presentation_index", e.target.value)}/>
                    </Grid>
                    :
                    <Grid item xs={12}> 
                        <Typography sx={{lineHeight:"1em", pb:1}}>
                            <b>{t("presentation") + ": "}</b> {presentations[0].label}
                        </Typography>
                    </Grid>
                }

                <Grid item xs={12}>
                    <Input 
                        icon={scaleIcon}
                        label={t("quantity") + " (" + t(product.presentations[product.presentation_index].unit) + ")"}
                        type="number"
                        value={product.amount > 0 ? product.amount : ""}
                        error={product.amount == ""}
                        onChange={e => onPropChange("amount", e.target.value)}/>
                </Grid>
                
                {Boolean(product.amount) && 
                    <>
                        <Grid item xs={12}>
                            <Typography sx={{...componentsStyles.hintText, textAlign:"right", mb:1}}>
                                {t('total_amount')} = {totalAmount}
                            </Typography>
                        </Grid>
                        {/*<Divider sx={{m:1}}/>*/}
                    </>
                }

                {showStoreTo && 
                    <Grid item xs={12}>
                        <Select
                            icon={storeIcon}
                            label={t("product_destination") + "*"}
                            value={product.toStoreId || ""}
                            error={product.toStoreId == ""}
                            options={stores?.map(s => ({label: s.name, value: s.id}))}
                            onChange={e => onPropChange("toStoreId", e.target.value)}/>
                    </Grid>
                }
                
                { product.fromStoreId &&
                    <Grid item xs={12}>
                        <Typography sx={{
                                ...componentsStyles.hintText, 
                                textAlign:"right", 
                                //color: storeSelectionError ? "#d32f2f" : "rgb(100,100,100)"
                            }}>
                            {t("current_location")}: {getStoreData(stores,product.fromStoreId).name}
                        </Typography>
                    </Grid>
                }

            </Grid>
        </Paper>
    );
};

export default ProductBlock;