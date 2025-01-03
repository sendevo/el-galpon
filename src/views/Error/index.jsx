import { 
    Typography, 
    Button, 
    Box,
    TextField,
    Grid
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import useToast from "../../hooks/useToast";
import MainView from "../../components/MainView";
import image from "../../assets/working_monkey.jpg";

const messageStyle = {
    fontSize: "15px",
    color: "rgb(100,100,100)"
};

const errorBlockStyle = {
    justifyContent: "center", 
    display: "flex",
    gap: "20px",
    width: "100%",
    paddingTop: "20px",
};

const View = ({errorMessage, onReset, onReport}) => {

    const { t } = useTranslation('error');

    const toast = useToast();

    const handleReport = () => {
        toast(t("reported"), "success");
        onReport();
    };

    const handleReset = () => {
        toast(t("reseted"), "success");
        onReset();
    };

    return(
        <MainView title={t("title")}>
            <Typography sx={messageStyle} mb={2}>
                    {t("message1")}
            </Typography>
            <img src={image} style={{
                width: "100%",
                top: "50%",
                borderRadius: "10%"
            }}/>
            <Typography sx={messageStyle} mt={2}>
                    {t("message2")}
            </Typography>
            <Grid 
                container 
                direction={"row"}
                mt={3}
                mb={3}
                justifyContent={"space-evenly"}
                >
                <Grid item>
                    <Button 
                        onClick={handleReport}
                        variant={"contained"}
                        color={"primary"}>
                            {t("report")}
                    </Button>
                </Grid>
                <Grid item>
                    <Button 
                        onClick={handleReset}
                        variant={"contained"}
                        color={"primary"}>
                            {t("reset")}
                    </Button>
                </Grid>
            </Grid>
            <Box sx={errorBlockStyle}>
                <TextField
                    label={"Crash dump"}
                    sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#FF0000",
                        },
                    }}
                    value={errorMessage}
                    error
                    multiline
                    rows={15}
                    fullWidth
                    variant={"outlined"}
                    disabled
                    inputProps={{
                        style: {
                            fontFamily: "monospace",
                            fontSize: "13px"
                        }
                    }}
                />
            </Box>
        </MainView>
    );
};

export default View;