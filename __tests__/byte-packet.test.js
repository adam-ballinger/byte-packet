const BytePacket = require('../index.js');  // Adjust the path to where BytePacket is located
const bs58 = require('bs58').default;

describe('BytePacket', () => {

    describe('Constructor', () => {
        it('should create a BytePacket with a valid packet', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 0);
            expect(bytePacket.packet).toBeInstanceOf(Uint8Array);
            expect(bytePacket.packet.length).toBe(payload.length + 2);  // 1 byte header + 1 byte checksum
            expect(bytePacket.isValid).toBe(true);
        });
    });

    describe('header getter', () => {
        it('should return the correct header', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 5);
            expect(bytePacket.header).toBeInstanceOf(Uint8Array);
            expect(bytePacket.header.length).toBe(1);
            expect(bytePacket.header[0]).toBe((1 << 5) | 5);
        });
    });

    describe('checksumSize getter', () => {
        it('should return the correct checksum size', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 3, 0);
            expect(bytePacket.checksumSize).toBe(3);
        });
    });

    describe('length getter', () => {
        it('should return the correct packet length', () => {
            const payload = new Uint8Array([1, 2, 3, 4, 5]);
            const bytePacket = BytePacket.generatePacket(payload, 2, 0);
            expect(bytePacket.length).toBe(8);  // 1 byte header + 5 byte payload + 2 byte checksum
        });
    });

    describe('payloadSize getter', () => {
        it('should return the correct payload size', () => {
            const payload = new Uint8Array([1, 2, 3, 4]);
            const bytePacket = BytePacket.generatePacket(payload, 2, 0);
            expect(bytePacket.payloadSize).toBe(payload.length);
        });
    });

    describe('payload getter', () => {
        it('should return the correct payload', () => {
            const payload = new Uint8Array([10, 20, 30]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 0);
            expect(bytePacket.payload).toEqual(payload);
        });
    });

    describe('checksum getter', () => {
        it('should return the correct checksum', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 2, 0);
            const expectedChecksum = BytePacket.calculateChecksum(payload, 2);
            expect(bytePacket.checksum).toEqual(expectedChecksum);
        });
    });

    describe('slice method', () => {
        it('should correctly slice the packet', () => {
            const payload = new Uint8Array([1, 2, 3, 4, 5]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 0);
            const slice = bytePacket.slice(1, 4);
            expect(slice).toEqual(new Uint8Array([1, 2, 3]));
        });

        it('should return the whole packet if no arguments are passed', () => {
            const payload = new Uint8Array([1, 2, 3, 4, 5]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 0);
            expect(bytePacket.slice()).toEqual(bytePacket.packet);
        });
    });

    describe('flag getter', () => {
        it('should return the correct flag value', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 31);  // flag = 31 (all bits set)
            expect(bytePacket.flag).toBe(31);
        });
    });

    describe('isValid getter', () => {
        it('should return true for a valid packet', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 0);
            expect(bytePacket.isValid).toBe(true);
        });

        it('should return false for an invalid packet', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const invalidPacket = new Uint8Array([255, 1, 2, 3, 4]);  // Invalid checksum
            const bytePacket = new BytePacket(invalidPacket);
            expect(bytePacket.isValid).toBe(false);
        });
    });

    describe('encodeBase58 getter', () => {
        it('should return the correct Base58 encoded string', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 0);
            const encoded = bytePacket.encodeBase58;
            const decodedPacket = BytePacket.decodeBase58(encoded);
            expect(decodedPacket.packet).toEqual(bytePacket.packet);
        });
    });

    describe('calculateChecksum static method', () => {
        it('should return the correct checksum', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const checksum = BytePacket.calculateChecksum(payload, 2);
            expect(checksum.length).toBe(2);
        });

        it('should return a checksum of the correct size', () => {
            const payload = new Uint8Array([1, 2, 3]);
            for (let size = 1; size <= 7; size++) {
                const checksum = BytePacket.calculateChecksum(payload, size);
                expect(checksum.length).toBe(size);
            }
        });
    });

    describe('generateHeader static method', () => {
        it('should generate the correct header', () => {
            const header = BytePacket.generateHeader(3, 15);
            expect(header).toBeInstanceOf(Uint8Array);
            expect(header.length).toBe(1);
            expect(header[0]).toBe((3 << 5) | 15);
        });

        it('should throw an error for invalid checksum size', () => {
            expect(() => BytePacket.generateHeader(8, 0)).toThrow();
        });

        it('should throw an error for invalid flag value', () => {
            expect(() => BytePacket.generateHeader(0, 32)).toThrow();
        });
    });

    describe('generateRandomPayload static method', () => {
        it('should generate a payload of the correct size', () => {
            const payload = BytePacket.generateRandomPayload(10);
            expect(payload.length).toBe(10);
        });
    });

    describe('Uint8ArraysEqual static method', () => {
        it('should return true for equal Uint8Arrays', () => {
            const arr1 = new Uint8Array([1, 2, 3]);
            const arr2 = new Uint8Array([1, 2, 3]);
            expect(BytePacket.Uint8ArraysEqual(arr1, arr2)).toBe(true);
        });

        it('should return false for different Uint8Arrays', () => {
            const arr1 = new Uint8Array([1, 2, 3]);
            const arr2 = new Uint8Array([4, 5, 6]);
            expect(BytePacket.Uint8ArraysEqual(arr1, arr2)).toBe(false);
        });
    });

    describe('checkPair static method', () => {
        it('should return true for a valid payload-checksum pair', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const checksum = BytePacket.calculateChecksum(payload, 2);
            expect(BytePacket.checkPair(payload, checksum)).toBe(true);
        });

        it('should return false for an invalid payload-checksum pair', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const invalidChecksum = new Uint8Array([255, 255]);
            expect(BytePacket.checkPair(payload, invalidChecksum)).toBe(false);
        });
    });

    describe('combineUint8Arrays static method', () => {
        it('should correctly combine multiple Uint8Arrays', () => {
            const arr1 = new Uint8Array([1, 2]);
            const arr2 = new Uint8Array([3, 4]);
            const combined = BytePacket.combineUint8Arrays([arr1, arr2]);
            expect(combined).toEqual(new Uint8Array([1, 2, 3, 4]));
        });
    });

    describe('generatePacket static method', () => {
        it('should generate a valid BytePacket', () => {
            const payload = new Uint8Array([1, 2, 3, 4, 5]);
            const bytePacket = BytePacket.generatePacket(payload, 2, 0);
            expect(bytePacket).toBeInstanceOf(BytePacket);
            expect(bytePacket.isValid).toBe(true);
        });
    });

    describe('generateRandomPacket static method', () => {
        it('should generate a valid random BytePacket', () => {
            const bytePacket = BytePacket.generateRandomPacket(5, 1, 0);
            expect(bytePacket).toBeInstanceOf(BytePacket);
            expect(bytePacket.payload.length).toBe(5);
            expect(bytePacket.checksum.length).toBe(1);
            expect(bytePacket.isValid).toBe(true);
        });
    });

    describe('decodeBase58 static method', () => {
        it('should decode a valid Base58 string into a BytePacket', () => {
            const payload = new Uint8Array([1, 2, 3]);
            const bytePacket = BytePacket.generatePacket(payload, 1, 0);
            const encoded = bytePacket.encodeBase58;
            const decodedPacket = BytePacket.decodeBase58(encoded);
            expect(decodedPacket.packet).toEqual(bytePacket.packet);
        });

        it('should throw an error for an invalid Base58 string', () => {
            expect(() => BytePacket.decodeBase58('invalidbase58')).toThrow();
        });
    });

});
