// NOTE: When it comes to the Web Speech API, things are still a bit quirky:
//       see: https://codersblock.com/blog/javascript-text-to-speech-and-its-many-quirks/

const MIN_INTERVAL_MILLISECONDS = 30 * 1000;
const MAX_INTERVAL_MILLISECONDS = 60 * 1000;
const RESET_INTERVAL_MILLISECONDS = 10 * 60 * 1000;

const synth = window.speechSynthesis;
let voices: SpeechSynthesisVoice[] = [];

synth.onvoiceschanged = () => {
	voices = synth.getVoices().filter((voice) => voice.lang.startsWith("en"));
};

function getRandomInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface CreateUtteranceOptions {
	lang?: string;
	pitch?: number;
	rate?: number;
	voice?: SpeechSynthesisVoice;
	volume?: number;
}

export function createUtterance(
	text: string,
	opts: CreateUtteranceOptions | undefined = {},
): SpeechSynthesisUtterance {
	const {
		lang = "en-US",
		pitch = 1,
		volume = 1,
		voice = null,
		rate = 1,
	} = opts;

	const limit = (value: number, min: number, max: number) =>
		Math.max(min, Math.min(value, max));

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = lang;
	utterance.pitch = limit(pitch, 0.1, 2);
	utterance.rate = limit(rate, 0.1, 2);
	utterance.voice = voice;
	utterance.volume = limit(volume, 0, 1);

	utterance.onerror = (event) => {
		console.error(
			`An error has occurred with the speech synthesis: ${event.error}`,
		);
	};

	return utterance;
}

export function speak(utterance: SpeechSynthesisUtterance) {
	const voiceIdx = Math.floor(Math.random() * voices.length);
	const voice = voices[voiceIdx] || null;
	utterance.voice = voice;
	synth.speak(utterance);
}

export function speakAtRandomInterval(utteranaces: SpeechSynthesisUtterance[]) {
	if (!utteranaces || utteranaces.length === 0) {
		return;
	}

	let curIdx = 0;
	let timeoutInterval = 0;

	const speakNext = () => {
		const utterance = utteranaces[curIdx];

		if (!utterance || !(utterance instanceof SpeechSynthesisUtterance)) {
			return;
		}

		speak(utterance);
		curIdx++;

		if (curIdx < utteranaces.length) {
			timeoutInterval = getRandomInterval(
				MIN_INTERVAL_MILLISECONDS,
				MAX_INTERVAL_MILLISECONDS,
			);
		} else {
			console.log("Mischief managed. Resetting 😈");
			timeoutInterval = RESET_INTERVAL_MILLISECONDS;
			curIdx = 0;
		}

		setTimeout(() => {
			speakNext();
		}, timeoutInterval);
	};

	speakNext();
}
