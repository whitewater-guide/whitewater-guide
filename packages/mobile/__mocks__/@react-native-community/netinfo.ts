export function fetch() {
  return Promise.resolve({
    type: 'wifi',
    isConnected: true,
    details: {
      isConnectionExpensive: false,
    },
  });
}

export function useNetInfo() {
  return {
    type: 'wifi',
    isConnected: true,
    details: {
      isConnectionExpensive: false,
    },
  };
}
