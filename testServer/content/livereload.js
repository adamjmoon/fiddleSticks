var ws;
function socket() {
  ws = new WebSocket("ws://127.0.0.1:4001");
  ws.onmessage = function ( e ) {
    var data = JSON.parse(e.data);
    if ( data.r ) {
      location.reload();
      ws.send('reloaded');
    }
  };
}
setInterval(function () {
  if ( ws ) {
    if ( ws.readyState !== 1 ) {
      socket();
    }
  } else {
    socket();
  }
}, 1000);