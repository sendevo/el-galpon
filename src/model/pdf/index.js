
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import pdfMake from "pdfmake";
import styles from './pdfstyle.json';
import appLogo from '../../assets/b64_logo.json';

//pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : globalThis.pdfMake.vfs;


const exportPDF = () => {
    return new Promise((resolve, reject) => {

        const pageMargins = [ 20, 30, 20, 60 ];

        const header = {
            image: appLogo.data,
            width: 50,
            margin: [5,5,5,5],
            alignment: "right"
        };
        
        const footer = {
            stack: [
                {
                    text: "Aplicación El Galpón", 
                    style: "boldText", 
                    link: "https://play.google.com/store/apps/details?id=com.inta.elgalpon"
                },
                {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 560, y2: 0, lineWidth: 2 } ]},
                {text: [
                    {text:"Instituto Nacional de Tecnología Agropecuaria | ", style: "text"}, 
                    {text:"Estación Experimental Agropecuaria Hilario Ascasubi"}
                ]}
            ],
            margin: [10,10,10,10],
            alignment: "left"
        };


        const content = [
            {
                text: "",
                style: "subheader"
            }
        ];

        const document = {
            header,
            footer,
            content,
            styles,
            pageMargins
        };

        try{
            const pdfFile = pdfMake.createPdf(document);
            resolve(pdfFile);
        }catch(err){ 
            reject(err);
        }
    });
};

export default exportPDF;