// Lista de categorias de productos (no editable por el usuario)
// Tener cuidado al modificar esta lista, el sistema debe asumir id de categoria incorrecto
const categories = [
    {
        id: 1, // El id es necesario por si se modifican categorias
        name: "Herramientas", // Nombre y detalles se pueden modificar siempre y cuando apunten a lo mismo
        desc: "Utensillos y herramientas de trabajo: palas, llaves, martillo, etc."
    },
    {
        id: 2,
        name: "Materiales de construcción",
        desc: "Materiales varios para infraestructura agrícola: galpones, silos, molinos, aguadas, etc."
    },
    {
        id: 3,
        name: "Semillas",
        desc: "Semillas para siembra de cultivos."
    },
    {
        id: 4,
        name: "Inoculantes",
        desc: "Productos formulados con microorganismos vivos para mejorar desarrollo y crecimiento de cultivos."
    },
    {
        id: 5,
        name: "Fertilizantes",
        desc: "Abonos y fertilizantes naturales o artificiales."
    },
    {
        id: 6,
        name: "Herbicidas",
        desc: "Agroquímicos para eliminación de malezas."
    },
    {
        id: 7,
        name: "Insecticidas",
        desc: "Agroquímicos para eliminación de plagas."
    },
    {
        id: 8,
        name: "Fungicidas",
        desc: "Agroquímicos para eliminación de hongos."
    },
    {
        id: 9,
        name: "Coadyuvantes",
        desc: "Aditivos para mejora de efectividad de productos o la modificación de sus propiedades para la aplicación."
    },
    {
        id: 10,
        name: "Nutrición animal",         
        desc: "Alimentos balanceados, piedras de sal, sustitutos lácteos, etc."
    },
    {
        id: 11,
        name: "Identificación animal",
        desc: "Caravanas, microchips, tags, lectores, etc."
    },
    {
        id: 12,
        name: "Insumos veterinarios",
        desc: "Vacunas, antiparasitarios, medicamentos varios, etc."
    }
];

export default categories;