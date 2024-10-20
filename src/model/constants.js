import moment from "moment";

// APP
export const APP_NAME = "El Galpón";
export const VERSION_CODE = "1";
export const VERSION_VALUE = "1.0.0";
export const BUILD_DATE = 1729202895351; // 17-10-2024 19:08 hs

// Debugging
export const DEBUG_MODE = true;
export const AVAILABLE_DEBUG_MODES = ["log", "error", "info", "warn", "table"];
if(DEBUG_MODE) console.log(`Debug mode on. Available functions: ${AVAILABLE_DEBUG_MODES.join(", ")}`);
export const ERROR_CODES = {
    NOT_IMPLEMENTED: 0,
    DB:{
        INVALID_TABLE: 1,
        WITH_ITEMS: 2,
        NOT_FOUND: 3,
        UNKNOWN_OPERATION: 4,
    }
};

// Operation definitions
export const OPERATION_TYPES = { // Inmutable (migrate DB if changed)
    BUY: 1,
    MOVE_STOCK: 2,
    SPEND: 3,
    MOVE_PACKS: 4,
    RETURN_PACKS: 5,
    UNDEFINED: 6
};
export const OPERATION_TYPES_NAMES = { // If change, update translations keywords
    BUY: "buy",
    MOVE_STOCK: "move_stock",
    SPEND: "spend",
    MOVE_PACKS: "move_packs",
    RETURN_PACKS: "return_packs",
    UNDEFINED: "undef"
};
export const validOperationType = type => Object.keys(OPERATION_TYPES).includes(type);

// Alert definitions
export const ALERT_TYPES = { // Inmutable (migrate DB if changed)
    STOCK: 1,
    EXPIRATION: 2,
    OTHER: 3
};

// Model related constants
export const UNITS = ["l", "ml", "m", "ton", "kg", "g", "u", "semillas"];
export const CATEGORIES = {
    es: ["Semillas", "Herbicidas", "Insecticidas", "Fungicidas",  "Inoculantes", "Coadyuvantes", "Fertilizantes", "Sanidad animal", "Nutrición animal", "Materiales de construcción", "Repuestos", "Combustible", "Herramientas", "Silobolsas", "Neumáticos", "Lubricantes", "Protección personal", "Otra"],
    en: ["Seeds", "Herbicides", "Pesticides", "Fungicides",  "Inoculants", "Adjuvants", "Fertilizers", "Animal health", "Animal nutrition", "Construction materials", "Spare parts", "Fuel", "Tools", "Silobags", "Tires", "Lubricants", "Personal protection", "Other"]
};

// Moment configuration for spanish
export const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTHS_SHORT = ["Ene.", "Feb.", "Mar", "Abr.", "May", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic."];
const WEEK_DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const WEEK_DAYS_SHORT = ["Dom.", "Lun.", "Mar.", "Miér.", "Jue.", "Vier.", "Sáb."];
const WEEK_DAYS_MIN = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
export const MOMENT_LOCALE_ES = {
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
moment.updateLocale('es', MOMENT_LOCALE_ES);
