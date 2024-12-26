// APP
export const APP_NAME = "El Galpón";
export const VERSION_CODE = "1";
export const VERSION_VALUE = "1.0.0";
export const BUILD_DATE = 1729202895351; // 17-10-2024 19:08 hs

// Debugging

export const ERROR_CODES = {
    NOT_IMPLEMENTED: 0,
    DB: {
        UNKNOWN_OPERATION: 1,
        INVALID_TABLE: 2,
        WITH_ITEMS: 3,
        NOT_FOUND: 4
    }
};

// Operation definitions
export const OPERATION_TYPES = { // Inmutable (migrate DB if changed)
    UNDEFINED: 1,
    BUY: 2,
    MOVE_STOCK: 3,
    SPEND: 4,
    MOVE_PACKS: 5,
    RETURN_PACKS: 6
};

export const OPERATION_TYPES_NAMES = { // Example of use: OPERATION_TYPES_NAMES[OPERATION_TYPES.BUY]
    UNDEFINED: "undef",
    BUY: "buy",
    MOVE_STOCK: "move_stock",
    SPEND: "spend",
    MOVE_PACKS: "move_packs",
    RETURN_PACKS: "return_packs"
};
export const validOperationType = type => Object.keys(OPERATION_TYPES).includes(type);

// Alert definitions
export const ALERT_TYPES = { // Inmutable (migrate DB if changed)
    OTHER: 1,
    LOW_STOCK: 2,
    EXPIRED: 3,
    NEAR_EXPIRATION: 4
};
export const EXPIRATION_LIMIT_DAYS = 15;

// Moment configuration for spanish
export const YEAR = 1000 * 60 * 60 * 24 * 365;
export const MONTH = 1000 * 60 * 60 * 24 * 30;
export const DAY = 1000 * 60 * 60 * 24;

export const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTHS_SHORT = ["Ene.", "Feb.", "Mar", "Abr.", "May", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic."];
const WEEK_DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const WEEK_DAYS_SHORT = ["Dom.", "Lun.", "Mar.", "Miér.", "Jue.", "Vier.", "Sáb."];
const WEEK_DAYS_MIN = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
export const MOMENT_LOCALE = {
    es: {
        months: MONTHS,
        monthsShort: MONTHS_SHORT,
        weekdays: WEEK_DAYS,
        weekdaysShort: WEEK_DAYS_SHORT,
        weekdaysMin: WEEK_DAYS_MIN,
        relativeTime: {
            future: 'dentro de %s',
            past: 'hace %s',
            s: 'segundos',
            m: 'un minuto',
            mm: '%d minutos',
            h: 'una hora',
            hh: '%d horas',
            d: 'un día',
            dd: '%d días',
            M: 'un mes',
            MM: '%d meses',
            y: 'un año',
            yy: '%d años'
        }
    },
    en: {
        months: MONTHS,
        monthsShort: MONTHS_SHORT,
        weekdays: WEEK_DAYS,
        weekdaysShort: WEEK_DAYS_SHORT,
        weekdaysMin: WEEK_DAYS_MIN,
        relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        }
    }
};

export const CATEGORIES = {
    es: ["Semillas", "Herbicidas", "Insecticidas", "Fungicidas", "Inoculantes", "Coadyuvantes", "Fertilizantes", "Sanidad animal", "Nutrición animal", "Materiales de construcción", "Alambrados", "Mangas", "Tranqueras", "Repuestos", "Combustible", "Herramientas", "Silobolsas", "Neumáticos", "Lubricantes", "Protección personal", "Otra"],
    en: ["Seeds", "Herbicides", "Pesticides", "Fungicides", "Inoculants", "Adjuvants", "Fertilizers", "Animal health", "Animal nutrition", "Construction materials", "Wired fences", "Cattle chute", "Gates", "Spare parts", "Fuel", "Tools", "Silobags", "Tires", "Lubricants", "Personal protection", "Other"]
};

// DB product units
export const UNITS = {
    es: {
        unit: {
            name: "Unidad",
            abbr: "u"
        },
        kilogram: {
            name: "Kilogramo/s",
            abbr: "kg"
        },
        liter: {
            name: "Litro/s",
            abbr: "l"
        },
        milimeter: {
            name: "Mililitro/s",
            abbr: "ml"
        },
        gram: {
            name: "Gramo/s",
            abbr: "g"
        },
        ton: {
            name: "Tonelada/s",
            abbr: "tn"
        },
        meter: {
            name: "Metro/s",
            abbr: "m"
        },
        pack: {
            name: "Paquete/s",
            abbr: "paq"
        },
        box: {
            name: "Caja/s",
            abbr: "caja/s"
        },
        bag: {
            name: "Bolsa/s",
            abbr: "bolsa/s"
        },
        bottle: {
            name: "Botella/s",
            abbr: "bot"
        },
        can: {
            name: "Lata/s",
            abbr: "lata/s"
        },
        drum: {
            name: "Tambor",
            abbr: "tambor"
        },
        pallet: {
            name: "Pallet/s",
            abbr: "pallet/s"
        },
        seeds: {
            name: "Semilla/s",
            abbr: "sem"
        },
        other: {
            name: "Otro/s",
            abbr: "otro/s"
        }
    },
    en: {
        bulk: {
            name: "Bulk",
            abbr: "bulk"
        },
        unit: {
            name: "Unit",
            abbr: "u"
        },
        kilogram: {
            name: "Kilogram",
            abbr: "kg"
        },
        liter: {
            name: "Liter",
            abbr: "l"
        },
        milimeter: {
            name: "Mililiter",
            abbr: "ml"
        },
        gram: {
            name: "Gram",
            abbr: "g"
        },
        ton: {
            name: "Ton",
            abbr: "tn"
        },
        meter: {
            name: "Meter",
            abbr: "m"
        },
        pack: {
            name: "Pack",
            abbr: "pack"
        },
        box: {
            name: "Box",
            abbr: "box"
        },
        bag: {
            name: "Bag",
            abbr: "bag"
        },
        bottle: {
            name: "Bottle",
            abbr: "bot"
        },
        can: {
            name: "Can",
            abbr: "can"
        },
        drum: {
            name: "Drum",
            abbr: "drum"
        },
        pallet: {
            name: "Pallet",
            abbr: "pallet"
        },
        seed: {
            name: "Seed",
            abbr: "seed"
        },
        other: {
            name: "Other",
            abbr: "other"
        }
    }
};

const getUnits = (lang, key) => { // Spread the units for the selected language
    const units = UNITS[lang];
    const unitNames = Object.keys(units).reduce((acc, index) => {
        acc[index] = units[index][key];
        return acc;
    }, {});
    return unitNames;
};

export const UNITS_ABBRS = {
    es: getUnits("es", "abbr"),
    en: getUnits("en", "abbr")
};

export const UNITS_NAMES = {
    es: getUnits("es", "name"),
    en: getUnits("en", "name")
}