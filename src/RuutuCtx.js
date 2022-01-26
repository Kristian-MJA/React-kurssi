//import React, { useState, useReducer, useContext } from 'react';
import React, { useContext } from 'react';
import { store } from './store.js';

const Pelitila = {
	NIMI_X_MUUTTUI: 'NIMI_X_MUUTTUI',
	NIMI_O_MUUTTUI: 'NIMI_O_MUUTTUI',
	ALOITA_PAINETTU: 'ALOITA_PAINETTU',
	RUUTU_VALITTU: 'RUUTU_VALITTU',
	PELI_OHI: 'PELI_OHI',
	UUSIPELI_PAINETTU: 'UUSIPELI_PAINETTU',
	TILAN_VALITYS: 'TILAN_VALITYS'
};

const nap = { x: "X", o: "O", tyhja: " " };


export function Ruutu(props) {
	const globalState = useContext(store);
	//const { dispatch, state } = globalState;
	const { dispatch } = globalState;
	let buttonClass = "peliruutu-1";

	if (props.ruuduntila.nappula === nap.o) {
		buttonClass = "peliruutu-2";
	};

	return (
		<button className={buttonClass} onClick={() => dispatch(
			{ type: Pelitila.RUUTU_VALITTU, data: props.ruuduntila.paikka }
		)}>
			{props.ruuduntila.nappula}
		</button>
	);
};

export default Ruutu;
