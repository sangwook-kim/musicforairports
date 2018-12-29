type PlaySampleType = (note: string) => void;

interface Window {
  playSample: PlaySampleType;
}
