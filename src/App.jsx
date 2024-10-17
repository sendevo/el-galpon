import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate
} from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import UIUtilsProvider from './context/UIFeedback';
import DatabaseProvider from "./context/Database";
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './model/translations.js';
import Home from "./views/Home";
import views from "./views";
import theme, { globalStyles } from "./themes";


i18next.use(initReactI18next).init({
    resources: translations,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
});

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles}/>
        <DatabaseProvider>
            <UIUtilsProvider>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home/>} />
                        {
                            views.map((v,k) => (
                                <Route key={k} path={v.path} element={v.component} />
                            ))        
                        }
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </Routes>
                </BrowserRouter>
            </UIUtilsProvider>
        </DatabaseProvider>
    </ThemeProvider>
);

export default App;
