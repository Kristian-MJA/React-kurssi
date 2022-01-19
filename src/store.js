// store.js
import React, { createContext, useReducer } from 'react';

const Pelitila = {
	NIMI_X_MUUTTUI: 'NIMI_X_MUUTTUI',
	NIMI_O_MUUTTUI: 'NIMI_O_MUUTTUI',
	ALOITA_PAINETTU: 'ALOITA_PAINETTU',
	RUUTU_VALITTU: 'RUUTU_VALITTU',
	PELI_OHI: 'PELI_OHI'
};

// CUSTOM PELILAUTA (N ristiä/nollaa peräkkäin voittoon) ------
const N = 5;
const leveys = 32;
const korkeus = 18;
const nap = { x: "X", o: "O", tyhja: " " };

const voittorivit = [];
const initialState = {
	pelilauta: [],
	tila: Pelitila.NIMET_PUUTTEELLISET,
	pelaajat: ["", ""],
	pelivuoroX: true,
	voittaja: -1,
	peliKäynnissä: false
};

/*
Muuntaa pelilaudalla olevan ruudun (x, y)-koordinaatin juoksevaksi
indeksiksi. Esimerkiksi ruudukkoa

(0, 0) (1, 0) (2, 0)
(0, 1) (1, 1)	(2, 1)
(0, 2) (1, 2)	(2, 2)

vastaa juoksevat indeksit

0		1		2
3		4		5
6		7		8.

Isommille ruudukoille vastaavasti.
*/
const xy_to_index = (x, y) => {
	if (x >= 0 && x < leveys & y >= 0 && y < korkeus) {
		return x + leveys * y;
	} else {
		return -1;
	};
};

for (let i = 0; i < leveys * korkeus; i++) {
	initialState.pelilauta.push({ nappula: nap.tyhja, paikka: i });
};

// Pystysuorat N linjat
for (let x = 0; x < leveys; x++) {
	for (let y = 0; y < korkeus - N + 1; y++) {
		const linja = [...Array(N).keys()].map(i => [x, y + i]);

		voittorivit.push(
			linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
		);
	};
};
// Vaakasuorat N linjat
for (let x = 0; x < leveys - N + 1; x++) {
	for (let y = 0; y < korkeus; y++) {
		const linja = [...Array(N).keys()].map(i => [x + i, y]);

		voittorivit.push(
			linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
		);
	};
};
// Diagonaaliset N linjat "\"
for (let x = 0; x < leveys - N + 1; x++) {
	for (let y = 0; y < korkeus - N + 1; y++) {
		const linja =
			[...Array(N).keys()].map(i => [x + i, y + i]);

		voittorivit.push(
			linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
		);
	};
};
// Diagonaaliset N linjat "/"
for (let x = leveys - 1; x > N - 2; x--) {
	for (let y = 0; y < korkeus - N + 1; y++) {
		const linja =
			[...Array(N).keys()].map(i => [x - i, y + i]);

		voittorivit.push(
			linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
		);
	};
};
console.log(voittorivit);
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
	peliKäynnissä: false
};
*/

const voittaakoTämäPelaaja = (lauta, pelaaja) => {
	return voittorivit.some(x => {
		let voitto = false;
		if (lauta[x[0]] !== nap.tyhja
			&& lauta[x[0]].nappula === pelaaja
			&& lauta[x[1]].nappula === pelaaja
			&& lauta[x[2]].nappula === pelaaja
			&& lauta[x[3]].nappula === pelaaja
			&& lauta[x[4]].nappula === pelaaja) {
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

		let kopio = state.pelaajat.slice();
		let tila = {};

		switch (action.type) {

			case Pelitila.ALOITA_PAINETTU:

				if (state.pelaajat[0].length > 0
					&& state.pelaajat[1].length > 0) {
					//return { ...state, peliKäynnissä: true };
					tila = { ...state, peliKäynnissä: true };
				} else {
					//return { ...state, peliKäynnissä: false };
					tila = { ...state, peliKäynnissä: false };
				};
				break;

			case Pelitila.NIMI_O_MUUTTUI:

				kopio[0] = action.data;
				//return { ...state, pelaajat: kopio };
				tila = { ...state, pelaajat: kopio };
				break;

			case Pelitila.NIMI_X_MUUTTUI:

				kopio[1] = action.data;
				//return { ...state, pelaajat: kopio };
				tila = { ...state, pelaajat: kopio };
				break;

			case Pelitila.RUUTU_VALITTU:

				if (state.pelilauta[action.data].nappula === " "
					&& state.voittaja === -1) {
					let kopio = state.pelilauta.slice()

					if (state.pelivuoroX) {
						kopio[action.data].nappula = nap.x;

						if (voittaakoTämäPelaaja(kopio, nap.x)) {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: false,
								voittaja: 1
							};
							*/
							tila = {
								...state,
								pelilauta: kopio,
								pelivuoroX: false,
								voittaja: 1
							};
						} else {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: false
							};
							*/
							tila = {
								...state,
								pelilauta: kopio,
								pelivuoroX: false
							};
						};
						//setPelilauta(kopio)
						//setPelivuoroX(false)
					} else {
						kopio[action.data].nappula = nap.o;

						if (voittaakoTämäPelaaja(kopio, nap.o)) {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: false,
								voittaja: 0
							};
							*/
							tila = {
								...state,
								pelilauta: kopio,
								pelivuoroX: false,
								voittaja: 0
							};
						} else {
							/*
							return {
								...state,
								pelilauta: kopio,
								pelivuoroX: true
							};
							*/
							tila = {
								...state,
								pelilauta: kopio,
								pelivuoroX: true
							};
						};
						//setPelilauta(kopio)
						//setPelivuoroX(true)
					};
				};
				break;

			default:
				throw new Error();
		};

		return tila;
	}, initialState);

	return (
		<Provider value={{ state, dispatch }}>{children}</Provider>
	);
};

export { store, StateProvider };