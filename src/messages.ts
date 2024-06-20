export enum KarmaMessageType {
	PlusPlus = 'PlusPlus',
	MinusMinus = 'MinusMinus',
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

export const minusMinusMessages = [
	'Oh RLY?',
	'Oh, really?',
	'Oh :slightly_frowning_face:.',
	'I see.',
	'Ouch.',
	'Oh là là.',
	'Oh.',
	'Condolences.',
];

export const selfPlusMessages = [
	'Hahahahahahaha no. No self promotion.',
	'Nope. No self promotion.',
	'No. Just no. No self promotion.',
	'Not cool! No self promotion.',
];

export const getRandomMessage = (type: KarmaMessageType) => {
	const messages = {
		[KarmaMessageType.PlusPlus]: plusPlusMessages,
		[KarmaMessageType.MinusMinus]: minusMinusMessages,
		[KarmaMessageType.SelfPlus]: selfPlusMessages,
	};

	return messages[type][Math.floor(Math.random() * messages[type].length)];
};
