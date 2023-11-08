import{ useState } from 'react';
import { TextField, InputAdornment, Button } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import classes from '../style.module.css';

const SearchInput = ({submit, onChange}) => {

    const [value, setValue] = useState("");

    const handleValueChange = e => {
        setValue(e.target.value);
        if(typeof(onChange) === "function")
            onChange(e.target.value);
    };

    return (
        <TextField
            variant="outlined"
            size="small" 
            className={classes.Input}
            type="text"
            label="Buscar"
            value={value}
            onChange={handleValueChange}                
            InputProps={{
                endAdornment:<InputAdornment position="end">
                    <Button 
                        variant="text" 
                        sx={{minWidth: 0, m:0}}
                        onClick={()=>submit(value)}>
                        <FaSearch/>
                    </Button>
                </InputAdornment>
            }}/>  
    );
};

export default SearchInput;