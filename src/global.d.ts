/*
type PlaySampleType = (note: string) => void;
type PlayLoopType = (note: string, sec: number, delaySeconds: number) => void;
*/
type PlayMusicType = () => void;

interface Window {
  /*
  playSample: PlaySampleType;
  playLoop: PlayLoopType;
  */
  playAirPortMusic: PlayMusicType;
}
