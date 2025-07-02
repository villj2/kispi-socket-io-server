## SOCKETIO-SERVER

### Description
The **Socket.IO Server** is a Node.js application that manages WebSocket connections and organizes clients into separate rooms. This enables real-time communication between clients in the same room while maintaining isolation between different rooms.

### Features
- Handles real-time communication using WebSockets.
- Supports grouping of clients into rooms for targeted messaging.
- Implements connection and disconnection events, message broadcasting, and room state updates.

### Deployment
The server is deployed to **Fly.io** named **`kispi-socket-io-server-dev`** resp. **`kispi-socket-io-server`**. The live servers are accessible at:

- [https://kispi-socket-io-server-dev.fly.dev/](https://kispi-socket-io-server-dev.fly.dev/)
- [https://kispi-socket-io-server.fly.dev/](https://kispi-socket-io-server.fly.dev/)

### Deployment Steps
- Push the latest commit to `develop` (for kispi-socket-io-server-dev) or `main` (for kispi-socket-io-server)
- Go to fly.io
- Log in
- Go to `Dashboard` -> `Apps`
- Click on the app you want to deploy
- Click on `Deployments`
- Click on `Deploy app` in the top right corner
- ...
- Profit