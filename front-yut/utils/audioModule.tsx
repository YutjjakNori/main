//소리 플레이 모듈

const audioModule = (filePath: string, volume: number) => {
  const audio = new Audio(filePath);
  audio.volume = volume;
  audio.play();
};

export default audioModule;
