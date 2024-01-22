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
import Home from "./views/Home";
import views from "./views";
import theme, { globalStyles } from "./themes";


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
