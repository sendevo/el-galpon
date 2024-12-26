import ui from "./ui";
import home from "./home";
import itemList from "./itemsList";
import storesList from "./storesList";
import storeForm from "./storeForm";
import returns from "./returns";
import operations from "./operations";
import about from "./about";
import alerts from "./alerts";
import error from "./error";

import productsList from "./productsList";
import productForm from "./productForm";

import search from "./search";
import actionsBlock from "./actionsBlock";


// Use:
// import { useTranslation } from 'react-i18next';
// {t('')}

const dictionaries = {
    // Common
    ui,
    
    // Primary views
    home, 
    itemList,
    storesList, 
    storeForm,
    returns,
    operations,
    about, 
    alerts,
    error,

    // Secondary views
    productsList,
    productForm,

    // Components
    search,
    actionsBlock
};

const languages = ["es", "en"];

const translations = languages.reduce((acc, lang) => {
    acc[lang] = {};
    return acc;
}, {});

Object.keys(dictionaries).forEach(key => {
    languages.forEach(lang => {
        translations[lang][key] = dictionaries[key][lang];
    });
});

export default translations;