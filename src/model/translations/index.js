import home from "./views/home";
import itemList from "./views/itemsList";
import storesList from "./views/storesList";
import storeForm from "./views/storeForm";
import returns from "./views/returns";
import operations from "./views/operations";
import about from "./views/about";
import alerts from "./views/alerts";
import error from "./views/error";

import productsList from "./views/productsList";
import productForm from "./views/productForm";

import search from "./components/search";
import actionsBlock from "./components/actionsBlock";


// Use:
// import { useTranslation } from 'react-i18next';
// {t('')}

const dictionaries = {
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