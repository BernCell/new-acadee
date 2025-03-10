import { Transaction } from "./Transaction";

export interface BlockInterface {
    index: number;
    timestamp: Date;
    data: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;

    calculateHash(): string;
    mine(difficulty: number): void;
}
