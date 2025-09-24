import { Word } from "../../../shared/types";

export const sampleWords: Word[] = [
  {
    id: "1",
    word: "băiat",
    definition: "Tânăr de sex masculin, copil sau adolescent.",
    shortDescription: "Tânăr de sex masculin",
    category: "Persoane",
    origin: "Română",
    examples: ["Băiatul merge la școală.", "E un băiat bun."],
    pronunciation: "bă-iat",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    word: "casă",
    definition: "Clădire destinată locuinței unei familii sau a unei persoane.",
    shortDescription: "Clădire pentru locuit",
    category: "Locuințe",
    origin: "Română",
    examples: ["Casa noastră este mare.", "Să mergem acasă."],
    pronunciation: "ca-să",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    word: "mamă",
    definition: "Femeie care a născut un copil sau care îl crește.",
    shortDescription: "Femeie care a născut un copil",
    category: "Familie",
    origin: "Română",
    examples: ["Mama gătește mâncare.", "Îmi iubesc mama."],
    pronunciation: "ma-mă",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    word: "tată",
    definition: "Bărbat care a conceput un copil sau care îl crește.",
    shortDescription: "Bărbat care a conceput un copil",
    category: "Familie",
    origin: "Română",
    examples: ["Tata lucrează mult.", "Tatăl meu este doctor."],
    pronunciation: "ta-tă",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    word: "apă",
    definition:
      "Lichid incolor, inodor și insipid, compus din hidrogen și oxigen.",
    shortDescription: "Lichid incolor și inodor",
    category: "Natură",
    origin: "Română",
    examples: ["Bea apă sănătoasă.", "Apa este rece."],
    pronunciation: "a-pă",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    word: "mâncare",
    definition: "Alimente preparate pentru consum.",
    shortDescription: "Alimente preparate",
    category: "Alimentație",
    origin: "Română",
    examples: ["Mâncarea este gata.", "Ce mâncare bună!"],
    pronunciation: "mân-ca-re",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "7",
    word: "școală",
    definition: "Instituție de învățământ unde se predă știința.",
    shortDescription: "Instituție de învățământ",
    category: "Educație",
    origin: "Română",
    examples: ["Merg la școală zilnic.", "Școala este mare."],
    pronunciation: "școa-lă",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "8",
    word: "prieten",
    definition: "Persoană cu care cineva are relații de prietenie.",
    shortDescription: "Persoană cu relații de prietenie",
    category: "Relații",
    origin: "Română",
    examples: ["El este prietenul meu.", "Am mulți prieteni."],
    pronunciation: "pri-e-ten",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "9",
    word: "munte",
    definition: "Ridicătură naturală foarte înaltă a scoarței terestre.",
    shortDescription: "Ridicătură înaltă a terenului",
    category: "Geografie",
    origin: "Română",
    examples: ["Muntele este înalt.", "Urc pe munte."],
    pronunciation: "mun-te",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "10",
    word: "mare",
    definition: "Suprafață mare de apă sărată care înconjoară continentele.",
    shortDescription: "Suprafață mare de apă sărată",
    category: "Geografie",
    origin: "Română",
    examples: ["Marea este albastră.", "Merg la mare vara."],
    pronunciation: "ma-re",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const getWords = (): Word[] => {
  return sampleWords;
};

export const getWordById = (id: string): Word | undefined => {
  return sampleWords.find((word) => word.id === id);
};

export const searchWords = (query: string): Word[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleWords.filter(
    (word) =>
      word.word.toLowerCase().includes(lowercaseQuery) ||
      word.definition.toLowerCase().includes(lowercaseQuery) ||
      word.shortDescription.toLowerCase().includes(lowercaseQuery)
  );
};

export const getWordsAlphabetically = (): Word[] => {
  return [...sampleWords].sort((a, b) => a.word.localeCompare(b.word, "ro"));
};
