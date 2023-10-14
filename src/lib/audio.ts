// Create an AudioContext
const audioContext = new AudioContext();

let startBuffer: AudioBuffer;
let restBuffer: AudioBuffer;
let halfBuffer: AudioBuffer;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function loadAudioBuffer(file: string) {
	fetch(file)
		.then((response) => response.arrayBuffer())
		.then((data) => audioContext.decodeAudioData(data))
		.then((buffer) => {
			// Store the audio buffer in the variable
			if (file === 'start.mp3') {
				startBuffer = buffer;
			} else if (file === 'rest.mp3') {
				restBuffer = buffer;
			} else if (file === 'half.mp3') {
				halfBuffer = buffer;
			}
		})
		.catch((error) => console.error(error));
}

export function initAudioBuffers() {
	loadAudioBuffer('start.mp3');
	loadAudioBuffer('rest.mp3');
	loadAudioBuffer('half.mp3');
}

/**
 * Overly complex way to play a audio file.
 * However, this is the only way to play audio on iOS without stopping the background music.
 * @param type
 */
export function playSourceAudio(type: 'rest' | 'half' | 'start') {
	let audioBuffer;

	if (type === 'start') {
		audioBuffer = startBuffer;
	} else if (type === 'rest') {
		audioBuffer = restBuffer;
	} else if (type === 'half') {
		audioBuffer = halfBuffer;
	}

	if (audioBuffer) {
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;

		// Create a gain node to control the volume
		const gainNode = audioContext.createGain();
		gainNode.gain.value = 1; // Adjust the volume as needed

		// Connect the nodes: source -> gain -> destination (output)
		source.connect(gainNode);
		gainNode.connect(audioContext.destination);

		// Play the audio
		source.start();
	} else {
		console.error('Audio buffer not loaded yet. Please wait or handle this case.');
	}
}
