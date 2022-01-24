// store.js
import React, { createContext, useReducer } from 'react';

const Pelitila = {
	NIMI_X_MUUTTUI: 'NIMI_X_MUUTTUI',
	NIMI_O_MUUTTUI: 'NIMI_O_MUUTTUI',
	ALOITA_PAINETTU: 'ALOITA_PAINETTU',
	RUUTU_VALITTU: 'RUUTU_VALITTU',
	PELI_OHI: 'PELI_OHI',
	UUSIPELI_PAINETTU: 'UUSIPELI_PAINETTU'
};

// CUSTOM PELILAUTA (N ristiä/nollaa peräkkäin voittoon)
const N = 5;
const leveys = 20;
const korkeus = 20;
const nap = { x: "X", o: "O", tyhja: " " };

const voittorivit = [];
const initialState = {
	pelilauta: [...Array(leveys * korkeus).keys()]
		.map(i => ({ nappula: nap.tyhja, paikka: i })),
	tila: Pelitila.NIMET_PUUTTEELLISET,
	pelaajat: ["", ""],
	pelivuoroX: Math.random() < 0.5,
	voittaja: -1,
	peliKaynnissa: false
};

/*
Muuntaa pelilaudalla olevan ruudun (x, y)-koordinaatin juoksevaksi
indeksiksi. Esimerkiksi ruudukkoa

(0, 0) (1, 0) (2, 0)
(0, 1) (1, 1)	(2, 1)
(0, 2) (1, 2)	(2, 2)

vastaa juokseva indeksointi

0		1		2
3		4		5
6		7		8.

Isommille ruudukoille vastaavasti.
TODO: käänteisfunktio index_to_xy
*/
const xy_to_index = (x, y) => {
	if (x >= 0 && x < leveys & y >= 0 && y < korkeus) {
		return x + leveys * y;
	} else {
		return -1;
	};
};

const lisaaVoittorivi = (rivi) => {
	if (rivi.every(P => xy_to_index(P[0], P[1]) > -1)) {
		voittorivit.push(rivi.map(P => xy_to_index(P[0], P[1])));
	};
};

// initialState.pelilauta = [...Array(leveys * korkeus).keys()]
//.map(i => ({ nappula: nap.tyhja, paikka: i }));

// Voittorivien generointi
for (let x = 0; x < leveys; x++) {
	for (let y = 0; y < korkeus; y++) {
		// "|"
		const pystyRivi = [...Array(N).keys()].map(i => [x, y + i]);
		// "--"
		const vaakaRivi = [...Array(N).keys()].map(i => [x + i, y]);
		// "\"
		const diagAlas = [...Array(N).keys()].map(i => [x + i, y + i]);
		// "/"
		const diagYlos = [...Array(N).keys()].map(i => [x - i, y + i]);

		lisaaVoittorivi(pystyRivi);
		lisaaVoittorivi(vaakaRivi);
		lisaaVoittorivi(diagAlas);
		lisaaVoittorivi(diagYlos);
	};
};
//console.log(voittorivit);
// ------------------------------------------------------------

/*
const voittorivit = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

const nap = { x: "X", o: "O", tyhja: " " };

const initialState = {
	pelilauta: [
		{ nappula: nap.tyhja, paikka: 0 },
		{ nappula: nap.tyhja, paikka: 1 },
		{ nappula: nap.tyhja, paikka: 2 },
		{ nappula: nap.tyhja, paikka: 3 },
		{ nappula: nap.tyhja, paikka: 4 },
		{ nappula: nap.tyhja, paikka: 5 },
		{ nappula: nap.tyhja, paikka: 6 },
		{ nappula: nap.tyhja, paikka: 7 },
		{ nappula: nap.tyhja, paikka: 8 }
	],
	tila: Pelitila.NIMET_PUUTTEELLISET,
	pelaajat: ["", ""],
	pelivuoroX: true,
	voittaja: -1,
	peliKaynnissa: false
};
*/

const voittaakoTamaPelaaja = (lauta, pelaaja) => {

	const voittoehto = (rivi) => {
		return (
			lauta[rivi[0]] !== nap.tyhja
			&& ([...Array(N).keys()].map(i => lauta[rivi[i]]))
				.every(e => e.nappula === pelaaja)
		);
	};

	return voittorivit.some(x => {
		let voitto = false;
		if (voittoehto(x)) {
			voitto = true;
		};
		return voitto;
	});
};

//const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
	const [state, dispatch] = useReducer((state, action) => {

		//let kopio = state.pelaajat.slice();
		let kopio = { ...state };

		switch (action.type) {

			case Pelitila.ALOITA_PAINETTU:
				if (state.pelaajat[0].length > 0
					&& state.pelaajat[1].length > 0) {
					//return { ...state, peliKaynnissa: true };
					//tila = { ...state, peliKaynnissa: true };
					kopio.peliKaynnissa = true;
				} else {
					//return { ...state, peliKaynnissa: false };
					//tila = { ...state, peliKaynnissa: false };
					kopio.peliKaynnissa = false;
				};
				break;

			case Pelitila.NIMI_O_MUUTTUI:
				kopio.pelaajat[0] = action.data;
				//return { ...state, pelaajat: kopio };
				break;

			case Pelitila.NIMI_X_MUUTTUI:
				kopio.pelaajat[1] = action.data;
				//return { ...state, pelaajat: kopio };
				break;

			case Pelitila.RUUTU_VALITTU:

				if (state.pelilauta[action.data].nappula === " "
					&& state.voittaja === -1) {
					//let kopio = state.pelilauta.slice()

					if (state.pelivuoroX) {
						kopio.pelilauta[action.data].nappula = nap.x;

						if (voittaakoTamaPelaaja(kopio.pelilauta, nap.x)) {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: false,
								voittaja: 1
							};
							*/
							kopio.pelivuoroX = false;
							kopio.voittaja = 1;
						} else {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: false
							};
							*/
							kopio.pelivuoroX = false;
						};
						//setPelilauta(kopio)
						//setPelivuoroX(false)
					} else {
						kopio.pelilauta[action.data].nappula = nap.o;

						if (voittaakoTamaPelaaja(kopio.pelilauta, nap.o)) {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: false,
								voittaja: 0
							};
							*/
							kopio.pelivuoroX = false;
							kopio.voittaja = 0;
						} else {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: true
							};
							*/
							kopio.pelivuoroX = true;
						};
						//setPelilauta(kopio)
						//setPelivuoroX(true)
					};
				};
				break;

			case Pelitila.PELI_OHI:
				if (action.data) {
					// O voittaa
					kopio.voittaja = 0;
				} else {
					// X voittaa
					kopio.voittaja = 1;
				};
				break;

			case Pelitila.UUSIPELI_PAINETTU:
				for (let i in kopio.pelilauta) {
					if (kopio.pelilauta[i].nappula !== nap.tyhja) {
						kopio.pelilauta[i].nappula = nap.tyhja;
					};
				};
				kopio.pelivuoroX = Math.random() < 0.5;
				kopio.voittaja = -1;
				break;

			default:
				throw new Error();
		};

		return kopio;
	}, initialState);

	return (
		<Provider value={{ state, dispatch }}>{children}</Provider>
	);
};

export { store, StateProvider };