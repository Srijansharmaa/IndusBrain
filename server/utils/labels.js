export const ROLE_LABELS = {
    maint: "Maintenance Engineer",
    plant: "Plant Manager",
    safety: "Safety Officer",
    compliance: "Compliance Officer",
    quality: "Quality Engineer",
    admin: "Admin",
};

export const PLANT_LABELS = {
    "rel-jam": "Reliance – Jamnagar Refinery",
    "tata-jsr": "Tata Steel – Jamshedpur Works",
    "iocl-pan": "IOCL – Panipat Refinery",
    "ongc-mh": "ONGC – Mumbai High",
    "ntpc-vin": "NTPC – Vindhyachal STPS",
    "adani-mun": "Adani – Mundra Power",
};

export const roleLabel = (id) => ROLE_LABELS[id] || id;
export const plantLabel = (id) => PLANT_LABELS[id] || id;
