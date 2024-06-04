import { Typography, Paper } from "@mui/material";
import { Input, Select } from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import { trimString } from "../../model/utils";
import amountIcon from "../../assets/icons/productos.png";
import storeIcon from "../../assets/icons/barn.png"; 

const prodNameTrim = 30;
const getProdUnit = product => product.pack_size===1 ? product.pack_unit : `(x ${product.pack_size} ${product.pack_unit})`;

const ProductBlock = ({
        product, 
        stores, 
        hideStore,
        onPropChange
    }) => (
    <Paper sx={{...componentsStyles.paper, mt:2}}>
        <Typography lineHeight={"2em"} paddingBottom={"15px"}><b>Producto: </b>{trimString(product.name, prodNameTrim)}</Typography>
        <Input 
            icon={amountIcon}
            label="Cantidad*"
            type="number"
            value={product.amount || ""}
            error={product.amount == ""}
            unit={getProdUnit(product)}
            onChange={e => onPropChange("amount", e.target.value)}/>
        <Typography sx={{...componentsStyles.hintText, textAlign:"right", p:1}}>
            {product.amount ? `Cantidad total = ${product.pack_size*product.amount} ${product.pack_unit}` : ""}
        </Typography>
        {!hideStore && 
            <Select
                icon={storeIcon}
                label="Destino*"
                value={product.store_id || ""}
                error={product.store_id === ""}
                options={stores?.map(s => ({label: s.name, value: s.id}))}
                onChange={e => onPropChange("store_id", e.target.value)}/>
        }
    </Paper>
);

export default ProductBlock;