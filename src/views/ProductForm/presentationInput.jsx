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

const PresentationInput = ({
    editable,
    packSize,
    packUnit,
    onChange
}) => {
    
    const { t } = useTranslation("productForm");

    const packUnitOptions = Object
                            .keys(UNITS[i18next.language])
                            .map(key => ({
                                label: UNITS[i18next.language][key].name,
                                value: key
                            }));

    const handleInputChange = event => {
        let {name, value} = event.target;
        if(name === "bulk"){
            name = "packSize";
            value = value ? -1:1;
        }
        onChange({target:{name, value}});
    };

    return(
        <Grid container direction={"column"}>
            <Grid 
                item
                container 
                direction={"row"} 
                spacing={1}>
                {packSize !== -1 && <Grid item xs={6}>
                        <Input 
                            disabled={!editable}
                            label={t("size")+"*"}
                            name={"packSize"}
                            type="number"
                            value={packSize || ""}
                            error={packSize === ""}
                            onChange={handleInputChange}/>
                    </Grid>}
                <Grid item xs={packSize !== -1 ? 6:12}>
                    <Select
                        disabled={!editable}
                        label={t("unit_label")+"*"}
                        name={"packUnit"}
                        value={packUnit || ""}
                        error={packUnit === ""}
                        options={packUnitOptions}
                        onChange={handleInputChange}/>
                </Grid>
            </Grid>

            <Grid item>
                <Switch 
                    center
                    disabled={!editable}
                    labelTrue={capitalize(t("bulk"))}
                    labelFalse={capitalize(t("pack_label"))}
                    name="bulk"
                    value={packSize === -1}
                    onChange={handleInputChange}/>
            </Grid>
        </Grid>
    );
};

export default PresentationInput;