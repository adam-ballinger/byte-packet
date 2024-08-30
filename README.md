# byte-packet

![npm](https://img.shields.io/npm/v/byte-packet)
![license](https://img.shields.io/npm/l/byte-packet)
![downloads](https://img.shields.io/npm/dw/byte-packet)

## Overview

`byte-packet` is a lightweight utility module designed for generating, manipulating, and validating byte packets with cryptographic security in Node.js or the browser. It integrates payload generation, checksum calculation, and flexible byte array handling. Emphasis on performance, minimalism, and ease of integration.

## Features

- **Cryptographically Secure Random Payloads:** Generate secure random data for cryptographic purposes.
- **Checksum Calculation and Validation:** Ensure data integrity with easy-to-use checksum utilities.
- **Flexible Byte Packet Management:** Split, combine, and manage byte arrays with custom headers and flags.
- **Base58 Encoding/Decoding:** Encode and decode byte packets using Base58, commonly used in blockchain applications.

## Installation

```bash
npm install byte-packet
```

## Usage

#### Generating a Random Payload

```javascript
const { generateRandomPayload } = require('byte-packet');

const payload = generateRandomPayload(16); // Generates a 16-byte random payload
console.log(payload);
```

#### Calculating a Checksum

```javascript
const { calculateChecksum } = require('byte-packet');

const payload = new Uint8Array([1, 2, 3, 4, 5]);
const checksum = calculateChecksum(payload, 3); // Generates a 3-byte checksum
console.log(checksum);
```

#### Validating a Packet

```javascript
const { checkPacket, generateRandomPacket } = require('byte-packet');

const packet = generateRandomPacket(16, 3, 1); // Generates a random packet with a 16-byte payload, 3-byte checksum, and a flag
const isValid = checkPacket(packet);
console.log(`Packet is valid: ${isValid}`);
```

#### Encoding and Decoding with Base58

```javascript
const { encodeBase58, decodeBase58, generateRandomPacket } = require('byte-packet');

const packet = generateRandomPacket(16, 3, 1);
const encoded = encodeBase58(packet);
console.log(`Encoded: ${encoded}`);

const decoded = decodeBase58(encoded);
console.log(`Decoded packet is valid: ${checkPacket(decoded)}`);
```

## API

###### generatePacket(payload, [checksumSize=1], [flag=0])
The generatePacket function creates a byte packet from the specified payload, checksum size, and flag. This packet can be used for various purposes, such as encoding data for transmission, storage, or further processing.

- **Parameters:**
   - `payload` (Uint8Array):The data to be included in the packet. This is the core content around which the packet is generated.
   - `checksumSize` (number) (optional, default: 1): The size of the checksum in bytes. This determines how many bytes will be used for the checksum, which is appended to the packet.
   - `flag` (number) (optional, default: 0): A flag used in the header for additional packet information. This can be used to encode metadata or control information about the packet.
- **Returns:** `Uint8Array`

###### `generateRandomPayload(size)`
Generates a random `Uint8Array` payload of the specified size.

- **Parameters:**
  - `size` (number): The size of the `Uint8Array` to generate.
- **Returns:** `Uint8Array`

###### `calculateChecksum(payload, size)`
Calculates a checksum for the given payload.

- **Parameters:**
  - `payload` (Uint8Array): The input payload.
  - `size` (number): The size of the checksum to generate.
- **Returns:** `Uint8Array`

###### `checkPacket(packet)`
Checks the validity of a byte packet by validating its payload and checksum.

- **Parameters:**
  - `packet` (Uint8Array): The byte packet to check.
- **Returns:** `boolean`

###### `generateRandomPacket(payloadSize, checksumSize, flag)`
Generates a random byte packet with a specified payload size, checksum size, and header flag.

- **Parameters:**
  - `payloadSize` (number): The size of the payload to generate.
  - `checksumSize` (number): The size of the checksum to generate.
  - `flag` (number): A flag value to include in the packet header.
- **Returns:** `Uint8Array`

###### `encodeBase58(packet)`
Encodes a byte packet to a Base58-encoded string.

- **Parameters:**
  - `packet` (Uint8Array): The byte packet to encode.
- **Returns:** `string`

###### `decodeBase58(base58)`
Decodes a Base58-encoded string back into a byte packet.

- **Parameters:**
  - `base58` (string): The Base58-encoded string to decode.
- **Returns:** `Uint8Array`
- **Throws:** Error if the decoded packet is not valid.

## Use Cases

- **Cryptographic Applications:** Generate secure tokens, validate message validity, and more.
- **Blockchain/Cryptocurrency:** Create and manage secure data packets, with built-in Base58 support.
- **Networking Protocols:** Easily manage binary data structures for low-level protocol development.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Adam Ballinger - [GitHub](https://github.com/adam-ballinger)

## Version

1.0.0

## To-Do

###### 1. **Configurable Checksum Algorithms**
   - **Current Limitation:** The module currently uses single SHA-256 for checksum calculation.
   - **Suggested Improvement:** Allow users to choose from different cryptographic hash functions (e.g., SHA-1, SHA-512, HMAC) or even provide their custom checksum algorithms. This flexibility could cater to a broader range of security requirements.

###### 2. **Support for Variable-Length Headers**
   - **Current Limitation:** The module uses a fixed-size 1-byte header, which may limit the amount of metadata that can be stored.
   - **Suggested Improvement:** Implement variable-length headers that can store more information, such as versioning, timestamps, or additional flags.

###### 3. **Encryption/Decryption of Payloads**
   - **Current Limitation:** The module focuses on packet generation and validation but does not provide encryption capabilities.
   - **Suggested Improvement:** Add functionality to encrypt and decrypt the payloads using symmetric or asymmetric encryption, which would further secure the data packets during transmission.

###### 4. **Serialization/Deserialization Support**
   - **Current Limitation:** The module does not provide methods to serialize or deserialize packet objects for storage or transmission in different formats (e.g., JSON, binary).
   - **Suggested Improvement:** Add methods to convert packets to and from serialized formats, making it easier to store and transmit them over various protocols.

###### 5. **Packet Integrity and Authenticity Verification**
   - **Current Limitation:** The module verifies the integrity of the packet via checksum but does not handle authenticity.
   - **Suggested Improvement:** Introduce digital signature functionality to verify the authenticity of the packets, ensuring that they have not been tampered with and are from a trusted source.

###### 6. **Extensive Unit Testing and Benchmarking**
   - **Current Limitation:** The module is not extensively tested.
   - **Suggested Improvement:** Develop a comprehensive suite of unit tests covering edge cases, as well as performance benchmarks to give users confidence in the module’s reliability and efficiency.

###### 7. **Support for Different Encoding Schemes**
   - **Current Limitation:** The module currently supports Base58 encoding/decoding.
   - **Suggested Improvement:** Add support for other encoding schemes like Base32, Base64, or Bech32 to make the module more versatile in different application scenarios.

###### 8. **Cross-Platform Compatibility**
   - **Current Limitation:** While intended to be compatible with Node.js or the browser, the module has not been tested in the browser.
   - **Suggested Improvement:** Ensure that the module is fully compatible with both Node.js and browser environments.

###### 9. **Error Correction**
   - **Current Limitation:** Packets can be checked for validity but the data can not be recovered if there is any loss
   - **Suggested Improvement:** Introduce error correction methods such as Reed-Soloman.

###### 10. **Byte-Packet Objects**
   - **Current Limitation:** Currently there is no class for byte-packets.
   - **Suggested Improvement:** Create a class to represent byte-packet objects.
