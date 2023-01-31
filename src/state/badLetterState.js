import { atom } from "recoil";

const badLetterState = atom({
	key: "badLetterState",
	default: ""
});

export default badLetterState;