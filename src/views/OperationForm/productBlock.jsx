import { Typography, Paper, Grid, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Input, Select } from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import { trimString } from "../../model/utils";
import amountIcon from "../../assets/icons/productos.png";
import storeIcon from "../../assets/icons/barn.png"; 

const prodNameTrim = 30;
const getStoreData = (stores, storeId) => stores.find(s => s.id === storeId);

// The following function computes size, unit and amount to generate strings for the presentation
const getPresentationData = (product, presentationIndex, translatingFc) => {
    const blk = product.presentations[presentationIndex].bulk;
    const packSize = blk ? "" : product.presentations[presentationIndex].pack_size;
    const unitSuffix = blk ? `(${translatingFc("bulk")})` : "";
    const unit = translatingFc(product.presentations[presentationIndex].unit) + " " + unitSuffix;
    const amount = (blk ? product.amount : product.amount * product.presentations[presentationIndex].pack_size);
    const totalAmount = amount + " " + translatingFc(product.presentations[presentationIndex].unit) + " " + unitSuffix;
    return {
        packSize,
        unit,
        totalAmount
    };
};

const ProductBlock = ({
        product, 
        stores, 
        storeSelectionError,
        hideStoreInput,
        onPropChange
    }) => {

    const { t } = useTranslation("productBlock");

    // Get list of presentations for the select input
    const presentations = product.presentations.map((_, index) => {
        const {packSize, unit} = getPresentationData(product, index, t);
        return {
            label: packSize + " " + unit, 
            value: index
        }
    });
    // Total amount is displayed at the bottom of the product block
    const { totalAmount } = getPresentationData(product, product.presentationIndex, t);

    return (
        <Paper sx={{...componentsStyles.paper, mt:1}}>
            <Grid 
                container 
                justifyContent="space-between" 
                direction={"column"} 
                spacing={1}>
                <Grid item xs={12}>
                    <Typography lineHeight={"2em"} paddingBottom={"5px"}><b>{t("product") + ": "}</b>{trimString(product.name, prodNameTrim)}</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Input 
                        icon={amountIcon}
                        label={
                            ( t("quantity") +
                            ` (${product.presentations[product.presentationIndex].pack_size === -1 ? "" : ("×"+t(product.presentations[product.presentationIndex].pack_size))}${t(product.presentations[product.presentationIndex].unit)}) *`)
                        }
                        type="number"
                        value={product.amount > 0 ? product.amount : ""}
                        error={product.amount == ""}
                        onChange={e => onPropChange("amount", e.target.value)}/>
                </Grid>

                {presentations.length > 1 && 
                    <Grid item xs={12}>
                        <Select
                            icon={amountIcon}
                            label={t("presentation") + "*"}
                            value={product.presentationIndex}
                            options={presentations}
                            onChange={e => onPropChange("presentationIndex", e.target.value)}/>
                    </Grid>
                }
                
                {Boolean(product.amount) && 
                    <>
                        <Grid item xs={12}>
                            <Typography sx={{...componentsStyles.hintText, textAlign:"right", mb:1}}>
                                {t('total_amount')} = {totalAmount}
                            </Typography>
                        </Grid>
                        <Divider sx={{m:1}}/>
                    </>
                }

                

                {!hideStoreInput && 
                    <Grid item xs={12}>
                        <Select
                            icon={storeIcon}
                            label={t("destination") + "*"}
                            value={product.toStoreId || ""}
                            error={product.toStoreId == ""}
                            options={stores?.map(s => ({label: s.name, value: s.id}))}
                            onChange={e => onPropChange("toStoreId", e.target.value)}/>
                    </Grid>
                }
                
                { product.currentStoreId &&
                    <Grid item xs={12}>
                        <Typography sx={{
                                ...componentsStyles.hintText, 
                                textAlign:"right", 
                                color: storeSelectionError ? "#d32f2f" : "rgb(100,100,100)"
                            }}>
                            {t("current_location")}: {getStoreData(stores,product.currentStoreId).name}
                        </Typography>
                    </Grid>
                }

            </Grid>
        </Paper>
    );
};

export default ProductBlock;