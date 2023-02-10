const Block = require('./block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
    const timestamp = "a-date";
    const lastHash = "foo-hash";
    const hash = "bar-hash";
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });
    it('Has a timestamp, lastHash, hash, data property, nonce\'s value and difficulty\'s value', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    })
    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    });
    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data'
        const minedBlock = Block.mineBlock({ lastBlock, data })

        it('returns a Block instances', () => {
            expect(minedBlock instanceof Block).toBe(true);
        })
        it('set the `lastHash` to be the `hash` of lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        })
        it('set the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        })
        it('set a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })
        it('creates a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(
                    cryptoHash(
                        minedBlock.timestamp,
                        minedBlock.nonce,
                        minedBlock.difficulty,
                        lastBlock.hash,
                        data
                    )
                )
        });
        it('set the `hash` that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });
    });

});

