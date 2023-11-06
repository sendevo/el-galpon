import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography } from '@mui/material';
import moment from "moment";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import { debug } from "../../model/utils";
import { FaCheck, FaTimes } from "react-icons/fa";
import background from "../../assets/backgrounds/background1.jpg";



const testData = [ // TODO: remove this data
    {
        id: 34,
        name: "Glifosato",
        pack_size: 20,
        pack_unit: "l",
        expirable: true,
        returnable: true,
        brand: "Estrella",
        comments: "",
        categories: [{label: "Herbicidas", key:0}],
        created: moment("02/09/2023", "DD/MM/YYYY").unix()*1000,
        modified: moment("02/09/2023", "DD/MM/YYYY").unix()*1000
    },
    {
        id: 35,
        name: "Urea granulada",
        pack_size: 1,
        pack_unit: "ton",
        expirable: true,
        returnable: false,
        brand: "Profertil",
        comments: "",
        categories: [{label: "Fertilizantes", key:5}],
        created: moment("02/09/2023", "DD/MM/YYYY").unix()*1000,
        modified: moment("02/09/2023", "DD/MM/YYYY").unix()*1000
    },
    {
        id: 38,
        name: "Trigo",
        pack_size: 25,
        pack_unit: "kg",
        expirable: true,
        returnable: false,
        brand: "ACA 304",
        comments: "Cosecha 2021",
        categories: [{label: "Semillas", key:2}],
        created: moment("02/09/2023", "DD/MM/YYYY").unix()*1000,
        modified: moment("02/09/2023", "DD/MM/YYYY").unix()*1000
    }
];

const paperStyle = {backgroundColor: 'rgba(255, 255, 255, 0.8)'};

const headerCellStyle = {
    fontWeight: "bold",
    p: '2px 10px'
};

const tableCellStyle = {
    p: '2px 10px'
};

const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    
    useEffect(() => {
        db.getAllItems('products')
            //.then(setData)
            .then(res => { // TODO: remove this then()
                const d = [...testData, ...res];
                //console.table(d);
                setData(d);
            })
            .catch(console.error);
    }, []);

    const handleSelect = (productId, checked) => {
        const selectedIndex = selected.indexOf(productId);
        const newSelected = [...selected];
        if (selectedIndex === -1)
            newSelected.push(productId);
        else
            newSelected.splice(selectedIndex, 1);
        setSelected(newSelected);
    };

    const handleSelectAll = selected => {
        if(selected)
            setSelected(data.map(d => d.id));
        else 
            setSelected([]);
    };

    const handleNew = () => navigate("/product-form");

    const handleEdit = () => {
        if(selected.length === 1){
            const productId = selected[0];
            navigate(`/product-form?id=${productId}`);
        }else{
            debug("Multpiple selection for edit", "error");
            setSelected([]);
        }
    };

    const handleDelete = () => {
        // TODO: confirm modal && feedback
        const job = [];
        selected.map(productId => {
            job.push(db.deleteItem(productId, "products"));
            Promise.all(job)
                .then(console.log)
                .catch(console.error);
        });
    };

    return(
        <MainView title={"Productos"} background={background}>
            <TableContainer component={Paper} sx={paperStyle}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerCellStyle}>
                                <Checkbox 
                                    checked={selected.length === data.length} 
                                    onChange={e => handleSelectAll(e.target.checked)} />
                            </TableCell>
                            <TableCell sx={headerCellStyle}>Nombre</TableCell>
                            <TableCell sx={headerCellStyle}>Capacidad</TableCell>
                            <TableCell sx={headerCellStyle}>Unidad</TableCell>
                            <TableCell sx={headerCellStyle}>Expirable</TableCell>
                            <TableCell sx={headerCellStyle}>Retornable</TableCell>
                            <TableCell sx={headerCellStyle}>Marca/Fabricante</TableCell>
                            <TableCell sx={headerCellStyle}>Comentarios</TableCell>
                            <TableCell sx={headerCellStyle}>Categorías</TableCell>
                            <TableCell sx={headerCellStyle}>Creado</TableCell>
                            <TableCell sx={headerCellStyle}>Modificado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map(product => (
                        <TableRow key={product.id}>
                            <TableCell sx={tableCellStyle}>
                                <Checkbox 
                                    checked={selected.indexOf(product.id) !== -1} 
                                    onChange={e => handleSelect(product.id, e.target.checked)} />
                            </TableCell>
                            <TableCell sx={tableCellStyle}>{product.name || "Sin nombre"}</TableCell>
                            <TableCell sx={tableCellStyle}>{product.pack_size}</TableCell>
                            <TableCell sx={tableCellStyle}>{product.pack_unit}</TableCell>
                            <TableCell sx={tableCellStyle}>{product.expirable ? <FaCheck color="green"/> : <FaTimes color="red"/>}</TableCell>
                            <TableCell sx={tableCellStyle}>{product.returnable ? <FaCheck color="green"/> : <FaTimes color="red"/>}</TableCell>
                            <TableCell sx={tableCellStyle}>{product.brand || "-"}</TableCell>
                            <TableCell sx={tableCellStyle}>{product.comments || "-"}</TableCell>
                            <TableCell sx={tableCellStyle}>{product.categories?.map(c => c.label).join(', ') || "-"}</TableCell>
                            <TableCell sx={tableCellStyle}>{moment(product.created).format("DD/MM/YYYY")}</TableCell>
                            <TableCell sx={tableCellStyle}>{moment(product.modified).format("DD/MM/YYYY")}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paper sx={{...paperStyle, p:1, mt:2}}>
                <Grid container sx={{mb:1}}>
                    <Typography sx={{fontWeight:"bold"}}>Acciones</Typography>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={4} display={"flex"} justifyContent={"center"}>
                        <Button 
                            variant="contained"
                            onClick={handleNew}>
                            Nuevo
                        </Button>
                    </Grid>
                    <Grid item xs={4} display={"flex"} justifyContent={"center"}>
                        <Button 
                            variant="contained"
                            disabled={selected.length !== 1}
                            onClick={handleEdit}>
                            Editar        
                        </Button>
                    </Grid>
                    <Grid item xs={4} display={"flex"} justifyContent={"center"}>
                        <Button     
                            variant="contained"
                            disabled={selected.length === 0}
                            onClick={handleDelete}>
                            Borrar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </MainView>
    );
};

export default View;