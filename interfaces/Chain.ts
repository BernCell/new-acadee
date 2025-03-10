import { BlockInterface } from "./BlockInterface";

export interface Chain {
    chain: BlockInterface[];
    difficulty: number;

    addBlock(block: BlockInterface): void;
    createGenesisBlock(): BlockInterface;
}