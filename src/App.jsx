import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate
} from 'react-router-dom';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'; 
import DatabaseProvider from './context/Database';
import * as Views from './views';
import theme, { globalStyles } from './themes';


const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles}/>
        <DatabaseProvider>
            <BrowserRouter>
                <Routes location={location}>
                    <Route index element={<Views.Home/>} />
                    <Route path='/product-list' element={<Views.ProductList/>}/>
                    <Route path='/product-form' element={<Views.ProductForm/>}/>
                    <Route path='/operations' element={<Views.Operations/>}/>
                    <Route path='/about' element={<Views.About/>}/>
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
            </BrowserRouter>
        </DatabaseProvider>
    </ThemeProvider>
);

export default App;
