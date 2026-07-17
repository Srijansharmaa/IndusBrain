export const PLANTS = [
  { id: "rel-jam", label: "Reliance \u2013 Jamnagar Refinery", loc: "Gujarat" },
  { id: "tata-jsr", label: "Tata Steel \u2013 Jamshedpur Works", loc: "Jharkhand" },
  { id: "iocl-pan", label: "IOCL \u2013 Panipat Refinery", loc: "Haryana" },
  { id: "ongc-mh", label: "ONGC \u2013 Mumbai High", loc: "Offshore, Maharashtra" },
  { id: "ntpc-vin", label: "NTPC \u2013 Vindhyachal STPS", loc: "Madhya Pradesh" },
  { id: "adani-mun", label: "Adani \u2013 Mundra Power", loc: "Gujarat" },
];

export const getPlantById = (id) => PLANTS.find((plant) => plant.id === id);
