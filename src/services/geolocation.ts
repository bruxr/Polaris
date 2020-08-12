const getLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      resolve([latitude, longitude]);
    }, (err) => {
      reject(err);
    });
  });
};

export { getLocation };
