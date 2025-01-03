import { forwardRef, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { 
    Box, 
    Button,
    Typography
} from "@mui/material";
import moment from "moment";
import { useSearchParams } from "react-router-dom";


const containerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "85%",
    bgcolor: "background.paper",
    border: "1px solid #444",
    borderRadius: 1,
    boxShadow: 24,
    p: 2,
    maxHeight: "80%",
    overflowY: "auto"
  };


const ProductBlock = ({product, operation}) => {
    
    const { t } = useTranslation("operations");

    const presentation = product.presentations[product.presentation_index];

    const amountUnit = (operation === "RETURN_PACKS" || operation === "MOVE_PACKS") ? t("packs") : t(presentation.unit);

    return (
        <Box sx={{ml:1}}>
            <Typography><b>{t("product")}:</b> {product.name}</Typography>
            <Typography>
                <b>{t("amount")}:</b> {product.amount} {amountUnit}
            </Typography>
            <Typography>
                <b>{t("presentation")}:</b> {presentation.pack_size} {t(presentation.unit)} {presentation.bulk && "("+t("bulk")+")"}
            </Typography>
            {product.fromStoreName && operation !=="BUY" && 
                <Typography>
                    <b>{t("store_from")}:</b> {product.fromStoreName}
                </Typography>
            }
            {product.toStoreName && 
                <Typography>
                    <b>{t("store_to")}:</b> {product.toStoreName}
                </Typography>
            }
            {/*product.expirable && 
                <Typography>
                    <b>{t("expiration_date")}:</b> {moment(product.expiration).format("DD/MM/YYYY")}
                </Typography>
                
            }
            {Boolean(product.min_stock) && 
                <Typography>
                    <b>{t("stock_limit_alert")}:</b> {product.min_stock} {t(presentation.unit)}
                </Typography>
            */}
        </Box>
    );
}

const ModalContent = forwardRef(({products, onConfirm, onCancel}, ref) => {

    const [searchParams] = useSearchParams();
    const { t } = useTranslation("operations");

    const operation = searchParams.get("type");

    return (
        <Box sx={containerStyle} ref={ref} tabIndex="0">
            <Box>
                <Typography fontSize={"24px"}>
                    {t("details")}
                </Typography>
                <Typography>
                    <b>{t("operation")}:</b> {t(operation.toLowerCase())}
                </Typography>
                {
                    products.map((product, index) => (
                        <Fragment key={index}>  
                            {products.length > 1 && 
                                <Typography sx={{fontSize:"18px", mt:2}}>Producto {index+1}</Typography>}
                            <ProductBlock product={product} operation={operation}/>
                        </Fragment>
                    ))
                }
            </Box>

            <Box sx={{
                    display:"flex", 
                    justifyContent:"space-around",
                    mt: 2
                }}>
                <Button 
                    variant="contained"
                    color="success"
                    onClick={onConfirm}>
                    {t("confirm")}
                </Button>
                <Button 
                    variant="contained"
                    color="error"
                    onClick={onCancel}>
                    {t("cancel")}
                </Button>
            </Box>
        </Box>
    );
});


const OperationConfirmModal = forwardRef((props, ref) => (
    <ModalContent {...props} ref={ref} />
));


export default OperationConfirmModal;