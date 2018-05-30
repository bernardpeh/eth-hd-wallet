# eth-hd-wallet

[![Build Status](https://secure.travis-ci.org/meth-project/eth-hd-wallet.svg?branch=master)](http://travis-ci.org/meth-project/eth-hd-wallet)
[![NPM module](https://badge.fury.io/js/eth-hd-wallet.svg)](https://badge.fury.io/js/eth-hd-wallet)

Features:
* Lightweight, works in Node.js and browsers
* Supports custom-generated mnemonics
* Batch-generate addresses in iterations
* Sign transactions
* Comprehensive test coverage

## Installation

```shell
npm install https://github.com/bernardpeh/eth-hd-wallet
npm install

# To run the scripts for example
# node scripts/createWallet.
```

## API

**(static) fromMnemonic(): Generate wallet from mnemonic**

```js
const { generateMnemonic, EthHdWallet } = require('eth-hd-wallet')

const wallet = EthHdWallet.fromMnemonic(generateMnemonic())

console.log( wallet instanceof EthHdWallet ); /* true */
*/
```

**generateAddress(): Generating single address**

```js
// generate 3rd address
console.log( wallet.generateAddress(2) )

/*
[
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
]
*/


**generateAddresses(): Generating addresses**

```js
// generate 2 addresses
console.log( wallet.generateAddresses(2) )

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
]
*/
```

**discardAddresses(): Discarding addresses**

```js
// generate 5 addresses
wallet.generateAddresses(5)
// discard the last 2 (leaving just the first 3)
console.log( wallet.discardAddresses(2) )

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
]
*/
```

_Note: the next time you run `generateAddresses()` it will again generate
those discarded addresses_.

**getAddresses(): Get all generated addresses**

```js
wallet.generateAddresses(2)
wallet.generateAddresses(3)

// get all addresses
console.log( wallet.getAddresses() )

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
  '0xabc2bca51709b8615147352c62420f547a63a00c',
  '0x26042cb13cc4140a281c0fcc7464074c5e9fd0b4',
  '0x5d0d1a012a3ab2b3424c2023246d8c834bf599d9'
]
*/
```

**hasAddress(): Check if given address exists in current list of generated addresses**

```js
wallet.generateAddresses(2)
wallet.generateAddresses(3)

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
  '0xabc2bca51709b8615147352c62420f547a63a00c',
  '0x26042cb13cc4140a281c0fcc7464074c5e9fd0b4',
  '0x5d0d1a012a3ab2b3424c2023246d8c834bf599d9'
]
*/

wallet.hasAddress('0x1efd1a012a3ab2b3424c2023246d8c834bf58723') /* false */
wallet.hasAddress('0x26042cb13cc4140a281c0fcc7464074c5e9fd0b4') /* true */
```

**getAddressCount(): Get no. of addresses**

```js
wallet.generateAddresses(2)
wallet.generateAddresses(3)

console.log( wallet.getAddressCount() ) /* 5 */
```

**sign(): Sign a transaction**

```js
const rawTx = wallet.sign({
  from: '0x...',
  to: '0x...',
  value: 200000000000000000,
  nonce: 0x0,
  gasPrice: 50000000000,
  gasLimit: 21000,
  chainId: 1 /* see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md */
})

console.log( rawTx ) /* "0x...." */

web3.eth.sendRawTransaction(rawTx, (err) => { ... })
```

## Developing

Ensure you have [geth](https://github.com/ethereum/go-ethereum) installed and
available in your `PATH`.

* To run tests: `yarn test`
* Tests with coverage: `yarn test:coverage`
* Tests with watcher: `yarn test:watch`
* Linter: `yarn lint`
* Build `dist/`: `yarn build`

_Note: If you've never installed `geth` before then make
sure you run `geth makedag 0 ~/.ethash` to generate the DAG needed for mining,
otherwise the tests will timeout._

## References

* https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction
* https://github.com/ethereum/EIPs/issues/85
* https://github.com/MetaMask/metamask-extension/issues/640

## Quick Recipes
```
# use web3 1.0

# const Utils = require('web3-utils');
# let txTransfer = {};
# txTransfer.from = from.address;
# txTransfer.to = to.address;
# txTransfer.gas = GasLimit;
# txTransfer.value = amount;
# txTransfer.data = Utils.toHex('free text data');
# web3.eth.sendTransaction(txTransfer);

web3.fromWei(web3.eth.getBalance(web3.eth.coinbase),"ether").toString()
web3.eth.sendTransaction({from: web3.eth.coinbase, to: 'xx', value: web3.toWei(80,'ether')})
web3.eth.sendTransaction({from:web3.eth.accounts[0],to:web3.eth.accounts[1],value:web3.toWei(0.1,'ether'),data:web3.toHex('John Doe sent you a message')})
```



## License

MIT - see [LICENSE.md](LICENSE.md)
