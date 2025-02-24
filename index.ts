import crypto from "crypto";

// const hash = crypto.createHash('sha256')
// hash.update("Hello World !")
// console.log(hash.digest("hex"));

type Transaction = {
    hash: string;
    from: string;
    to: string;
    value: number;
};

interface Block {
    index: number;
    timestamp: Date;
    data: Transaction[];
    previousHash: string;
    hash: string;

    calculateHash(): string;
}

interface Blockchain {
    chain: Block[];

    addBlock(block: Block): void;
    createGenesisBlock(): Block;
}

class Block implements Block {
    constructor(
        public index: number,
        public data: Transaction[],
        public previousHash: string
    ) {
        this.timestamp = new Date();
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        const data =
            this.index +
            this.timestamp.toISOString() +
            JSON.stringify(this.data) +
            this.previousHash;
        return crypto.createHash("sha256").update(data).digest("hex");
    }
}

// console.log({ genesisBlock });

class Blockchain implements Blockchain {
    chain: Block[] = [];

    constructor() {
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
}

const blockchain = new Blockchain();
const tx1 = blockchain.createTransaction("Alice", "Bob", 100);
const tx2 = blockchain.createTransaction("Camille", "Cindy", 100);
const block1 = new Block(0, [tx1, tx2], "");
blockchain.addBlock(block1);

// console.log({ blockchain });
console.log(blockchain.chain);

