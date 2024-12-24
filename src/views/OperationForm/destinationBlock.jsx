import { 
    Grid,
    Typography,
    Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { 
    Select,
    Switch
} from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import storeIcon from "../../assets/icons/barn.png";


const DestinationBlock = ({formData, stores, handleSwitchChange, handleGlobalStoreSelect}) => {

    const { t } = useTranslation("operations");

    return(
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
                                onChange={e => handleGlobalStoreSelect("toStoreId", e.target.value)}/>
                        </Grid> 
                    }
                </Grid>
            </Paper>
        </Grid>
    );

};

export default DestinationBlock;