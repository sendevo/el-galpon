import { useTranslation } from "react-i18next";
import { 
    Box, 
    Button,
    Typography 
} from "@mui/material";
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
  };

const ProductDetails = ({product}) => {
    return (
        <Box>
            <Typography>
                {product.name}
            </Typography>
        </Box>
    );
};

const ConfirmModal = ({products, onConfirm, onCancel}) => {

    const [searchParams] = useSearchParams();
    const { t } = useTranslation("operations");

    const operation = searchParams.get("type");

    console.log(products);

    return (
        <Box sx={containerStyle}>

            <Box>
                <Typography>
                    {t("confirm_operation")}: {t(operation.toLowerCase())}
                </Typography>
                {
                    products.map(product => (
                        <ProductDetails key={product.id} product={product} />
                    ))
                }
                <Typography>
                    ....
                </Typography>
            </Box>

            <Box sx={{display:"flex", justifyContent:"space-around"}}>
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
};

export default ConfirmModal;