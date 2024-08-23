import { atom } from "jotai";
import { Tickets } from "./types";

export const ticketsAtom = atom<Tickets[]>([]);
ticketsAtom.debugLabel = "Tickets";
