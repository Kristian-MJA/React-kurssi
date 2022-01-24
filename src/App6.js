import React, { useState, useContext } from 'react';
import { useEffect } from 'react/cjs/react.development';
import './App.css';
import RuutuCtx from './RuutuCtx.js';
//import { render } from 'react-dom';
import { store } from './store.js';

const io = require('socket.io-client');
const ioHost = 'http://localhost:4000';
const ioHostOptions = {
	transports: ['websocket', 'polling', 'flashsocket']
};

// TÄRKEÄÄ OLLA APPIFUNKTION ULKOPUOLELLA!
// --- Laita useEffectiin?
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

	const [OmaID, setOmaID] = useState('');
	const [Nimimerkki, setNimimerkki] = useState('');
	const [Vastustaja, setVastustaja] = useState('');
	const [HuoneID, setHuoneID] = useState('');
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
	const uusiPeliNappiPainettu = () => {
		dispatch({ type: Pelitila.UUSIPELI_PAINETTU })
	};
	const ruutuValittu = (indeksi) => {
		dispatch({ type: Pelitila.RUUTU_VALITTU, data: indeksi });
	};
	const luovutaNappiPainettu = () => {
		dispatch({ type: Pelitila.PELI_OHI, data: state.pelivuoroX });
	};
	const kenenVuoro = () => {
		if (state.pelivuoroX) {
			return 'X';
		} else {
			return 'O';
		};
	};
	const liityHuoneeseen = () => {
		socket.emit('joinRoom', { nick: Nimimerkki, roomId: HuoneID });
	};

	// ----------------------------------------------------------

	// Laita useEffectiin?
	socket.on('gameId', (id) => {
		console.log('Sinun socket-ID:', id);
		setOmaID(id);
	});

	// Laita useEffectiin?
	socket.on('joinedMyRoom', (data) => {
		setVastustaja(data.nick);
		console.log(
			`${data.nick} (ID=${data.roomId}) liittyi peliin.`
		);
	});

	socket.on('serverMessage', (msg) => {
		console.log(msg);
	});

	socket.on('gameData', (data) => {

	});

	useEffect(() => {
		console.log('Nimimerkki:', Nimimerkki);
	}, [Nimimerkki]);

	useEffect(() => {
		console.log('Syötetty huone:', HuoneID)
	}, [HuoneID]);

	useEffect(() => {
		if (state.peliKaynnissa) {
			socket.emit('gamedata', state);
		};
	}, [state]);

	// ----------------------------------------------------------

	//  {voittikoX() && 'X voitti'}
	return (
		<div className='App'>
			<header className='App-header'>

				{/*
					(state.pelaajat[0].length < 1
						|| state.pelaajat[1].length < 1)
					&& <div>Kirjoita pidemmät nimet!</div>
				*/}
				<div className='div-aula'>
					Nimimerkkisi: &nbsp;
					<input
						className='input-xo'
						type='text'
						value={Nimimerkki}
						onChange={(event) =>
							setNimimerkki(event.target.value)
						}>
					</input>
					{
						!state.peliKaynnissa
						&&
						<div>
							<div>Sinun ID: {OmaID}</div>
							<div>
								Vastustaja: {Vastustaja}
							</div>
							{
								Vastustaja.length > 0
								&& <div className='div-nappula'>
									<button
										className='button-xo'
										onClick={() => aloitaNappiPainettu()}>
										Aloita peli
									</button>
								</div>
							}
							{
								Vastustaja.length === 0
								&& <div>
									Huoneen ID: &nbsp;
									<input
										className='input-xo'
										type='text'
										value={HuoneID}
										onChange={(event) =>
											setHuoneID(event.target.value)
										}>
									</input>
									<div className='div-nappula'>
										<button
											className='button-xo'
											onClick={() => liityHuoneeseen()}>
											Liity peliin
										</button>
									</div>
								</div>
							}
						</div>
					}
				</div>
				{
					state.peliKaynnissa
					&& state.voittaja === -1
					&& <div>VUORO: {kenenVuoro()}</div>
				}
				{
					state.voittaja !== -1
					&& <div>VOITTAJA: {state.pelaajat[state.voittaja]}</div>
				}

				<div className='ristinollapeli'>
					{
						state.peliKaynnissa
						&& state.pelilauta.map((alkio, indeksi) =>
							<RuutuCtx key={indeksi} ruuduntila={alkio} />
						)
					}
				</div>

				{
					<div>
						{
							state.voittaja !== -1
							&& <button
								className='button-xo'
								onClick={uusiPeliNappiPainettu}>
								Uusi peli
							</button>
						}
						{
							state.peliKaynnissa
							&& state.voittaja === -1
							&& <button
								className='button-xo-red'
								onClick={luovutaNappiPainettu}>
								Luovuta
							</button>
						}
					</div>
				}

				{/*
					(state.pelaajat[0].length < 1
						|| state.pelaajat[1].length < 1)
					&& <div>Kirjoita pidemmät nimet!</div>
				}
				<div>
					Pelaaja X: &nbsp;
					<input
						className='input-xo'
						type='text'
						value={state.pelaajat[1]}
						onChange={(event) => nimiXMuuttui(event)}>
					</input>
					&nbsp;
					Pelaaja O: &nbsp;
					<input
						className='input-xo'
						type='text'
						value={state.pelaajat[0]}
						onChange={(event) => nimiOMuuttui(event)}>
					</input>
				</div>
				{
					state.peliKaynnissa
					&& state.voittaja === -1
					&& <div>VUORO: {kenenVuoro()}</div>
				}
				{
					state.voittaja !== -1
					&& <div>VOITTAJA: {state.pelaajat[state.voittaja]}</div>
				}

				<div className='ristinollapeli'>
					{
						state.peliKaynnissa
						&& state.pelilauta.map((alkio, indeksi) =>
							<RuutuCtx key={indeksi} ruuduntila={alkio} />
						)
					}
				</div>

				{
					!state.peliKaynnissa
					&& <div>Pelin ID: {OmaID}</div>
				}
				{
					<div>
						{
							!state.peliKaynnissa
							&& <button
								className='button-xo'
								onClick={aloitaNappiPainettu}>
								Aloita peli
							</button>
						}
						{
							state.voittaja !== -1
							&& <button
								className='button-xo'
								onClick={uusiPeliNappiPainettu}>
								Uusi peli
							</button>
						}
						{
							state.peliKaynnissa
							&& state.voittaja === -1
							&& <button
								className='button-xo-red'
								onClick={luovutaNappiPainettu}>
								Luovuta
							</button>
						}
					</div>
			*/}

			</header >
		</div >
	);
};

export default App6;
