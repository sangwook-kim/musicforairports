const audioCtx = new AudioContext();

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

const getSample = (instrument,noteAndOctave) => {
  let [ , requestedNote, requestedOctave ] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
  // requestedOctave = parseInt(requestedOctave, 10);
  requestedNote = flatToSharp(requestedNote);
  console.log(requestedNote);
  console.log(requestedOctave);
}

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

const fetchSample = async (path) => {
  return fetch(encodeURIComponent(path))
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer));
};
