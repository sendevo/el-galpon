import { useEffect } from "react";
import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate
} from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import i18next from 'i18next';
import moment from "moment";
import useConfirm from "./hooks/useConfirm";
import { useDatabase } from "./context/Database";
import UIUtilsProvider from './context/UIFeedback';
import DatabaseProvider from "./context/Database";
import { initReactI18next } from 'react-i18next';
import translations from './model/translations';
import ErrorBoundary from './components/ErrorBoundary';
import Home from "./views/Home";
import views from "./views";
import theme, { globalStyles } from "./themes";
import { EXPIRATION_LIMIT_DAYS, ALERT_TYPES } from "./model/constants";


i18next.use(initReactI18next).init({
    resources: translations,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
});


const Core = () => {

    const db = useDatabase();

//    const confirm = useConfirm();
    useEffect(() => {
        db.query("items")
            .then(items => {

                // Search for items with low stock
                const lowStockItems = items.filter(i => i.stock < i.min_stock);

                const now = Date.now();

                // Search for items with expired date
                const expiredItems = items.filter(i => {
                    const ed = moment(i.expiration_date);
                    return ed.diff(now, "days") < 0;
                });

                // Search for items with near expiration date
                const nearExpirationItems = items.filter(i => {
                    const ed = moment(i.expiration_date);
                    const days = ed.diff(now, "days");
                    return days < EXPIRATION_LIMIT_DAYS;
                });
                
                db.query("alerts")
                    .then(alerts => {
                        const newAlerts = [];
                        lowStockItems.forEach(i => {
                            if (!alerts.find(a => a.item_id === i.id && a.type === "low_stock")) {
                                newAlerts.push({
                                    type: ALERT_TYPES.LOW_STOCK,
                                    message: `El producto ${i.productData.name} tiene poco stock`,
                                    item_id: i.id,
                                    timestamp: now,
                                    seen: false
                                });
                            }
                        });

                        expiredItems.forEach(i => {
                            if (!alerts.find(a => a.item_id === i.id && a.type === "expired")) {
                                newAlerts.push({
                                    type: ALERT_TYPES.EXPIRED,
                                    message: `El producto ${i.productData.name} ha expirado`,
                                    item_id: i.id,
                                    timestamp: now,
                                    seen: false
                                });
                            }
                        });

                        nearExpirationItems.forEach(i => {
                            if (!alerts.find(a => a.item_id === i.id && a.type === "near_expiration")) {
                                newAlerts.push({
                                    type: ALERT_TYPES.NEAR_EXPIRATION,
                                    message: `El producto ${i.productData.name} está por vencer`,
                                    item_id: i.id,
                                    timestamp: now,
                                    seen: false
                                });
                            }
                        });

                        console.log(newAlerts);
                    })
                    .catch(console.error);
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
