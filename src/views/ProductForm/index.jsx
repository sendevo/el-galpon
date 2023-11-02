import { useState } from "react";
import { 
    Button, 
    Grid,
    Typography 
} from "@mui/material";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import { 
    Input,
    SuggesterInput
} from "../../components/Inputs";
import { FaTractor } from "react-icons/fa";
import background from "../../assets/backgrounds/background1.jpg";

const categories = [
    {
        label:"Herbicidas",
        key: 0
    }, 
    {
        label: "Fertilizantes",
        key: 1
    }
];

const View = () => {

    const db = useDatabase();   
    const [formData, setFormData] = useState({});

    const handleSubmit = () => {
        db.addItem(formData,'products')
            .then(()=>console.log("Data pushed to db"))
            .catch(console.error);
    };

    const handleInputChange = event => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return(
        <MainView title={"Edición de producto"} background={background}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Input 
                        label={"Nombre"}
                        name="name"
                        type="text"
                        value={formData.name || ""}
                        error={formData.name === ""}
                        onChange={handleInputChange}/>
                </Grid>
                <Grid item xs={12}>
                    <SuggesterInput 
                        multiple
                        type="text"                                
                        label="Categorías"
                        name="categories"
                        value={formData.categories || []}
                        onChange={handleInputChange}
                        options={categories}
                        icon={<FaTractor color={"green"} size={20}/>}
                        rIcon={true}/>
                </Grid>
            </Grid>     
        </MainView>
    );
};

export default View;