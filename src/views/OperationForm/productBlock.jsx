import { Typography, Paper, Grid } from "@mui/material";
import { Input, Select } from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import { trimString } from "../../model/utils";
import amountIcon from "../../assets/icons/productos.png";
import storeIcon from "../../assets/icons/barn.png"; 

const prodNameTrim = 30;
const getProdUnit = product => product.pack_size===1 ? product.pack_unit : `(x ${product.pack_size} ${product.pack_unit})`;
const getStoreData = (stores, storeId) => stores.find(s => s.id === storeId);

const ProductBlock = ({
        product, 
        stores, 
        storeSelectionError,
        hideStoreInput,
        onPropChange
    }) => (
    <Paper sx={{...componentsStyles.paper, mt:1}}>
        <Grid container justifyContent="space-between" direction={"column"}>
            <Grid item xs={12}>
                <Typography lineHeight={"2em"} paddingBottom={"5px"}><b>Producto: </b>{trimString(product.name, prodNameTrim)}</Typography>
            </Grid>

            <Grid item xs={12}>
                <Input 
                    icon={amountIcon}
                    label="Cantidad*"
                    type="number"
                    value={product.amount > 0 ? product.amount : ""}
                    error={product.amount == ""}
                    unit={getProdUnit(product)}
                    onChange={e => onPropChange("amount", e.target.value)}/>
            </Grid>
            
            <Grid item xs={12}>
                <Typography sx={{...componentsStyles.hintText, textAlign:"right", mb:1}}>
                    {product.amount ? `Cantidad total = ${product.pack_size*product.amount} ${product.pack_unit}` : ""}
                </Typography>
            </Grid>

            {!hideStoreInput && 
                <Grid item xs={12}>
                    <Select
                        icon={storeIcon}
                        label="Destino*"
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
                        Ubicación actual: {getStoreData(stores,product.currentStoreId).name}
                    </Typography>
                </Grid>
            }
        </Grid>
    </Paper>
);

export default ProductBlock;