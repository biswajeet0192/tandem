// public/worker.js
self.onmessage = function(e) {
    const { type, data } = e.data;
    if (type === 'processGPSData') {
      const result = processGPSData(data);
      self.postMessage({ type: 'processedGPSData', data: result });
    }
  };
  
  function processGPSData(data) {
    // Intensive computation logic here
    return data;
  }
  