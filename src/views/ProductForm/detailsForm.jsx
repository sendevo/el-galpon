import {  
    Paper,
    Grid,
    Typography
} from "@mui/material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { 
    Input,
    SuggesterInput
} from "../../components/Inputs";
import { options2Select } from "../../model/utils";
import { componentsStyles } from "../../themes";
import { CATEGORIES } from "../../model/constants";


const DetailsForm = ({props, onChange}) => {

    const {
        brand,
        sku,
        categories,
        comments
    } = props;

    const { t } = useTranslation("productForm");

    return (
        <Paper sx={componentsStyles.paper}>
            <Typography lineHeight={"1em"} paddingBottom={"20px"}>{t("aditional_details")}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Input 
                        label={t("brand")}
                        name="brand"
                        type="text"
                        value={brand || ""}
                        onChange={onChange}/>
                </Grid>
                <Grid item xs={12}>
                    <Input 
                        multiline
                        label={t("sku")}
                        name="sku"
                        type="text"
                        value={sku || ""}
                        onChange={onChange}/>
                </Grid>
                <Grid item xs={12}>
                    <SuggesterInput 
                        multiple
                        type="text"
                        label={t("categories")}
                        name="categories"
                        value={options2Select(categories) || []}
                        onChange={onChange}
                        options={options2Select(CATEGORIES[i18next.language])}/>
                </Grid>
                <Grid item xs={12}>
                    <Input 
                        multiline
                        label={t("comments")}
                        name="comments"
                        type="text"
                        value={comments || ""}
                        onChange={onChange}/>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DetailsForm;