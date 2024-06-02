import { Typography, Paper } from "@mui/material";
import { Input, Select } from "../../components/Inputs";
import { componentsStyles } from "../../themes";
import amountIcon from "../../assets/icons/productos.png";
import storeIcon from "../../assets/icons/barn.png"; 

const ProductBlock = ({
        product, 
        stores, 
        hideStore,
        onPropChange
    }) => (
    <Paper sx={{...componentsStyles.paper, mt:2}}>
        <Typography lineHeight={"2em"} paddingBottom={"15px"}><b>Producto: </b>{product.name}</Typography>
        <Input 
            icon={amountIcon}
            label="Cantidad*"
            type="number"
            value={product.amount || ""}
            error={product.name === ""}
            onChange={e => onPropChange("amount", e.target.value)}/>
        <Typography sx={{...componentsStyles.hintText, textAlign:"right", p:1}}>
            {product.amount ? `Cantidad total = ${product.pack_size*product.amount} ${product.pack_unit}` : ""}
        </Typography>
        {!hideStore && 
            <Select
                icon={storeIcon}
                label="Destino*"
                value={product.store || ""}
                error={product.store === ""}
                options={stores?.map(s => ({label: s.name, value: s.id}))}
                onChange={e => onPropChange("store", e.target.value)}/>
        }
    </Paper>
);

export default ProductBlock;