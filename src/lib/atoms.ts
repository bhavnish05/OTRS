import { atom } from "jotai";
import { Customers, Tickets } from "./types";

export const ticketsAtom = atom<Tickets[]>([]);
export const usernameAtom = atom<string>("");
export const customersAtom = atom<Customers[]>([]);
ticketsAtom.debugLabel = "Tickets";
ticketsAtom.debugLabel = "Username";
ticketsAtom.debugLabel = "Customers";
