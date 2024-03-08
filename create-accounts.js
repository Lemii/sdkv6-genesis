const { writeFileSync } = require('fs');
const { cryptography, passphrase } = require('lisk-sdk');
const appRoot = require('app-root-path');
const path = require('path');

const DERIVATION_PATH = "m/44'/134'/0'";
const NUM_OF_ACCOUNTS = 21;

const createAccount = async () => {
	const mnemonic = passphrase.Mnemonic.generateMnemonic();

	const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
		mnemonic,
		DERIVATION_PATH,
	);
	const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);
	const address = cryptography.address.getAddressFromPrivateKey(privateKey);

	return {
		address: address.toString('hex'),
		lsk32address: cryptography.address.getLisk32AddressFromAddress(address),
		publicKey: publicKey.toString('hex'),
		passphrase: mnemonic,
	};
};

const main = async () => {
	const accounts = [];

	for (let i = 0; i < NUM_OF_ACCOUNTS; i++) {
		const account = await createAccount();
		accounts.push(account);
	}

	const sorted = accounts.sort((a, b) => (a.address > b.address ? 1 : -1));

	writeFileSync(
		`${path.join(appRoot.toString(), 'scripts', 'output', 'accounts.json')}`,
		JSON.stringify(sorted, null, 2),
	);
};

main();
