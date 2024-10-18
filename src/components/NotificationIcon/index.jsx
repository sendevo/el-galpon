import React from 'react';
import { Badge } from '@mui/material';
import notificationIcon from "../../assets/icons/notification.png";

const NotificationIcon = ({ unreadCount }) => (
    <Badge
        badgeContent={unreadCount}
        color="error"
        max={99}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}>
        <img src={notificationIcon} alt="Notifications" style={{ width: 30, height: 30 }} />
    </Badge>
);

export default NotificationIcon;