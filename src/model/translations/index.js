import home from "./views/home";
import itemList from "./views/itemsList";
import storesList from "./views/storesList";
import returns from "./views/returns";
import operations from "./views/operations";
import about from "./views/about";
import alerts from "./views/alerts";

import productsList from "./views/productsList";

import search from "./components/search";
import operationsBlock from "./components/operationsBlock";


// import { useTranslation } from 'react-i18next';
// {t('')}

const dictionaries = {
    // Primary views
    home, 
    itemList,
    storesList, 
    returns,
    operations,
    about, 
    alerts,

    // Secondary views
    productsList,

    // Components
    search,
    operationsBlock
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