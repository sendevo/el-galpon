import React from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';

const cardStyle = {
    background: "rgba(255,255,255,0.8)!important",
    boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.5)!important"
};

const contentStyle = {
    padding: "10px!important",
    height: "100%!important"
}

const GenericCard = ({sx, onClick, children}) => (
    <Card sx={{...cardStyle, ...sx}} onClick={onClick}>
        <CardContent sx={contentStyle}>
            {children}
        </CardContent>
    </Card>
);

export default GenericCard;