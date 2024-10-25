import common from "./common";
import home from "./views/home";
import itemList from "./views/itemsList";
import productForm from "./views/productForm";
import storesList from "./views/storesList";
import storeForm from "./views/storeForm";
import returns from "./views/returns";
import operations from "./views/operations";
import productBlock from "./components/productBlock";
import about from "./views/about";
import alerts from "./views/alerts";

import productsList from "./views/productsList";

import search from "./components/search";
import operationsBlock from "./components/operationsBlock";


// import { useTranslation } from 'react-i18next';
// {t('')}

const dictionaries = {
    // Common
    common,

    // Primary views
    home, 
    itemList,
    storesList, 
    storeForm,
    returns,
    operations,
    about, 
    alerts,

    // Secondary views
    productsList,
    productForm,

    // Components
    search,
    operationsBlock,
    productBlock
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