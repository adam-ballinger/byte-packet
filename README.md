# byte-packet

![npm](https://img.shields.io/npm/v/byte-packet)

## Overview

A `BytePacket` is a data structure designed to encapsulate and manage binary data (bytes) in a compact and secure format. It is used in situations where you need to handle and transmit small pieces of data, ensuring that the integrity of the data is maintained through checksum validation. byte-packet is a lightweight utility module designed for generating, manipulating, and validating BytePacket objects in Node.js or the browser. Emphasis on performance, minimalism, and ease of integration.

## Features

- **Cryptographically Secure Random Payloads:** Generate secure random data with randomness that meets cryptographic standards.
- **Checksum Calculation and Validation:** Each BytePacket includes a checksum to ensure data integrity. Corruption to the data will result in an invalid payload/checksum pair.
- **Flexible Byte Packet Management:** Split, combine, and manage byte arrays packets with custom metadata flags, payload sizes, and checksum sizes.
- **Encoding/Decoding:** Encode and decode data using Base58 for compact representation.
- **Header Flags:** The `flag` field in the header can be used to store meta data about the packet.

## Installation

```bash
npm install byte-packet
```

## Usage

```javascript
const BytePacket = require('byte-packet');

// Example payload
const payload = new Uint8Array([1, 2, 3, 4]);

// Generate a packet with a 2-byte checksum and a flag value of 3
const packet = BytePacket.generatePacket(payload);

console.log(packet); 
/**
 * Output:
 * BytePacket: {packet: Uint8Array(7) [ 32, 0, 1, 2, 3, 4, 8 ] }
 * 
 * Explanation of Output:
 * [32] is the header; 32 = 0b00100000 where 0b001_____ is the checksumSize (defaults to 1) and 0b___00000 is the flag (defaults to 0).
 * [0, 1, 2, 3, 4] is the payload, i.e., the data.
 * [8] is the checksum = first n bytes of sha256(payload) where n is the   * checksumSize.
 */
```

#### Generating a Random Payload

```javascript
const BytePacket = require('byte-packet');

// Generate a random packet with a 10-byte payload, 2-byte checksum, and flag value of 1
const randomPacket = BytePacket.generateRandomPacket(10, 2, 1);

console.log(randomPacket);

```

#### Validating a Packet

```javascript
const BytePacket = require('byte-packet');

// Example payload
const payload = new Uint8Array([0x01, 0x02, 0x03]);

// Generate a packet
const packet = BytePacket.generatePacket(payload);

// Check if the packet is valid
console.log(packet.isValid); // true
```

#### Getting the flag value of a packet
```javascript
const BytePacket = require('byte-packet');

// Example payload
const payload = new Uint8Array([0x01, 0x02, 0x03]);

// Generate a packet with a flag value of 5
const packet = BytePacket.generatePacket(payload, 1, 5);

console.log(packet.flag); // 5
```


#### Encoding  wth Base58

```javascript
const BytePacket = require('byte-packet');

// Example payload
const payload = new Uint8Array([0x01, 0x02, 0x03]);

// Generate a packet
const packet = BytePacket.generatePacket(payload);

// Get the Base58 encoded string
const encoded = packet.encodeBase58();

console.log(encoded); // Base58 string representation of the packet
```

#### Decoding with Base58

```javascript
const BytePacket = require('byte-packet');

// Example Base58 string
const encoded = '3vQB7B6MrGQZaxCuFg4oh';

// Decode the Base58 string back into a BytePacket
try {
    const decodedPacket = BytePacket.decodeBase58(encoded);
    console.log(decodedPacket.packet); // Uint8Array of the decoded packet
} catch (error) {
    console.error(error.message);
}
```

## API

API documentation coming soon.

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

#### 1. **Configurable Checksum Algorithms**
   - **Current Limitation:** The module currently uses single SHA-256 for checksum calculation.
   - **Suggested Improvement:** Allow users to choose from different cryptographic hash functions (e.g., SHA-1, SHA-512, HMAC) or even provide their custom checksum algorithms. This flexibility could cater to a broader range of security requirements.

#### 2. **Support for Variable-Length Headers**
   - **Current Limitation:** The module uses a fixed-size 1-byte header, which may limit the amount of metadata that can be stored.
   - **Suggested Improvement:** Implement variable-length headers that can store more information, such as versioning, timestamps, or additional flags.

#### 3. **Encryption/Decryption of Payloads**
   - **Current Limitation:** The module focuses on packet generation and validation but does not provide encryption capabilities.
   - **Suggested Improvement:** Add functionality to encrypt and decrypt the payloads using symmetric or asymmetric encryption, which would further secure the data packets during transmission.

#### 4. **Serialization/Deserialization Support**
   - **Current Limitation:** The module does not provide methods to serialize or deserialize packet objects for storage or transmission in different formats (e.g., JSON, binary).
   - **Suggested Improvement:** Add methods to convert packets to and from serialized formats, making it easier to store and transmit them over various protocols.

#### 5. **Packet Integrity and Authenticity Verification**
   - **Current Limitation:** The module verifies the integrity of the packet via checksum but does not handle authenticity.
   - **Suggested Improvement:** Introduce digital signature functionality to verify the authenticity of the packets, ensuring that they have not been tampered with and are from a trusted source.

#### 6. **Extensive Unit Testing and Benchmarking**
   - **Current Limitation:** The module is not extensively tested.
   - **Suggested Improvement:** Develop a comprehensive suite of unit tests covering edge cases, as well as performance benchmarks to give users confidence in the module’s reliability and efficiency.

#### 7. **Support for Different Encoding Schemes**
   - **Current Limitation:** The module currently supports Base58 encoding/decoding.
   - **Suggested Improvement:** Add support for other encoding schemes like Base32, Base64, or Bech32 to make the module more versatile in different application scenarios.

#### 8. **Cross-Platform Compatibility**
   - **Current Limitation:** While intended to be compatible with Node.js or the browser, the module has not been tested in the browser.
   - **Suggested Improvement:** Ensure that the module is fully compatible with both Node.js and browser environments.

#### 9. **Error Correction**
   - **Current Limitation:** Packets can be checked for validity but the data can not be recovered if there is any loss
   - **Suggested Improvement:** Introduce optional error correction methods such as Reed-Soloman.

#### **10. QR Code Generation**
   - **Suggested Improvement:** Add methods to generate QR codes