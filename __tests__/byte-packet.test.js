const {
    generatePacket,
    generateRandomPayload,
    calculateChecksum,
    checkPacket,
    generateRandomPacket,
    encodeBase58,
    decodeBase58,
    Uint8ArraysEqual,
    combineUint8Arrays,
    splitPacket,
    info,
    getChecksumSize,
    getFlag
} = require('../index');

describe('byte-packet Module Tests', () => {

    // Test generateRandomPayload
    test('generateRandomPayload generates a Uint8Array of the correct size', () => {
        const size = 16;
        const payload = generateRandomPayload(size);

        expect(payload).toBeInstanceOf(Uint8Array);
        expect(payload).toHaveLength(size);
    });

    // Test calculateChecksum
    test('calculateChecksum generates a checksum of the correct size', () => {
        const payload = new Uint8Array([1, 2, 3, 4, 5]);
        const checksumSize = 3;
        const checksum = calculateChecksum(payload, checksumSize);

        expect(checksum).toBeInstanceOf(Uint8Array);
        expect(checksum).toHaveLength(checksumSize);
    });

    // Test generatePacket
    test('generatePacket generates a valid packet with the correct payload, header, and checksum', () => {
        const payload = new Uint8Array([1, 2, 3, 4, 5]);
        const checksumSize = 3;
        const flag = 1;
        const packet = generatePacket(payload, checksumSize, flag);

        expect(packet).toBeInstanceOf(Uint8Array);

        // Check if the packet can be split correctly
        const { header, payload: extractedPayload, checksum } = splitPacket(packet);
        expect(extractedPayload).toEqual(payload);
        expect(checksum).toHaveLength(checksumSize);
        expect(getChecksumSize(header)).toBe(checksumSize);
        expect(getFlag(header)).toBe(flag);
    });

    // Test generateRandomPacket
    test('generateRandomPacket generates a valid random packet', () => {
        const payloadSize = 16;
        const checksumSize = 3;
        const flag = 2;
        const packet = generateRandomPacket(payloadSize, checksumSize, flag);

        expect(packet).toBeInstanceOf(Uint8Array);

        const { payload, checksum, header } = splitPacket(packet);
        expect(payload).toHaveLength(payloadSize);
        expect(checksum).toHaveLength(checksumSize);
        expect(getFlag(header)).toBe(flag);
        expect(checkPacket(packet)).toBe(true);
    });

    // Test checkPacket
    test('checkPacket correctly validates a packet', () => {
        const payload = new Uint8Array([10, 20, 30, 40, 50]);
        const checksumSize = 2;
        const packet = generatePacket(payload, checksumSize);

        expect(checkPacket(packet)).toBe(true);
    });

    test('checkPacket fails for a tampered packet', () => {
        const payload = new Uint8Array([10, 20, 30, 40, 50]);
        const checksumSize = 2;
        const packet = generatePacket(payload, checksumSize);

        // Tamper with the payload
        packet[1] = 99;

        expect(checkPacket(packet)).toBe(false);
    });

    // Test encodeBase58 and decodeBase58
    test('encodeBase58 and decodeBase58 work correctly', () => {
        const packet = generateRandomPacket(16, 3, 1);
        const encoded = encodeBase58(packet);
        const decoded = decodeBase58(encoded);

        expect(decoded).toBeInstanceOf(Uint8Array);
        expect(checkPacket(decoded)).toBe(true);
        expect(decoded).toEqual(packet);
    });

    test('decodeBase58 throws an error for an invalid packet', () => {
        const invalidBase58 = 'invalidbase58string';

        expect(() => decodeBase58(invalidBase58)).toThrow(Error);
    });

    // Test Uint8ArraysEqual
    test('Uint8ArraysEqual correctly compares two equal arrays', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4]);
        const arr2 = new Uint8Array([1, 2, 3, 4]);

        expect(Uint8ArraysEqual(arr1, arr2)).toBe(true);
    });

    test('Uint8ArraysEqual correctly identifies different arrays', () => {
        const arr1 = new Uint8Array([1, 2, 3, 4]);
        const arr2 = new Uint8Array([1, 2, 3, 5]);

        expect(Uint8ArraysEqual(arr1, arr2)).toBe(false);
    });

    // Test combineUint8Arrays
    test('combineUint8Arrays correctly combines multiple arrays', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([4, 5, 6]);
        const combined = combineUint8Arrays([arr1, arr2]);

        expect(combined).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]));
    });

    // Test splitPacket
    test('splitPacket correctly splits a packet into header, payload, and checksum', () => {
        const payload = new Uint8Array([1, 2, 3, 4, 5]);
        const checksumSize = 2;
        const packet = generatePacket(payload, checksumSize, 1);

        const { header, payload: extractedPayload, checksum } = splitPacket(packet);

        expect(header).toBeInstanceOf(Uint8Array);
        expect(extractedPayload).toEqual(payload);
        expect(checksum).toHaveLength(checksumSize);
    });

    // Test info
    test('info correctly extracts information from a packet', () => {
        const payloadSize = 16;
        const checksumSize = 3;
        const flag = 2;
        const packet = generateRandomPacket(payloadSize, checksumSize, flag);

        const packetInfo = info(packet);

        expect(packetInfo).toEqual({
            checksumSize,
            flag,
            payloadSize,
            isValid: true,
        });
    });

    // Edge Case Tests
    // Test with an empty payload
    test('generatePacket works with an empty payload', () => {
        const payload = new Uint8Array([]);
        const packet = generatePacket(payload, 1, 1);

        expect(packet).toBeInstanceOf(Uint8Array);
        expect(packet).toHaveLength(2); // 1-byte header + 1-byte checksum
        expect(checkPacket(packet)).toBe(true);
    });

    // Test with large payload and checksum size
    test('generatePacket works with a large payload and checksum size', () => {
        const payload = generateRandomPayload(1024); // 1KB payload
        const checksumSize = 7; // 7-byte checksum (e.g., SHA-256)
        const packet = generatePacket(payload, checksumSize, 1);

        expect(packet).toBeInstanceOf(Uint8Array);
        expect(packet).toHaveLength(1 + 1024 + 7); // 1-byte header + payload + 7-byte checksum
        expect(checkPacket(packet)).toBe(true);
    });

    // Test invalid checksum size
    test('generatePacket throws an error for invalid checksum size', () => {
        const payload = new Uint8Array([1, 2, 3, 4, 5]);

        expect(() => generatePacket(payload, 8, 1)).toThrow(Error); // Invalid checksum size
    });

    // Test invalid flag size
    test('generatePacket throws an error for invalid flag size', () => {
        const payload = new Uint8Array([1, 2, 3, 4, 5]);

        expect(() => generatePacket(payload, 1, 32)).toThrow(Error); // Invalid flag size
    });
});
