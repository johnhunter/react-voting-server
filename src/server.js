import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server().attach(8090);

  // NOTE: broadcasting the whole state could be costly
  //    consider sending diffs rather than snapshots.
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );

  io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());

    // NOTE: in production you need access rules here (and auth)
    // see: http://vertx.io/docs/vertx-web/java/#_securing_the_bridge
    socket.on('action', store.dispatch.bind(store));
  });
}
