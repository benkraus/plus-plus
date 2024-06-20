export enum KarmaMessageType {
	PlusPlus = 'PlusPlus',
	PlusMinus = 'PlusMinus',
	SelfPlus = 'SelfPlus',
}

export const plusPlusMessages = [
	'Congrats!',
	'Got it!',
	'Bravo.',
	'Oh well done.',
	'Nice work!',
	'Well done.',
	'Exquisite.',
	'Lovely.',
	'Superb.',
	'Classic!',
	'Charming.',
	'Noted.',
	'Well, well!',
	'Well played.',
	'Sincerest congratulations.',
	'Delicious.',
];

export const plusMinusMessages = [
	'Oh RLY?',
	'Oh, really?',
	'Oh :slightly_frowning_face:.',
	'I see.',
	'Ouch.',
	'Oh là là.',
	'Oh.',
	'Condolences.',
];

export const selfPlusMessages = ['Hahahahahahaha no.', 'Nope.', 'No. Just no.', 'Not cool!'];

export const getRandomMessage = (type: KarmaMessageType) => {
	const messages = {
		[KarmaMessageType.PlusPlus]: plusPlusMessages,
		[KarmaMessageType.PlusMinus]: plusMinusMessages,
		[KarmaMessageType.SelfPlus]: selfPlusMessages,
	};

	return messages[type][Math.floor(Math.random() * messages[type].length)];
};
