const appRoot = require('app-root-path');
const { writeFileSync } = require('fs');
const path = require('path');

const validatorsJson = require(`${path.join(
	appRoot.toString(),
	'scripts',
	'output',
	'validators.json',
)}`);

const genesisAssetsTemplate = require(`${path.join(
	appRoot.toString(),
	'scripts',
	'genesis-assets-template.json',
)}`);

const TOKEN_ID = '0199999900000000';

const createValidatorObject = (validator, i) => {
	return {
		address: validator.address,
		name: `genesis_${i}`,
		blsKey: validator.plain.blsKey,
		proofOfPossession: validator.plain.blsProofOfPossession,
		generatorKey: validator.plain.generatorKey,
		lastGeneratedHeight: 0,
		isBanned: false,
		reportMisbehaviorHeights: [],
		consecutiveMissedBlocks: 0,
		commission: 0,
		lastCommissionIncreaseHeight: 0,
		sharingCoefficients: [],
	};
};

const main = async () => {
	const genesisAssets = { ...genesisAssetsTemplate };

	// token module
	const userSubstore = validatorsJson.keys.map(val => ({
		address: val.address,
		tokenID: TOKEN_ID,
		availableBalance: '100000000000000',
		lockedBalances: [],
	}));

	const totalSupply = userSubstore.reduce(
		(prev, current) => prev + BigInt(current.availableBalance),
		BigInt('0'),
	);

	genesisAssets.assets[0].data.userSubstore = userSubstore;
	genesisAssets.assets[0].data.supplySubstore[0].tokenID = TOKEN_ID;
	genesisAssets.assets[0].data.supplySubstore[0].totalSupply = totalSupply.toString();

	// pos module
	const initValidators = validatorsJson.keys.map(val => val.address);
	const validators = validatorsJson.keys.map((validator, i) => createValidatorObject(validator, i));

	genesisAssets.assets[1].data.genesisData.initValidators = initValidators;
	genesisAssets.assets[1].data.validators = validators;

	writeFileSync(
		path.join(appRoot.toString(), 'scripts', 'output', 'genesis_assets.json'),
		JSON.stringify(genesisAssets, null, 2),
	);
};

main();
