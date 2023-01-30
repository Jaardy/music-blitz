// Import stylesheets
import './style.css';
import * as Tone from 'tone';

// get buttons
// const playButton = document.getElementById('play-button');
// const stopButton = document.getElementById('stop-button');
const sineOscillatorElement = document.getElementById('sine-oscillator');
const triangleOscillatorElement = document.getElementById(
  'triangle-oscillator'
);
const sawtoothOscillatorElement = document.getElementById(
  'sawtooth-oscillator'
);
const squareOscillatorElement = document.getElementById('square-oscillator');
const runExampleSynth = document.getElementById('run-example-synth');

const pianoToggle = document.getElementById('piano-toggle')
const melody1 = document.getElementById('melody-1')
const melody1stop = document.getElementById('melody-1-stop')

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

// =======================
// EXAMPLE 1

const notesForSequence1 = ["C3", "G3", "G3", ["F3", "E3"], ["F3", "E3"], "D3", null]
const secondMelody = ["E3", "D3", "C3", "D3", "E3", "E3", "E3"]
const sequence = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "2n", time)
}, secondMelody, "2n")
sequence.loop = false

const pattern = new Tone.Pattern(
  (time, { note, duration, delay, velocity }) => {
    // the order of the notes passed in depends on the pattern
    synth.triggerAttackRelease(note, duration, time + delay, velocity);
  },
  notesForSequence1,
  'up'
);

melody1.addEventListener('click', async () => {
  console.log('clicked!')
  await Tone.start()
  sequence.start()
  Tone.Transport.start();
});

melody1stop.addEventListener('click', () => {
  Tone.Transport.stop();

});

const playOscillator = async (e) => {
  await Tone.start();

  const type = e.target.innerHTML.toLowerCase();
  const oscillator = new Tone.Oscillator(440, type).toDestination();
  Tone.Transport.start();
  oscillator.volume.value = '-20';
  oscillator.start().stop('+0.7');
  Tone.stop();
};

sineOscillatorElement.addEventListener('click', playOscillator);
triangleOscillatorElement.addEventListener('click', playOscillator);
sawtoothOscillatorElement.addEventListener('click', playOscillator);
squareOscillatorElement.addEventListener('click', playOscillator);

const playExampleSynth = async () => {
  await Tone.Transport.start();
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease('C4', '4n');
};

runExampleSynth.addEventListener('click', playExampleSynth);

let synthForPiano = new Tone.PolySynth()

pianoToggle.addEventListener('click', async (e) => {
  if (e.target.checked) return synthForPiano.toDestination()
  synthForPiano.releaseAll()
  synthForPiano.disconnect()
  
})

const getElementByNote = (note) => (note && document.querySelector(`[note="${note}"]`))
const keys = {
  A: { element: getElementByNote('C'), note: 'C', octaveOffset: 0 },
  W: { element: getElementByNote('C#'), note: 'C#', octaveOffset: 0 },
  S: { element: getElementByNote('D'), note: 'D', octaveOffset: 0 },
  E: { element: getElementByNote('D#'), note: 'D#', octaveOffset: 0 },
  D: { element: getElementByNote('E'), note: 'E', octaveOffset: 0 },
  F: { element: getElementByNote('F'), note: 'F', octaveOffset: 0 },
  T: { element: getElementByNote('F#'), note: 'F#', octaveOffset: 0 },
  G: { element: getElementByNote('G'), note: 'G', octaveOffset: 0 },
  Y: { element: getElementByNote('G#'), note: 'G#', octaveOffset: 0 },
  H: { element: getElementByNote('A'), note: 'A', octaveOffset: 0 },
  U: { element: getElementByNote('A#'), note: 'A#', octaveOffset: 0 },
  J: { element: getElementByNote('B'), note: 'B', octaveOffset: 0 },
  K: { element: getElementByNote('C2'), note: 'C', octaveOffset: 1 },
  O: { element: getElementByNote('C#2'), note: 'C#', octaveOffset: 1 },
  L: { element: getElementByNote('D2'), note: 'D', octaveOffset: 1 },
  P: { element: getElementByNote('D#2'), note: 'D#', octaveOffset: 1 },
  semicolon: { element: getElementByNote('E2'), note: 'E', octaveOffset: 1 },
};

const pressedNotes = new Map();
let clickedKey = "";

function playPianoNote(e) {
  console.log(e.key)
  if (e.repeat || !pianoToggle.checked) return
  const eventKey = e.key.toUpperCase()
  const key = eventKey === ";" ? "semicolon" : eventKey
  console.log("pressed: ", pressedNotes)
  if (!key || !keys[key] || pressedNotes.has(key)) {
    return;
  }

  keys[key].element.classList.add("pressed");
  pressedNotes.set(key)
  let note =keys[key].note
  let octave = keys[key].octaveOffset + 3
  
  
  synthForPiano.triggerAttack(note+octave)
}

function stopPianoNote(e) {
  const eventKey = e.key.toUpperCase()
  const key = eventKey === ";" ? "semicolon" : eventKey
  if (!key || !keys[key]) {
    return;
  }
  keys[key].element.classList.remove("pressed");
  pressedNotes.delete(key)
  let note =keys[key].note
  let octave = keys[key].octaveOffset + 3
  synthForPiano.triggerRelease(note+octave)
}

function lostWindowFocus () {
  
    console.log('lost focus')
    if (synthForPiano) {
      synthForPiano.releaseAll()
    }
}

document.addEventListener("keydown", playPianoNote);
document.addEventListener("keyup", stopPianoNote);
window.addEventListener('blur', lostWindowFocus)
