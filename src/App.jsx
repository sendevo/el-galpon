import { useEffect, useState } from "react";
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
import ErrorBoundary from './components/ErrorBoundary';
import Home from "./views/Home";
import views from "./views";
import theme, { globalStyles } from "./themes";
import { EXPIRATION_LIMIT_DAYS, ALERT_TYPES } from "./model/constants";
import { DB_TEST_MODE } from "./model/DB";
import translations from './model/translations';


i18next.use(initReactI18next).init({
    resources: translations,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
});

const searchForAlerts = items => {
    const now = Date.now();
    const lowStockItems = items.filter(i => i.stock < i.min_stock);
    const expiredItems = items.filter(i => {
        const ed = moment(i.expiration_date);
        return ed.diff(now, "days") < 0;
    });
    const nearExpirationItems = items.filter(i => {
        const ed = moment(i.expiration_date);
        const days = ed.diff(now, "days");
        return days < EXPIRATION_LIMIT_DAYS;
    });
    return { // Values of attributes of ALERT_TYPES may be numbers, but this should work anyway
        [ALERT_TYPES.LOW_STOCK]: lowStockItems, 
        [ALERT_TYPES.EXPIRED]: expiredItems, 
        [ALERT_TYPES.NEAR_EXPIRATION]: nearExpirationItems 
    };
};


const AppCore = () => {

    const db = useDatabase();
    const confirm = useConfirm();
    const [dbReady, setDBReady] = useState(!DB_TEST_MODE);

    useEffect(() => {
        if (DB_TEST_MODE) {    
            confirm(
                "Versión de prueba",
                "Está ejecutando una versión demostrativa, los datos son de prueba y se restablecerán al recargar la aplicación",
                () => {
                    db.loadTestData()
                        .then(() => setDBReady(true))
                        .catch(console.error);
                },
                () => {},
                "Aceptar",
                "" 
            );
        }else{
            db.query("items")
                .then(items => {
                    const toCheckItems = searchForAlerts(items);
                    const newAlerts = [];
                    const now = Date.now();
                    db.query("alerts")
                        .then(alerts => { // For each alert in db, check if the item in stock still has the alert
                            Object.keys(toCheckItems).forEach(k => { // k = LOW_STOCK, EXPIRED, NEAR_EXPIRATION
                                toCheckItems[k].forEach(i => { // i = item to search in the list of alerts
                                    if (!alerts.find(a => a.item_id === i.id && a.alert_type === ALERT_TYPES[k])) {
                                        newAlerts.push({
                                            alert_type: ALERT_TYPES[k],
                                            message: "", // TODO: Add message. for example `El producto ${i.productData.name} tiene poco stock`
                                            item_id: i.id,
                                            timestamp: now,
                                            seen: false
                                        });
                                    }
                                });
                            });
                            console.log("New alerts", newAlerts);
                        });
                });
        }
    }, []);

    return (
        dbReady &&
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
                <AppCore />                
            </UIUtilsProvider>
        </DatabaseProvider>
    </ThemeProvider>
);

export default App;
