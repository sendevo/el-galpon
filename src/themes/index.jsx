import { createTheme } from "@mui/material/styles"; 

export const globalStyles = {
    a:{ textDecoration: "none", fontWeight: "bold" }
};

export const componentsStyles = {
    paper: {backgroundColor: 'rgba(255, 255, 255, 0.8)'},
    headerCell: {fontWeight: "bold",p: '2px 10px'},
    hintText: {
        fontStyle: "italic",
        fontSize: "12px",
        padding: "0px",
        margin: "0px",
        lineHeight: "1em"
    },
    tableCell: {
        padding: '2px 10px',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
};

export const viewsStyles = {
    about: {
        accordion: {backgroundColor: "rgba(255, 255, 255, 0.7)"},
        summary: {fontWeight: "bold"}
    },
    home: {
        title: {
            marginTop: "0px",
            marginBottom: "0px",
            lineHeight: "100%",
            color: "white",
            textShadow: "4px 4px 3px black",
            textTransform: "uppercase",
            fontWeight: "bold"
        },
        logo: {
            margin:"5px 5px 0px 5px",
            position: "absolute",
            padding: "0px", 
            height: "50px"
        },
        mainIcon: {
            textAlign: "center", 
            mb: 0, 
            mt:2
        },
        buttonsContainer: {marginTop:"5%"},
        button: {
            p: 2,
            lineHeight: "1em",
            width: "60vw",
            maxWidth: "400px",
            backgroundColor: "rgba(250,250,250,.5)",
            color: "#000000",
            fontWeight: "bold"
        },
        bottomBox: {
            backgroundColor: "#2D6F94",
            width: "100vw",
            height: "65px",
            m: 0,
            left: 0,
            bottom: 0,
            position: "fixed",
            verticalAlign: "middle",
            textAlign: "left"
        }
    }
};

const theme = createTheme({
    typography: {
        fontFamily: "Montserrat, Open Sans, sans-serif"
    },
    palette: {
        mode: "light",
        primary: {main: "#3477FF"},
        secondary: {main: "#71AEF8"},
        tertiary: {main: "#FFFFFF"},
        red: {main: "#FF0000"},
        text: {
            primary: "#000000", 
            secondary: "#555555",
            tertiary: "#3477FF",
            red: "#FFFFFF"
        }
    }
});

export default theme;