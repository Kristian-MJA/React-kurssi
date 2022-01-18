import React, { useState } from 'react';
import './App.css';
import Ruutu from "./Ruutu.js";

//useEffect, Axios, useReducer, Context API,

let counter = 0;

function App2() {

	//const peli = '3x3';
	const peli = 'ääretön';

	const nap = { x: "X", o: "O", tyhja: " " };

	const [vuoro, setVuoro] = useState(true);
	//true tarkoittaa, etta X aloittaa
	const [kierrokset, setKierrokset] = useState(0);
	const [pelilauta, setPelilauta] = useState([]);
	const [voittorivit, setVoittorivit] = useState([]);

	// Muuntaa koordinaatit (x, y) juoksevaksi indeksiksi
	// suorakulmiossa [0, leveys - 1] x [0, korkeus - 1]
	const xy_to_index = (x, y, leveys, korkeus) => {
		if (x >= 0 && x < leveys & y >= 0 && y < korkeus) {
			return x + leveys * y;
		} else {
			return -1;
		};
	};

	// 3x3 ------------------------------------------------------
	if (peli === '3x3' && pelilauta.length === 0) {
		setPelilauta([
			{ nappula: nap.tyhja, paikka: 0 },
			{ nappula: nap.tyhja, paikka: 1 },
			{ nappula: nap.tyhja, paikka: 2 },
			{ nappula: nap.tyhja, paikka: 3 },
			{ nappula: nap.tyhja, paikka: 4 },
			{ nappula: nap.tyhja, paikka: 5 },
			{ nappula: nap.tyhja, paikka: 6 },
			{ nappula: nap.tyhja, paikka: 7 },
			{ nappula: nap.tyhja, paikka: 8 }
		]);

		/*
		const [pelilauta, setPelilauta] = useState([
			{ nappula: nap.o, paikka: 0 },
			{ nappula: nap.x, paikka: 1 },
			{ nappula: nap.o, paikka: 2 },
			{ nappula: nap.tyhja, paikka: 3 },
			{ nappula: nap.x, paikka: 4 },
			{ nappula: nap.tyhja, paikka: 5 },
			{ nappula: nap.tyhja, paikka: 6 },
			{ nappula: nap.o, paikka: 7 },
			{ nappula: nap.tyhja, paikka: 8 }
		]);
		*/

		setVoittorivit([
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		]);
	};
	// ----------------------------------------------------------

	/*
	["x","x","x","x","x"]	=> 10000
	["x","x","x","x"]			=> 5000
	["x","x"," ","x","x"] => 3000
	["x","x"," ","x"]			=> 100
	["x","x","x"]					=> 60
	["x","x"]							=> 30
	*/

	// "ÄÄRETÖN" RUUDUKKO (N peräkkäin) -------------------------
	if (peli === 'ääretön' && pelilauta.length === 0) {
		// Laudan koko leveys x korkeus ruutua
		const N = 5;
		const leveys = 6;
		const korkeus = 6;
		const lauta = [];
		const linjatN = [];

		for (let i = 0; i < leveys * korkeus; i++) {
			lauta.push({ nappula: nap.tyhja, paikka: i });
		};
		setPelilauta([...lauta]);

		// Pystysuorat N linjat
		for (let x = 0; x < leveys; x++) {
			for (let y = 0; y < korkeus - N + 1; y++) {
				const linja = [...Array(N).keys()].map(i => [x, y + i]);

				linjatN.push(
					linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
				);
			};
		};
		// Vaakasuorat N linjat
		for (let x = 0; x < leveys - N + 1; x++) {
			for (let y = 0; y < korkeus; y++) {
				const linja = [...Array(N).keys()].map(i => [x + i, y]);

				linjatN.push(
					linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
				);
			};
		};
		// Diagonaaliset N linjat "\"
		for (let x = 0; x < leveys - N + 1; x++) {
			for (let y = 0; y < korkeus - N + 1; y++) {
				const linja =
					[...Array(N).keys()].map(i => [x + i, y + i]);

				linjatN.push(
					linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
				);
			};
		};
		// Diagonaaliset N linjat "/"
		for (let x = leveys - 1; x > N - 2; x--) {
			for (let y = 0; y < korkeus - N + 1; y++) {
				const linja =
					[...Array(N).keys()].map(i => [x - i, y + i]);

				linjatN.push(
					linja.map(P => xy_to_index(P[0], P[1], leveys, korkeus))
				);
			};
		};
		console.log(linjatN);
		setVoittorivit([...linjatN]);
	};


	// ----------------------------------------------------------

	function voittaakoTamaPelaaja(lauta, pelaaja) {
		return voittorivit.some(x => {
			if (lauta[x[0]] !== nap.tyhja
				&& lauta[x[0]].nappula === pelaaja
				&& lauta[x[1]].nappula === pelaaja
				&& lauta[x[2]].nappula === pelaaja) {
				return true;
			};
		});
	};

	function ruutuPainettu(indeksi) {
		if ((!voittaakoTamaPelaaja(pelilauta, nap.o)
			&& !voittaakoTamaPelaaja(pelilauta, nap.x))) {
			if (pelilauta[indeksi].nappula === nap.tyhja
				&& kierrokset < 5) {

				let kopio = pelilauta.slice();
				kopio[indeksi].nappula = nap.x;
				if (kierrokset < 4) {
					counter = 0;
					let paikka = tietokoneenSiirto(kopio);
					kopio[paikka].nappula = nap.o;
					console.log(counter);
				};
				setPelilauta(kopio);
				setKierrokset(kierrokset + 1);
			};
		};
		//setNimi(tapahtuma.target.value)
		//console.log(indeksi)
	};
	function tietokoneenSiirto(lauta) {
		return minimax(lauta, nap.o).paikka;
	};
	function emptySquares(lauta) {
		return lauta.filter(item => item.nappula === nap.tyhja);
	};
	function minimax(newBoard, player) {
		let availableSpots = emptySquares(newBoard);

		if (voittaakoTamaPelaaja(newBoard, nap.x)) {
			/*
			console.log("--------x voittaa----------");
			console.log(
				newBoard[0].nappula + newBoard[1].nappula + newBoard[2].nappula
			);
			console.log(
				newBoard[3].nappula + newBoard[4].nappula + newBoard[5].nappula
			);
			console.log(
				newBoard[6].nappula + newBoard[7].nappula + newBoard[8].nappula
			);
			*/
			return { score: -10 };
		} else if (voittaakoTamaPelaaja(newBoard, nap.o)) {
			/*
			console.log("--------o voittaa----------");
			console.log(
				newBoard[0].nappula + newBoard[1].nappula + newBoard[2].nappula
			);
			console.log(
				newBoard[3].nappula + newBoard[4].nappula + newBoard[5].nappula
			);
			console.log(
				newBoard[6].nappula + newBoard[7].nappula + newBoard[8].nappula
			);
			*/
			return { score: 10 };
		} else if (availableSpots.length === 0) {
			/*
			console.log("--------tasapeli----------");
			console.log(
				newBoard[0].nappula + newBoard[1].nappula + newBoard[2].nappula
			);
			console.log(
				newBoard[3].nappula + newBoard[4].nappula + newBoard[5].nappula
			);
			console.log(
				newBoard[6].nappula + newBoard[7].nappula + newBoard[8].nappula
			);
			*/
			return { score: 0 };
		};

		let moves = [];

		availableSpots.forEach((availableSpot) => {
			let move = {};
			move.paikka = newBoard[availableSpot.paikka].paikka;
			move.nappula = " ";
			newBoard[availableSpot.paikka] = {
				nappula: player, paikka: move.paikka
			};

			if (player === nap.o) {
				let result = minimax(newBoard, nap.x);
				move.score = result.score;
			} else {
				let result = minimax(newBoard, nap.o);
				move.score = result.score;
			};

			newBoard[availableSpot.paikka] = {
				nappula: move.nappula, paikka: move.paikka
			};
			moves.push(move);
		});

		let bestMove;

		if (player === nap.o) {
			let bestScore = -10000;
			moves.forEach((move, index) => {
				if (move.score > bestScore) {
					bestScore = move.score;
					bestMove = index;
				};
			});
		} else {
			let bestScore = 10000;
			moves.forEach((move, index) => {
				if (move.score < bestScore) {
					bestScore = move.score;
					bestMove = index;
				};
			});
		};
		counter++;
		if (counter > 100) {
			if ((counter % 100) === 0) {
				console.log(counter);
			};
		} else {
			console.log(counter);
		};
		console.log("Paras siirto:" + moves[bestMove].paikka);
		return moves[bestMove];
	};

	return (
		<div className="App">
			<header className="App-header">
				<div className="game">

					{pelilauta.map((alkio, indeksi) => (
						<Ruutu
							key={indeksi}
							ruuduntila={alkio}
							funktio={ruutuPainettu}
						/>
					))}
				</div>

			</header>
		</div>
	);
};

export default App2;