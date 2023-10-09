import { useNavigate } from "react-router-dom";
import { Container } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import classes from './style.module.css';

const MainView = ({title, background, children}) => {
    
    const navigate = useNavigate();        
    const onGoBack = () => navigate(-1);

    return (
        <>
            <div className={classes.Background} 
                style={{background:`linear-gradient(rgba(255,255,255,0.9),rgba(255,255,255,0.5)),url(${background})`}}>
            </div>
            <Container className={classes.Container}>
                {title && 
                    <h3 className={classes.Title}>
                        <span 
                            className={classes.BackButton}
                            title="Volver"
                            onClick={onGoBack}>
                            <FaArrowLeft />
                        </span>
                        {title}
                    </h3>
                }
                {children}            
            </Container>
        </>
    );
};

export default MainView;