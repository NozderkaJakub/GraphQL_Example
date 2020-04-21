const { ApolloServer, gql } = require('apollo-server');
const { readFileSync } = require('fs');

const baza_malarzy = [
  { id: 1, imie_i_nazwisko: 'GL Brierley', wiek: 55 },
  { id: 2, imie_i_nazwisko: 'Ewa Juszkiewicz', wiek: 36 },
  { id: 3, imie_i_nazwisko: 'Kristina Alisauskaite', wiek: 36 },
  { id: 4, imie_i_nazwisko: 'Carla Busuttil', wiek: 38 },
];

const baza_obrazow = [
  { id: 1, nazwa: 'Pink & Pert', czy_nagrodzone: true, id_artysty: 1, cena: 500 },
  { id: 2, nazwa: 'Ictus', czy_nagrodzone: false, id_artysty: 1, cena: 25 },
  { id: 3, nazwa: 'Rosary', czy_nagrodzone: false, id_artysty: 1, cena: 10 },
  { id: 4, nazwa: 'Panny z wilka', czy_nagrodzone: true, id_artysty: 2, cena: 850 },
  { id: 5, nazwa: 'bez tytułu', czy_nagrodzone: false, id_artysty: 2, cena: 20 },
  { id: 6, nazwa: 'Don\'t ask II', czy_nagrodzone: true, id_artysty: 3, cena: 100 },
  { id: 7, nazwa: 'Alles Ist Schwindel', czy_nagrodzone: false, id_artysty: 4, cena: 1550 },
  { id: 8, nazwa: 'Matchboxes And Necklaces', czy_nagrodzone: false, id_artysty: 4, cena: 20000 },
];

const baza_muzykow = [
  { id: 1, imie_i_nazwisko: 'Jacek Władysław Łaszczok-Stachursky', wiek: 54 },
  { id: 2, imie_i_nazwisko: 'Grzegorz Skawiński', wiek: 65 },
  { id: 3, imie_i_nazwisko: 'Wojciech Zawadzki', wiek: 36 },
];

const baza_albumow = [
  { id: 1, nazwa: '2009', czy_nagrodzone: true, id_artysty: 1 },
  { id: 2, nazwa: 'Taki jestem', czy_nagrodzone: true, id_artysty: 1 },
  { id: 3, nazwa: 'Urodziłem się aby grać', czy_nagrodzone: true, id_artysty: 1 },
  { id: 4, nazwa: 'Królowie życia', czy_nagrodzone: true, zespol: 'Kombi', id_artysty: 2 },
  { id: 5, nazwa: 'Zaczarowane miasto', czy_nagrodzone: true, zespol: 'Kombi', id_artysty: 2 },
  { id: 6, nazwa: 'Demonologia', czy_nagrodzone: true, id_artysty: 3 },
  { id: 7, nazwa: 'BDF', czy_nagrodzone: true, id_artysty: 3 },
];

const resolvers = {
  Query: {
    malarze: () => baza_malarzy,
    muzycy: () => baza_muzykow,
    obrazy: () => baza_obrazow,
    albumy: () => baza_albumow,
    malarz: (parent, args, context, info) => {
      return baza_malarzy.find(malarz => malarz.id == args.id);
    },
    muzyk: (parent, args, context, info) => {
      return baza_muzykow.find(muzyk => muzyk.id == args.id);
    },
    obraz: (parent, args, context, info) => {
      return baza_obrazow.find(obraz => obraz.id == args.id);
    },
    album: (parent, args, context, info) => {
      return baza_albumow.find(album => album.id == args.id);
    }
  },
  Mutation: {
    dodajMuzyka: (parent, args) => {
      const id = baza_muzykow.length + 1;
      const muzyk = { id: id, imie_i_nazwisko: args.imie_i_nazwisko, wiek: args.wiek, albumy: [] };
      baza_muzykow.push(muzyk);
      return muzyk;
    },
    dodajAlbum: (parent, args) => {
      const id = baza_albumow.length + 1;
      const album = { id: id, nazwa: args.album.nazwa, czy_nagrodzone: args.album.czy_nagrodzone, id_artysty: args.album.id_artysty, zespol: args.album.zespol };
      baza_albumow.push(album);
      return album;
    },
    // edytujMuzyka: (parent, {id, imie_i_nazwisko, wiek}) => {

    // },
    // edytujAlbum: (parent, args) => {

    // },
    // usunMuzyka: (parent, args) => {

    // },
    // usunAlbum: (parent, args) => {

    // }
  },
  Malarz: {
    obrazy: (parent, args, context, info) => {
      return baza_obrazow.filter(obraz => obraz.id_artysty == parent.id);
    }
  },
  Muzyk: {
    albumy: (parent, args, context, info) => {
      return baza_albumow.filter(album => album.id_artysty == parent.id);
    }
  },
  Obraz: {
    cena: ({ cena }, args) => {
      if (args.waluta === "EUR") return (Math.round((cena/4.5) * 100) / 100).toString() + "EUR";
      return cena.toString() + "PLN";
    }
  }
}

const server = new ApolloServer({
  typeDefs: gql`${readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
