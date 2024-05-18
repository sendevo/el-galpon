import moment from "moment";

// APP
export const DEBUG_MODE = true;
export const AVAILABLE_DEBUG_MODES = ["log", "error", "info", "warn", "table"];
export const APP_NAME = "El Galpón";
export const VERSION_CODE = "1";
export const VERSION_VALUE = "1.0.0";
export const BUILD_DATE = 1696264323611; // 2-10-2023 13:32 hs

// Database
export const DB_NAME = "elgalponDB";
export const DB_VERSION = 1;
export const OPERATION_TYPES = {
    BUY: 1,
    MOVE_STOCK: 2,
    SPEND: 3,
    MOVE_PACKS: 4,
    RETURN_PACKS: 5,
    UNDEFINED: 6
};

// Model
export const UNITS = ["l", "ml", "m", "ton", "kg", "g", "u", "semillas"];
export const CATEGORIES = ["Semillas", "Herbicidas", "Insecticidas", "Fungicidas",  "Inoculantes", "Coadyuvantes", "Fertilizantes", "Sanidad animal", "Nutrición animal", "Materiales de construcción", "Repuestos", "Combustible", "Herramientas", "Silobolsas", "Neumáticos", "Lubricantes", "Protección personal", "Otra"];

// Moment
export const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTHS_SHORT = ["Ene.", "Feb.", "Mar", "Abr.", "May", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic."];
const WEEK_DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const WEEK_DAYS_SHORT = ["Dom.", "Lun.", "Mar.", "Miér.", "Jue.", "Vier.", "Sáb."];
const WEEK_DAYS_MIN = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
export const MOMENT_LOCALE_CONFIG = {
    months: MONTHS,
    monthsShort: MONTHS_SHORT,
    weekdays: WEEK_DAYS,
    weekdaysShort: WEEK_DAYS_SHORT,
    weekdaysMin: WEEK_DAYS_MIN,
    relativeTime : {
        future : 'dentro de %s',
        past : 'hace %s',
        s : 'segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'una hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un año',
        yy : '%d años'
    }
};
moment.updateLocale('es', MOMENT_LOCALE_CONFIG);


if(DEBUG_MODE) console.log(`Debug mode on. Available functions: ${AVAILABLE_DEBUG_MODES.join(", ")}`);
