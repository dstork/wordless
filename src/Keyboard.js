import { React } from "react";

import Key from "./Key";

function Keyboard({style, clickHandler}) {
	return (
		<div id="keyboard" style={style}>
			<div id="first_line" className="keyboard_line">
				{ ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(k => <Key sKey={k} clickHandler={clickHandler}/>) }
			</div>
			<div id="second_line" className="keyboard_line">
				{ ["A", "S", "D", "F", "G", "H", "J", "K", "L"].map(k => <Key sKey={k} clickHandler={clickHandler}/>) }
			</div>
			<div id="third_line" className="keyboard_line">
				<Key sKey="⏎" bWide={false} style={{ backgroundColor: "#6aaa64" }} clickHandler={clickHandler}/>
				{ ["Z", "X", "C", "V", "B", "N", "M"].map(k => <Key sKey={k} clickHandler={clickHandler}/>) }
				<Key sKey="⌫" bWide={false} clickHandler={clickHandler}/>
			</div>
		</div>
	);
}

export default Keyboard;