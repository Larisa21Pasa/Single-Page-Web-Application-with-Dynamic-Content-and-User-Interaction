/* Doar preiau si transmit data inapoi */
self.onmessage =  function(event) {
    console.log('Web Worker a fost notificat!->'+event.data);
    self.postMessage(event.data);
};