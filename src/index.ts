const audioCtx = new AudioContext();
let loop;

const destination = audioCtx.createConvolver();

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SAMPLE_LIBRARY = {
  'Grand Piano': [
    { note: 'A', octave: 4, file: 'Samples/Grand Piano/piano-f-a4.wav' },
    { note: 'A', octave: 5, file: 'Samples/Grand Piano/piano-f-a5.wav' },
    { note: 'A', octave: 6, file: 'Samples/Grand Piano/piano-f-a6.wav' },
    { note: 'C', octave: 4, file: 'Samples/Grand Piano/piano-f-c4.wav' },
    { note: 'C', octave: 5, file: 'Samples/Grand Piano/piano-f-c5.wav' },
    { note: 'C', octave: 6, file: 'Samples/Grand Piano/piano-f-c6.wav' },
    { note: 'D#', octave: 4, file: 'Samples/Grand Piano/piano-f-d#4.wav' },
    { note: 'D#', octave: 5, file: 'Samples/Grand Piano/piano-f-d#5.wav' },
    { note: 'D#', octave: 6, file: 'Samples/Grand Piano/piano-f-d#6.wav' },
    { note: 'F#', octave: 4, file: 'Samples/Grand Piano/piano-f-f#4.wav' },
    { note: 'F#', octave: 5, file: 'Samples/Grand Piano/piano-f-f#5.wav' },
    { note: 'F#', octave: 6, file: 'Samples/Grand Piano/piano-f-f#6.wav' },
  ],
};

const getSample = (instrument, noteAndOctave) => {
  let [ , requestedNote, requestedOctave ] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
  // requestedOctave = parseInt(requestedOctave, 10);
  requestedNote = flatToSharp(requestedNote);
  const sampleBank = SAMPLE_LIBRARY[instrument];
  const sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
  let distance =
    getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);

  return fetchSample(sample.file)
    .then(audioBuffer => ({
      audioBuffer: audioBuffer,
      distance: distance,
    }));
};

const flatToSharp = (note) => {
  switch (note) {
    case 'Ab':
      return 'G#';
    case 'Bb':
      return 'A#';
    case 'Db':
      return 'C#';
    case 'Eb':
      return 'D#';
    case 'Gb':
      return 'F#';
    default:
      return note;
  }
};

const noteValue = (note, octave) => octave * 12 + OCTAVE.indexOf(note);
const getNoteDistance = (note1, oct1, note2, oct2) => noteValue(note1, oct1) - noteValue(note2, oct2);
const getNearestSample = (sampleBank, note, octave) => {
  const sortedBank = sampleBank.sort((sampleA, sampleB) => {
    const distanceA = Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    const distanceB = Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));

    return distanceA - distanceB;
  });

  return sortedBank[0];
};

const fetchSample = (path) => {
  return fetch(encodeURIComponent(path))
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer));
};

const playSample = (instrument, note, delaySeconds = 0) => {
  getSample(instrument, note)
  .then(({audioBuffer, distance}) => {
    const playbackRate = Math.pow(2, distance / 12);
    const sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.playbackRate.value = playbackRate;
    sourceNode.connect(destination);
    sourceNode.start(audioCtx.currentTime + delaySeconds);
  })
  .catch(e => { console.error(e); });
};

const playLoop = (instrument, note, loopLengthInSec, delaySeconds) => {
  playSample(instrument, note, delaySeconds);
  loop = setInterval(() => playSample(instrument, note, delaySeconds), loopLengthInSec * 1000);
}

/*
window.playSample = (note) => {
  playSample('Grand Piano', note);
};

window.playLoop = (note, loopLengthInSec, delaySeconds) => {
  playLoop('Grand Piano', note, loopLengthInSec, delaySeconds);
}
*/

window.playAirPortMusic = () => {
  playLoop('Grand Piano', 'F4',  19.7, 4.0);
  playLoop('Grand Piano', 'Ab4', 17.8, 8.1);
  playLoop('Grand Piano', 'C5',  21.3, 5.6);
  playLoop('Grand Piano', 'Db5', 22.1, 12.6);
  playLoop('Grand Piano', 'Eb5', 18.4, 9.2);
  playLoop('Grand Piano', 'F5',  20.0, 14.1);
  playLoop('Grand Piano', 'Ab5', 17.7, 3.1);
}

fetchSample('AirportTerminal.wav')
.then(convolverBuffer => {
  destination.buffer = convolverBuffer;
  destination.connect(audioCtx.destination);
})
.catch(e => {
  console.error(e);
});

