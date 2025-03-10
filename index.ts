import crypto from "crypto";
import { Transaction } from "./interfaces/Transaction";
import { Chain } from "./interfaces/Chain";
import { BlockInterface } from "./interfaces/BlockInterface";


interface Block {
    index: number;
    timestamp: Date;
    data: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;

    calculateHash(): string;
    mine(difficulty: number): void;
}




class Block implements BlockInterface {
    constructor(
        public index: number,
        public data: Transaction[],
        public previousHash: string
    ) {
        this.timestamp = new Date();
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(): string {
        const data =
            this.index +
            this.timestamp.toISOString() +
            JSON.stringify(this.data) +
            this.previousHash + this.nonce;
        return crypto.createHash("sha256").update(data).digest("hex");
    }
    mine(difficulty: number): void {
        const target = "0".repeat(difficulty);
        while (!this.hash.startsWith(target)) {
            this.nonce++;
            this.hash = this.calculateHash();
            console.log(`Mining... Nonce: ${this.nonce}, Hash: ${this.hash}`);
            // console.log(this.hash);

        }
    }
}

// console.log({ genesisBlock });

class Blockchain implements Chain {
    chain: Block[] = [];
    difficulty: number;

    constructor(difficulty: number) {
        this.difficulty = difficulty
        const genesisBlock = this.createGenesisBlock();
        this.chain.push(genesisBlock);
    }

    createGenesisBlock(): Block {
        return new Block(0, [], "0");
    }

    addBlock(block: Block): void {
        const newBlock = new Block(
            this.chain.length,
            block.data,
            this.chain[this.chain.length - 1].hash
        );
        newBlock.mine(this.difficulty);
        if (this.isValidHash(newBlock.hash, this.difficulty))
            this.chain.push(newBlock);


    }
    createTransaction(from: string, to: string, value: number): Transaction {
        const hash = crypto
            .createHash("sha256")
            .update(JSON.stringify({ from, to, value }))
            .digest("hex");
        return {
            from,
            to,
            value,
            hash,
        };
    }

    isValidHash(hash: string, difficulty: number): boolean {
        const target = "0".repeat(difficulty);
        return hash.startsWith(target);
    }
}

const blockchain = new Blockchain(2);
const tx1 = blockchain.createTransaction("Alice", "Bob", 100);
const tx2 = blockchain.createTransaction("Camille", "Cindy", 100);
const block1 = new Block(0, [tx1, tx2], "");
const block2 = new Block(0, [tx1, tx2], "");
const block3 = new Block(0, [tx1, tx2], "");
blockchain.addBlock(block1);
console.log("Block 1 added");

blockchain.addBlock(block2);
console.log("Block 2 added");
blockchain.addBlock(block3);
console.log("Block 3 added");
// console.log({ blockchain });
console.log(blockchain.chain);

