import { useEffect } from "react";
import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate
} from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import useConfirm from "./hooks/useConfirm";
import { useDatabase } from "./context/Database";
import UIUtilsProvider from './context/UIFeedback';
import DatabaseProvider from "./context/Database";
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './model/translations';
import ErrorBoundary from './components/ErrorBoundary';
import Home from "./views/Home";
import views from "./views";
import theme, { globalStyles } from "./themes";


i18next.use(initReactI18next).init({
    resources: translations,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
});


const Core = () => {

    const db = useDatabase();

    console.log("app")

//    const confirm = useConfirm();
    useEffect(() => {
        db.query("items")
            .then(data => {
                console.log(data);
            });

        /*
        confirm(
            "Versión de prueba",
            "Está ejecutando una versión demostrativa, los datos son de prueba y se restablecerán al recargar la aplicación",
            () => {
                localStorage.clear();
            },
            () => {},
            "Aceptar",
            "" 
        );
        */
    }, []);

    return (
        <BrowserRouter>
            <ErrorBoundary>
                <Routes>
                    <Route index element={<Home/>} />
                    {
                        views.map((v,k) => (
                            <Route key={k} path={v.path} element={v.component} />
                        ))        
                    }
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles}/>
        <DatabaseProvider>
            <UIUtilsProvider>
                <Core />                
            </UIUtilsProvider>
        </DatabaseProvider>
    </ThemeProvider>
);

export default App;
