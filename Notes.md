## How to create a server

```
const server = http.createServer(app)
```

> basically, we create a server and the listen on that server

## To integrate Socket.io

```
const { Server } = require("socket.io")
const io = new Server(server)
```

> we import Server (a constructor from socket.io lib) and then we create a new io by passing our server)
