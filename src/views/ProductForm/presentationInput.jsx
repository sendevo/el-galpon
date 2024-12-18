import {  
    Grid,
    Box
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { 
    Input,
    Select,
    Switch
} from "../../components/Inputs";
import { UNITS } from "../../model/constants";
import { capitalize } from "../../model/utils";

const PresentationInput = ({editable, presentation, onChange}) => {
    
    const { pack_size, unit, bulk } = presentation;
    const { t } = useTranslation("productForm");

    const packUnitOptions = Object
                            .keys(UNITS[i18next.language])
                            .map(key => ({
                                label: UNITS[i18next.language][key].name,
                                value: key
                            }));

    const handlePresentationChange = event => {
        const { name, value } = event.target;
        onChange(
            {...presentation, 
                [name]: value
            });
    };

    return(
        <Grid container direction={"column"}>
            <Grid 
                item
                container 
                direction={"row"} 
                spacing={1}>
                {!Boolean(bulk) && 
                    <Grid item xs={6}>
                        <Input 
                            disabled={!editable}
                            label={t("size")+"*"}
                            name={"pack_size"}
                            type="number"
                            value={pack_size || ""}
                            error={pack_size === ""}
                            onChange={handlePresentationChange}/>
                    </Grid>}
                <Grid item xs={!Boolean(bulk) ? 6:12}>
                    <Select
                        disabled={!editable}
                        label={t("unit_label")+"*"}
                        name={"unit"}
                        value={unit || ""}
                        error={unit === ""}
                        options={packUnitOptions}
                        onChange={handlePresentationChange}/>
                </Grid>
            </Grid>

            <Grid item>
                <Switch 
                    center
                    disabled={!editable}
                    labelTrue={capitalize(t("bulk"))}
                    labelFalse={capitalize(t("pack_label"))}
                    name="bulk"
                    value={Boolean(bulk)}
                    onChange={handlePresentationChange}/>
            </Grid>
        </Grid>
    );
};

export default PresentationInput;