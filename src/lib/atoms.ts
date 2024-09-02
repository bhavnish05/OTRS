import { atom } from "jotai";
import { Tickets, Username } from "./types";

export const ticketsAtom = atom<Tickets[]>([]);
// export const usernameAtom = atom<Username>("");
ticketsAtom.debugLabel = "Tickets";
// ticketsAtom.debugLabel = "Username";
