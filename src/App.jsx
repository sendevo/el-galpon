import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate
} from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import i18next from 'i18next';
import UIUtilsProvider from './context/UIFeedback';
import DatabaseProvider from "./context/Database";
import { initReactI18next } from 'react-i18next';
import ErrorBoundary from './components/ErrorBoundary';
import Home from "./views/Home";
import views from "./views";
import theme, { globalStyles } from "./themes";
import translations from './model/translations';


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
        <UIUtilsProvider>
            <DatabaseProvider>
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
            </DatabaseProvider>
        </UIUtilsProvider>
    </ThemeProvider>
);

export default App;
