# byte-packet

![npm](https://img.shields.io/npm/v/byte-packet)
![license](https://github.com/adam-ballinger/byte-packet/blob/main/LICENSE)
![downloads](https://img.shields.io/npm/dw/byte-packet)

## Overview

`byte-packet` is a lightweight utility module designed for generating, manipulating, and validating packets of data with cryptographic security in Node.js or the browser. It integrates random payload generation, checksum calculation, checksum validation, and more. Emphasis on performance, minimalism, and ease of integration.

## Features

- **Cryptographically Secure Random Payloads:** Generate secure random data with randomness that meets cryptographic standards.
- **Checksum Calculation and Validation:** Create data packets with easy-to-use checksum utilities.
- **Flexible Byte Packet Management:** Split, combine, and manage byte arrays packets with custom metadata flags, payload sizes, and checksum sizes.
- **Encoding/Decoding:** Encode and decode data using Base58 and others.

## Installation

```bash
npm install byte-packet
```

## Usage

```javascript
const { generatePacket } = require('byte-packet'); // Import the generatePacket function

const data = new Uint8Array([0, 1, 2, 3, 4]); // Example data as a Uint8Array

const packet = generatePacket(data); // Generate a packet using the data

console.log('Generated Packet:', packet); // Display the generated packet

/**
 * Output:
 * Generated Packet: Uint8Array(7) [ 32, 0, 1, 2, 3, 4, 8 ]
 * 
 * [32] (Header)
 * [0, 1, 2, 3, 4] (Payload)
 * [8] (Checksum)
 * 
```

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

const packet = generateRandomPacket(16, 3, 1); // Generates a random packet with a 16-byte payload, 3-byte checksum, and a flag = 1
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

## Issues and Feedback
If you have suggestions on how to make this module more useful or if you encounter any issues, please let me know by opening a new issue here [Issues](https://github.com/adam-ballinger/byte-packet/issues). I’m eager for feedback and to collaborate on making byte-packet more useful.

## Contributing
I’d love to welcome contributions to the byte-packet module. Whether it’s bug fixes, new features, or improvements to the existing codebase, feedback and input is highly valued.

#### How to Contribute
**Fork the Repository:** Start by forking the repo to your own GitHub account.
Clone the Repo: Clone your fork locally to work on it.
```bash
git clone https://github.com/your-username/byte-packet.git
cd byte-packet
```

**Create a Branch:** Create a new branch to work on your changes.
```bash
git checkout -b my-new-feature
```

**Make Changes:** Implement your changes or additions.
**Run Tests:** If you add new features or fix bugs, please run the tests to ensure the code remains stable. Write new tests for new features.
```bash
npm install --save-dev jest
npm jest
```

**Commit and Push:** Commit your changes and push them to your forked repository.
```bash
git add .
git commit -m "Description of your changes"
git push origin my-new-feature
```
**Create a Pull Request:** Once your changes are ready, create a pull request to the main repository. You can do this by visiting this link [Pull Requests](https://github.com/adam-ballinger/byte-packet/pulls).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Adam Ballinger - [GitHub](https://github.com/adam-ballinger)

I'm excited about Node.js and npm. My focus is on writing code that works seamlessly in both Node.js and the browser, with a strong emphasis on creating small, lightweight packages. My goal is to ensure that everything I write is easy to understand, even for beginners, quick to implement, and adheres to best practices and conventions.

I believe in the importance of writing code with people in mind—code should be as human-friendly as possible. I am an amateur with much to learn, I am dedicated to improving my skills and would appreciate any feedback or guidance from the community.

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
   - **Suggested Improvement:** Introduce optional error correction methods such as Reed-Soloman.

###### 10. **Object Oriented byte-packets**
   - **Current Limitation:** Currently there is no class for byte-packets.
   - **Suggested Improvement:** Create a class to represent byte-packet objects.
