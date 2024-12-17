import React from "react";
import { TableCell } from "@mui/material";
import { componentsStyles } from "../../themes";

const HeaderCell = ({ onClick, attribute, sortedDirection }) => {
    const sortedArrow = sortedDirection ? (sortedDirection === "asc" ? "▲" : "▼") : "";
    return (
        <TableCell sx={componentsStyles.headerCell} onClick={onClick}>
            {attribute + sortedArrow}
        </TableCell>
    );
};

export default HeaderCell;