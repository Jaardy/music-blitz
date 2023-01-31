// Import stylesheets
import './style.css';
import * as Tone from 'tone';

// get buttons
const playButton = document.getElementById('play-melody-1');
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

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

// =======================
// EXAMPLE 1


const melody1  = ["C3", "G3", "G3", ["F3", "E3"], ["F3", "E3"], "D3", null]
const melody2 = [["G3", "A3", "C4", "A3"], "E4", "E4", "D4", null, ["G3", "A3", "C4", "A3"], "D4", "D4", "C4", null]
const melody3 =  [["A2","G2"], "E2",null,  "E2", null, "E2", null, null,[null, "e2"], "e2", "e2", "g2", "e2", "a2"]
const melody4 = ["a3", null, "f4", null, "F4", null,
null, null, null, null, "d4", "d4", "d4", "G3", "d4",
"d4","d4","d4","d4","d4", "G3", "d4", "G3", "d4", "G3", "d4", null,
"F4", "G4", "b4", "a4", null, "F4", "d4", "b4",
"G4", "G4", "G4", "a4", null, null, "G4", "G4", "G4", "a4",
"c5", null, "C5", "b3", "b3", "g3", "b3","b3","b3", "C4", "b3",
"b3", "g3", "b3", "b3", "b3", "F4", null, "A4", null,
null, null, "c5", "D5", "C5", null,
"A4", "F4", "c4", null, null, null, "e5",
"D4", "D4", "a3", "D4", "D4", "D4", "e4", "D4", "D4", "a3", "D4", "a3",
"D4", "a3", "A4", null, "g4", "D4", "c5", "a4", "a4", "a4",
"A4", "a4", "a4", "A4", "a4", "a4", "a4", "A4", "C5", null,
"D5", "D5", "D5", "D5", null, null, "C4", "D4", "f4", "G4",
"F4", null, "f4", "D4", "C4", "C4", null, null ]
const sequence = new Tone.Sequence((time, note,) => {
  synth.triggerAttackRelease(note, "8n", time)
}, melody3, "8n")
sequence.loop = false

// const pattern = new Tone.Pattern(
//   (time, { note, duration, delay, velocity }) => {
//     // the order of the notes passed in depends on the pattern
//     synth.triggerAttackRelease(note, duration, time + delay, velocity);
//   },
//   arrayOfNotesWithoutDelays,
//   'up'
// );

playButton.addEventListener('click', async () => {
  
  await Tone.start()
  Tone.Transport.stop();
  Tone.Transport.start();
  sequence.start()
  
});

// stopButton.addEventListener('click', () => {
//   Tone.Transport.stop();

// });

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

let synthForPiano = new Tone.PolySynth().set({envelope:{release: "2"}})

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

async function playPianoNote(e) {
  console.log(e.key)
  if (e.repeat || !pianoToggle.checked) return
  const eventKey = e.key.toUpperCase()
  const key = eventKey === ";" ? "semicolon" : eventKey
  console.log(key)
  if (!key || !keys[key] ||pressedNotes.has(key)) {
    return;
  }
  pressedNotes.set(key)
  keys[key].element.classList.add("pressed");
  
  let note =keys[key].note
  let octave = keys[key].octaveOffset + 3
  
  
  synthForPiano.triggerAttack(note+octave)
}

async function stopPianoNote(e) {
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
