// socket/globalSocket.js
export let io = null;

export const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};
