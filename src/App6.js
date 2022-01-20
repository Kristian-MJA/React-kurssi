import React, { useState, useReducer, useContext } from 'react';
import './App.css';
import RuutuCtx from "./RuutuCtx.js";
import { render } from 'react-dom';
import { store } from './store.js';

const io = require('socket.io-client');
const ioServer = 'http://localhost:4000';

const Pelitila = {
	NIMI_X_MUUTTUI: 'NIMI_X_MUUTTUI',
	NIMI_O_MUUTTUI: 'NIMI_O_MUUTTUI',
	ALOITA_PAINETTU: 'ALOITA_PAINETTU',
	RUUTU_VALITTU: 'RUUTU_VALITTU',
	PELI_OHI: 'PELI_OHI'
};

const App6 = () => {

	const socket = io(ioServer);

	socket.on('connection', () => {
		console.log('socket.on() pelittää');
	});

	// const [state, dispatch] = useReducer(reducer, initialState);

	const globalState = useContext(store);
	const { dispatch, state } = globalState;

	const nimiOMuuttui = (tapahtuma) => {
		dispatch({
			type: Pelitila.NIMI_O_MUUTTUI,
			data: tapahtuma.target.value
		});
	};
	const nimiXMuuttui = (tapahtuma) => {
		dispatch({
			type: Pelitila.NIMI_X_MUUTTUI,
			data: tapahtuma.target.value
		});
	};
	const aloitaNappiPainettu = () => {
		dispatch({ type: Pelitila.ALOITA_PAINETTU })
	};
	const ruutuValittu = (indeksi) => {
		dispatch({ type: Pelitila.RUUTU_VALITTU, data: indeksi });
	};

	const kenenVuoro = () => {
		if (state.pelivuoroX) {
			return "X";
		} else {
			return "O";
		};
	};

	//  {voittikoX() && "X voitti"}
	return (
		<div className="App">
			<header className="App-header">

				{
					!state.peliKaynnissa
					&& <button onClick={aloitaNappiPainettu}>
						Aloita peli
					</button>
				}
				{
					(state.pelaajat[0].length < 1
						|| state.pelaajat[1].length < 1)
					&& <div>Kirjoita pidemmät nimet!</div>
				}
				<div>
					Pelaaja X: &nbsp;
					<input
						type="text"
						value={state.pelaajat[1]}
						onChange={(event) => nimiXMuuttui(event)}>
					</input>
					&nbsp;
					Pelaaja O: &nbsp;
					<input
						type="text"
						value={state.pelaajat[0]}
						onChange={(event) => nimiOMuuttui(event)}>
					</input>
				</div>
				{
					state.peliKaynnissa
					&& state.voittaja === -1
					&& <div>VUOROSSA: {kenenVuoro()}</div>
				}
				{
					state.voittaja !== -1
					&& "VOITTAJA: " + state.pelaajat[state.voittaja]
				}

				<div className="ristinollapeli">
					{
						state.peliKaynnissa
						&& state.pelilauta.map((alkio, indeksi) =>
							<RuutuCtx key={indeksi} ruuduntila={alkio} />
						)
					}
				</div>

			</header >
		</div >
	);
};

export default App6;
