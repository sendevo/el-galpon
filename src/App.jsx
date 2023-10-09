import * as Views from './views';
import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate 
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; 
import { CssBaseline, GlobalStyles } from '@mui/material';
import theme, { globalStyles } from './themes';

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles}/>
        <BrowserRouter>
            <Routes>
                <Route index element={<Views.Home/>} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
);

export default App;
