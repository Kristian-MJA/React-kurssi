import React, { useState, useContext } from 'react';
import './App.css';
import RuutuCtx from "./RuutuCtx.js";
//import { render } from 'react-dom';
import { store } from './store.js';

const io = require('socket.io-client');
const ioHost = 'http://localhost:4000';
const ioHostOptions = {
	transports: ['websocket', 'polling', 'flashsocket']
};

// TÄRKEÄÄ OLLA APPIFUNKTION ULKOPUOLELLA!
const socket = io(ioHost, ioHostOptions);

const Pelitila = {
	NIMI_X_MUUTTUI: 'NIMI_X_MUUTTUI',
	NIMI_O_MUUTTUI: 'NIMI_O_MUUTTUI',
	ALOITA_PAINETTU: 'ALOITA_PAINETTU',
	RUUTU_VALITTU: 'RUUTU_VALITTU',
	PELI_OHI: 'PELI_OHI',
	UUSIPELI_PAINETTU: 'UUSIPELI_PAINETTU'
};

const App6 = () => {

	const [PeliID, setPeliID] = useState('');

	// const [state, dispatch] = useReducer(reducer, initialState);

	const globalState = useContext(store);
	const { dispatch, state } = globalState;

	socket.on('gameId', (id) => {
		console.log('Peliä vastaava socket-ID:', id);
		setPeliID(id);
	});

	socket.on('gamedata', (data) => {

	});

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
	const uusiPeliNappiPainettu = () => {
		dispatch({ type: Pelitila.UUSIPELI_PAINETTU })
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
					&& <button className='button-xo'
						onClick={aloitaNappiPainettu}>
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
					!state.peliKaynnissa
					&& <div>Pelin ID: {PeliID}</div>
				}
				{
					state.peliKaynnissa
					&& <div>VUORO: {kenenVuoro()}</div>
				}

				<div className="ristinollapeli">
					{
						state.peliKaynnissa
						&& state.pelilauta.map((alkio, indeksi) =>
							<RuutuCtx key={indeksi} ruuduntila={alkio} />
						)
					}
				</div>

				{
					state.voittaja !== -1
					&& <div>
						VOITTAJA: {state.pelaajat[state.voittaja]} &nbsp;
						<button
							className='button-xo'
							onClick={uusiPeliNappiPainettu}>
							Uusi peli
						</button>
					</div>
				}

			</header >
		</div >
	);
};

export default App6;
