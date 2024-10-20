import React from 'react';
import { 
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Backdrop
} from '@mui/material';

const ContextMenu = ({anchorEl, onClose, options}) => (
    <React.Fragment>
        <Backdrop
            sx={{ backdropFilter: "blur(1px)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={Boolean(anchorEl)}
            onClick={onClose}>
        </Backdrop>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
            {options.map((option, index) => (
                <MenuItem 
                    key={index}
                    dense 
                    onClick={e => {option.onClick(); onClose();}}>
                    <ListItemIcon>
                        {option.icon}
                    </ListItemIcon>
                    <ListItemText>
                        {option.text}
                    </ListItemText>
                </MenuItem>
            ))
            }
        </Menu>
    </React.Fragment>
);

export default ContextMenu;