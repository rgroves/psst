const synth = window.speechSynthesis;

synth.onvoiceschanged = () => {
	voices = synth.getVoices().filter((voice) => voice.lang.startsWith("en"));
	console.log(
		"voices are ready",
		voices.map((v) => v.name),
	);
};

let voices: SpeechSynthesisVoice[] = [];

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
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = lang;
	utterance.pitch = pitch;
	utterance.rate = rate;
	utterance.voice = voice;
	utterance.volume = volume;

	utterance.onerror = (event) => {
		console.error(
			`An error has occurred with the speech synthesis: ${event.error}`,
		);
	};

	utterance.onend = function (event: SpeechSynthesisEvent) {
		console.debug(
			`Spoke: ${event.utterance.text}, duration: ${event.elapsedTime} seconds`,
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
