import { Typography, Paper, Grid, Box } from "@mui/material";
import Calendar from 'react-calendar';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { Input, Select } from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import { trimString } from "../../model/utils";
import amountIcon from "../../assets/icons/productos.png";
import storeIcon from "../../assets/icons/barn.png"; 
import scaleIcon from "../../assets/icons/scale.png";
import notificationIcon from "../../assets/icons/notification.png";
import i18next from "i18next";

const prodNameTrim = 30; // Maximum length of product name to display
const getStoreData = (stores, storeId) => stores.find(s => s.id === storeId);

const localComponentStyles = { 
    stockAlertContainer: {
        maxWidth:"50%",
        marginLeft:"auto",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        textAlign:"right",
        mb:-2
    },
    stockAlertText: {
        ...componentsStyles.hintText, 
        textAlign:"right", 
        mb:1,
        whiteSpace: "normal" ,
        wordBreak: "break-word"
    },
    calendarContainer: {
        m:1,
        border:"1px solid rgb(200,200,200)",
        borderRadius:"5px",
        boxShadow:"0px 0px 5px 0px rgb(200,200,200)",
        backgroundColor:"white"
    }
};

const ProductBlock = props => {

    const {
        product, 
        stores, 
        showStoreTo,
        onPropChange
    } = props;

    const [searchParams] = useSearchParams();
    const { t } = useTranslation("operations");
    
    const operation = searchParams.get("type");

    const presentation = product.presentations[product.presentation_index];
    
    // Get list of presentations for the select input
    const presentations = product.presentations.map((p, index) => {
        const {bulk, pack_size, unit} = p;
        return {
            label: bulk ? t(unit) : pack_size + " " + t(unit), 
            value: index
        };
    });

    // Labels of the amount input:
    
    let quantityInputLabel = t("quantity") + " ";
    if(operation==="RETURN_PACKS") 
        quantityInputLabel += t("packs").toLocaleLowerCase()
    else
        quantityInputLabel += "(" + t(presentation.unit) + ")";
    
        const packAmountLabel = Math.ceil(product.amount / presentation.pack_size);

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
                        label={quantityInputLabel}
                        type="number"
                        value={product.amount > 0 ? product.amount : ""}
                        error={product.amount == ""}
                        onChange={e => onPropChange("amount", e.target.value)}/>
                </Grid>
                
                {Boolean(product.amount) && !presentation.bulk && operation!=="RETURN_PACKS" && product.returnable &&
                    <>
                        <Grid item xs={12}>
                            <Typography sx={{...componentsStyles.hintText, textAlign:"right", mb:1}}>
                                {t('total_amount')} = {packAmountLabel} {t('packs').toLocaleLowerCase()}
                            </Typography>
                        </Grid>
                        {/*<Divider sx={{m:1}}/>*/}
                    </>
                }

                {showStoreTo && operation !== "RETURN_PACKS" && 
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
                
                { product.fromStoreId && operation !== "BUY" &&
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

                { operation === "BUY" &&
                    <>
                        <Grid item xs={12}>
                            <Input 
                                icon={notificationIcon}
                                label={t("stock_limit_alert") + " (" + t(presentation.unit) + ")"}
                                type="number"
                                value={product.stock_limit_alert || ""}
                                onChange={e => onPropChange("stock_limit_alert", e.target.value)}/>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Box sx={localComponentStyles.stockAlertContainer}>
                                <Typography sx={localComponentStyles.stockAlertText}>
                                    {product.stock_limit_alert > 0 ? 
                                        t("stock_alert_message") + " " + parseInt(product.stock_limit_alert) + " " + t(presentation.unit)
                                        :
                                        t("no_stock_alert_message")
                                    }
                                </Typography>
                            </Box>
                        </Grid>
                        
                        {product.expirable && 
                            <Box sx={localComponentStyles.calendarContainer}>
                                <Typography sx={{lineHeight:"1em", pt:1, pl:1, fontWeight:"bold"}}>
                                    {t("expiration_date")}
                                </Typography>
                                <Calendar 
                                    calendarType='US'
                                    locale={i18next.language}
                                    selectRange={false}
                                    value={product.expiration_date ? new Date(product.expiration_date) : new Date()}
                                    onChange={d => onPropChange("expiration_date", moment(d).unix()*1000)}/>
                            </Box>
                        }

                    </>
                }
                
            </Grid>
        </Paper>
    );
};

export default ProductBlock;