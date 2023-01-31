import { atom } from "recoil";

const wordState = atom({
	key: "wordState",
	default: [""]
});

export default wordState;