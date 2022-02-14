# Summit App

## Install

Use npm workspaces to install dependencies from phone-app, admin-app, and socket server.

```
npm install
```

## Start

Use concurently to start phone-app, and admin-app. The phone-app and admin-app
will automatically open in the browser.

```
npm start
```

To get the socket server running
```
npm run start:socket
```