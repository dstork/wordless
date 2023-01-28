import { React } from "react";

import "./Key.css";

function Key({sKey, bWide}) {

	return (
		<div className={"key" + (bWide ? " wide" : "")}>{sKey}</div>
	);
}

export default Key;