# byte-packet

![npm](https://img.shields.io/npm/v/byte-packet)

## Overview

A `BytePacket` is a data structure designed to encapsulate and manage binary data (bytes) in a compact and secure format. It is used in situations where you need to handle and transmit small pieces of data, ensuring that the integrity of the data is maintained through checksum validation. byte-packet is a lightweight utility module designed for generating, manipulating, and validating BytePacket objects in Node.js or the browser. Emphasis on performance, minimalism, and ease of integration.

The name byte-packet comes from this library's use of byte arrays (`Uint8Array`)as the central store of data. Uint8Array's are memory efficient, highly compatible, and interoperable. 

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

#### Generating a BytePacket

```javascript
const BytePacket = require('byte-packet');

// Example payload
const payload = new Uint8Array([1, 2, 3, 4]);

// Generate a packet
const packet = BytePacket.generatePacket(payload);

console.log(packet); 
/**
 * Output:
 * BytePacket: {packet: Uint8Array(7) [ 32, 0, 1, 2, 3, 4, 8 ] }
 * 
 * Explanation of Output:
 * [32] is the header; 32 = 0b00100000 where 0b001_____ is the 3 bit checksumSize (defaults = 1) and 0b___00000 is the 5-bit flag (default = 0).
 * [0, 1, 2, 3, 4] is the payload, i.e., the data.
 * [8] is the checksum = first n bytes of sha256(payload) where n is the   * checksumSize.
 */
```

#### Generating a Random Packet

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

#### Decoding a BytePacket from Base58

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

## API: `class BytePacket`

#### Constructor

##### `new BytePacket(packet)`

- **Description**: Creates a `BytePacket` instance from the specified `Uint8Array` packet data.
- **Parameters**:
  - `packet` (Uint8Array): The binary data to be encapsulated in the `BytePacket`.
- **Returns**: A new `BytePacket` instance.

#### Properties

##### `packet`

- **Description**: The entire `Uint8Array` representing the BytePacket, including the header, payload, and checksum.
- **Type**: `Uint8Array`
- **Access**: Read-only

##### `header`

- **Description**: Retrieves the header component of the BytePacket.
- **Returns**: `Uint8Array` - A `Uint8Array` containing the header.

##### `checksumSize`

- **Description**: Retrieves the size of the checksum based on the information in the header.
- **Returns**: `number` - The size of the checksum in bytes.

##### `length`

- **Description**: Retrieves the total length of the BytePacket, including the header, payload, and checksum.
- **Returns**: `number` - The length of the BytePacket in bytes.

##### `payloadSize`

- **Description**: Retrieves the size of the payload portion of the BytePacket.
- **Returns**: `number` - The size of the payload in bytes.

##### `payload`

- **Description**: Retrieves the payload component of the BytePacket.
- **Returns**: `Uint8Array` - A `Uint8Array` containing the payload.

##### `checksum`

- **Description**: Retrieves the checksum component of the BytePacket.
- **Returns**: `Uint8Array` - A `Uint8Array` containing the checksum.

##### `flag`

- **Description**: Retrieves the flag value stored in the header.
- **Returns**: `number` - The 5-bit flag value.

##### `isValid`

- **Description**: Checks whether the BytePacket is valid by verifying the checksum against its payload.
- **Returns**: `boolean` - `True` if the packet is valid; otherwise, `False`.

##### `encodeBase58`

- **Description**: Encodes the BytePacket into a Base58 string.
- **Returns**: `string` - The Base58-encoded string representing the BytePacket.

#### Methods

##### `slice(start=0, end=this.packet.length)`

- **Description**: Extracts a slice of the BytePacket.
- **Parameters**:
  - `start` (number): The zero-based index at which to begin extraction. Default is `0`.
  - `end` (number): The zero-based index before which to end extraction. Default is the length of the packet.
- **Returns**: `Uint8Array` - A `Uint8Array` slice of the BytePacket.

#### Static Methods

##### `static calculateChecksum(payload, size)`

- **Description**: Calculates a checksum for the given payload.
- **Parameters**:
  - `payload` (Uint8Array): The data for which the checksum is to be calculated.
  - `size` (number): The size of the checksum to generate.
- **Returns**: `Uint8Array` - A `Uint8Array` containing the calculated checksum.

##### `static generateHeader(checksumSize, flag)`

- **Description**: Generates a 1-byte header based on the checksum size and flag.
- **Parameters**:
  - `checksumSize` (number): A 3-bit value (0-7) representing the checksum size.
  - `flag` (number): A 5-bit value (0-31) representing additional flags.
- **Returns**: `Uint8Array` - A `Uint8Array` containing the 1-byte header.

##### `static generateRandomPayload(size)`

- **Description**: Generates a random `Uint8Array` payload of the specified size.
- **Parameters**:
  - `size` (number): The size of the payload to generate.
- **Returns**: `Uint8Array` - A `Uint8Array` filled with random values.

##### `static Uint8ArraysEqual(arr1, arr2)`

- **Description**: Compares two `Uint8Array` objects for equality in both length and content.
- **Parameters**:
  - `arr1` (Uint8Array): The first `Uint8Array` to compare.
  - `arr2` (Uint8Array): The second `Uint8Array` to compare.
- **Returns**: `boolean` - `True` if the arrays are equal; otherwise, `False`.

##### `static checkPair(payload, checksum)`

- **Description**: Validates a payload against its checksum.
- **Parameters**:
  - `payload` (Uint8Array): The data to be validated.
  - `checksum` (Uint8Array): The checksum to validate against.
- **Returns**: `boolean` - `True` if the checksum is valid; otherwise, `False`.

##### `static combineUint8Arrays(arrays)`

- **Description**: Combines multiple `Uint8Array` objects into a single `Uint8Array`.
- **Parameters**:
  - `arrays` (Uint8Array[]): An array of `Uint8Array` instances to combine.
- **Returns**: `Uint8Array` - A single `Uint8Array` containing the concatenated data.

##### `static generatePacket(payload, checksumSize=1, flag=0)`

- **Description**: Generates a `BytePacket` from a payload, checksum size, and flag.
- **Parameters**:
  - `payload` (Uint8Array): The data to be included in the packet.
  - `checksumSize` (number, optional): The size of the checksum in bytes. Default is `1` byte.
  - `flag` (number, optional): The flag to include in the header. Default is `0`.
- **Returns**: `BytePacket` - The generated `BytePacket`.

##### `static generateRandomPacket(payloadSize, checksumSize, flag)`

- **Description**: Generates a random `BytePacket` with a specified payload size, checksum size, and header flag.
- **Parameters**:
  - `payloadSize` (number): The size of the payload to generate.
  - `checksumSize` (number): The size of the checksum to generate.
  - `flag` (number): The flag value to include in the header.
- **Returns**: `BytePacket` - The generated `BytePacket`.

##### `static decodeBase58(base58)`

- **Description**: Decodes a Base58-encoded string into a `BytePacket`.
- **Parameters**:
  - `base58` (string): The Base58-encoded string to decode.
- **Returns**: `BytePacket` - The decoded `BytePacket`.
- **Throws**: `Error` - If the decoded packet is not valid.

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
npm run test
```

**Lint your changes:** Lint your changes with the eslint.config.js file for consistency accross the library.
```bash
npm install --save-dev eslint
npm run lint

#Or if you want to eslint to fix:

npm run lint:fix
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

I believe in the importance of writing code as human-friendly as possible. I am an amateur with much to learn, I am dedicated to improving my skills and would appreciate any feedback or guidance from the community.

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
   - **Suggested Improvement:** Add methods to generate QR codes.