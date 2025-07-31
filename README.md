# Hookbuster - WebSocket-to-HTTP Event Forwarder

## 📋 Description

This application demonstrates how to register for Webex Teams `message`, `membership` and `rooms` events via websocket using the Webex Javascript SDK. Currently (as of September, 2019), the Webex JS SDK is the only way to receive Webex events via websocket. This app is a simple node.js app that registers for events in Webex Teams via websocket, and forwards them to a localhost port for bots or apps that are listening on that port. It is particularly useful for Webex Teams applications written in a language other than javascript that need to run behind a firewall, and cannot register for webhooks since they do not have a public IP address.

## 🎯 Use Cases

**Perfect for:**
- **Firewall-protected applications** that can't receive webhooks
- **Multi-language development** where your bot isn't written in JavaScript
- **Local development** without exposing public endpoints
- **Testing webhook functionality** without webhook infrastructure
- **Legacy applications** that need Webex integration

## 🔧 Requirements

- **Webex Teams access token**: this will be used by the hookbuster to create websocket listeners. Ideally you would use the access token that is used by the application that hookbuster will forward the events to.
- **Open port on TARGET**: this is where the incoming HTTP requests will be forwarded to, so that the listening app can process them
- **Node.js**: will be used to run the app locally
- **npm**: will be used to install dependencies

## 🚀 Install and Run

**Basic Installation:**
```bash
# Clone the repository
git clone https://github.com/WebexSamples/hookbuster.git
cd hookbuster

# Install dependencies
npm install

# Run the application
node app.js
```

## 💻 Usage - Demonstration Mode

By default the app will run in "demonstration mode" with a command line interface that solicits the access token, port, and which resources and events to register for:

```
  ,----------------------------------------------------------.
  |                                                          |
  |    _   _             _    _               _              |
  |   | | | | ___   ___ | | _| |__  _   _ ___| |_ ___ _ __   |
  |   | |_| |/ _ \ / _ \| |/ / '_ \| | | / __| __/ _ \ '__|  |
  |   |  _  | (_) | (_) |   <| |_) | |_| \__ \ ||  __/ |     |
  |   |_| |_|\___/ \___/|_|\_\_.__/ \__,_|___/\__\___|_|     |
  |                                                          |
  |                                                          |
  `----------------------------------------------------------'

? Enter your access token > AaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJj_ABCD_1a2b3c4d-1234-abcd-9876-abcdefghijkl
! AaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJjAaBbCcDdEeFfGgHhIiJj_ABCD_1a2b3c4d-1234-abcd-9876-abcdefghijkl
INFO: token authenticated as Bot
? Enter a port you will forward messages to > 5000
! 5000
? Select resource [ a - all, r - rooms, m - messages, mm - memberships, aa - attachmentActions ] > a
INFO: Listening for events from the rooms resource
INFO: Registered handler to forward  rooms:created events
INFO: Registered handler to forward  rooms:updated events
INFO: Listening for events from the messages resource
INFO: Registered handler to forward  messages:created events
INFO: Registered handler to forward  messages:deleted events
INFO: Listening for events from the memberships resource
INFO: Registered handler to forward  memberships:created events
INFO: Registered handler to forward  memberships:updated events
INFO: Registered handler to forward  memberships:deleted events
INFO: Listening for events from the attachmentActions resource
INFO: Registered handler to forward  attachmentActions:created events
```

### Interactive Configuration

The CLI will prompt you for:

1. **Access Token**: Your Webex Teams bot or user access token
2. **Target Host**: Where to forward events (default: localhost)
3. **Port**: Target port number for forwarding
4. **Resource Selection**: Choose which Webex resources to monitor
5. **Event Selection**: Choose which events to forward

### Resource Options

| Option | Alias | Description | Events |
|--------|-------|-------------|--------|
| **All** | `a` | All resources | All available events |
| **Rooms** | `r` | Webex spaces/rooms | `created`, `updated` |
| **Messages** | `m` | Chat messages | `created`, `deleted` |
| **Memberships** | `mm` | Room memberships | `created`, `updated`, `deleted` |
| **Attachment Actions** | `aa` | Card interactions | `created` |

**Tip**: You can use the [javabot](https://github.com/WebexSamples/javabot) to test how this app works. Start **javabot** with your access token and enter a localhost port, where **javabot** will listen to incoming messages. While both apps are running, open a Webex Teams space with the bot, whose access token you used and say **hello**. It should greet you back. 👋

## 🔧 Usage - Deployment Mode

If the following environment variables are set:

- **TOKEN**: Your Webex access token
- **TARGET**: Target hostname/IP (optional, defaults to localhost)
- **PORT**: Target port number

Hookbuster will automatically register for all of the webhook firehose events, using the TOKEN and then forward any received events to TARGET:PORT. If you only set PORT and TOKEN in your environmental variables, then TARGET will be defaulted to localhost. Otherwise (if you do not use environmental variables) you will be prompted to enter a target manually.

### Environment Variable Setup

```bash
# Set environment variables
export TOKEN="your_webex_access_token"
export TARGET="localhost"  # Optional, defaults to localhost
export PORT="5000"

# Run in deployment mode
node app.js
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t hookbuster .

# Run with environment variables
docker run -e TOKEN="your_token" -e PORT="5000" -e TARGET="localhost" hookbuster
```

## 📁 Project Structure

```
hookbuster/
├── app.js                 # Main application entry point
├── src/
│   ├── cli.js            # Command-line interface and user interaction
│   └── listener.js       # WebSocket listener and event forwarding
├── util/
│   └── fonts.js          # Console styling utilities
├── Dockerfile            # Docker containerization
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## 🔍 How It Works

### Architecture Overview

1. **WebSocket Connection**: Establishes WebSocket connection to Webex using the JS SDK
2. **Event Registration**: Registers for specific Webex resource events
3. **Event Handling**: Receives events in real-time via WebSocket
4. **HTTP Forwarding**: Forwards events as HTTP POST requests to target application
5. **Response Handling**: Logs forwarding status and any errors

### Event Flow

```
Webex Cloud → WebSocket → Hookbuster → HTTP POST → Your Application
```

### Event Structure

Events are forwarded as JSON HTTP POST requests with the following structure:

```json
{
  "id": "event-id",
  "resource": "messages",
  "event": "created",
  "data": {
    "id": "message-id",
    "roomId": "room-id",
    "personId": "person-id",
    "personEmail": "user@example.com",
    "text": "Hello World",
    "created": "2023-01-01T12:00:00.000Z"
  }
}
```

## 🛠️ Dependencies

```json
{
  "dependencies": {
    "asciiart-logo": "^0.2.6",
    "chalk": "^5.4.1",
    "clear": "^0.1.0",
    "webex-node": "^3.8.1"
  }
}
```

### Key Dependencies

- **webex**: Official Webex JavaScript SDK for WebSocket connections
- **chalk**: Terminal string styling for colorized output
- **asciiart-logo**: ASCII art logo generation
- **clear**: Terminal clearing functionality

## 📚 Event Types & Resources

### Messages Resource

- **messages:created**: New message posted in a space
- **messages:deleted**: Message deleted from a space

### Rooms Resource

- **rooms:created**: New space created
- **rooms:updated**: Space information updated

### Memberships Resource

- **memberships:created**: User added to a space
- **memberships:updated**: User role changed in a space
- **memberships:deleted**: User removed from a space

### Attachment Actions Resource

- **attachmentActions:created**: User interacted with an Adaptive Card

## 🔐 Read Receipts - A Special Note

In addition to adding support for Webex events via websocket, the Webex JSSDK also introduces a new memberships:seen event which effectively notifies an application when a member of a space has seen messages posted in that space. As of September, 2019, there is not yet a corresponding webhook, and consequently this event is not one that is delivered via the [webhook firehose](https://developer.webex.com/messaging/docs/api/guides/webhooks#the-firehose-webhook). Since this app is designed primarily as a way to get webhook events to applications running behind a firewall, by default it does NOT register for membership:seen events.

If you would like to add membership:seen (read receipt) event processing to your application, simply uncomment the `seen` element in the `object.memberships` object defined near the top of [cli.js](./src/cli.js).

For more information on how the membership:seen events behave, run the [events via socket JSSDK sample](https://webex.github.io/webex-js-sdk/samples/browser-socket/). It is worth noting that the system generally generates MANY more membership:seen events than all the rest of the Webex Teams events, so register for these only if your app is able to make use of them.

### Enabling Read Receipts

To enable read receipt events, edit `src/cli.js`:

```javascript
memberships: {
    alias: 'mm',
    description: 'memberships',
    events: [
        'all',
        'created',
        'updated',
        'seen',        // Uncomment this line
        'deleted'
    ]
},
```

## 🧪 Testing & Development

### Local Testing Setup

1. **Start Hookbuster**: Run hookbuster on your local machine
2. **Configure Target**: Set target to localhost and choose a port (e.g., 5000)
3. **Create Test Server**: Set up a simple HTTP server to receive events
4. **Test Events**: Interact with Webex to trigger events

### Simple Test Server

```javascript
// test-server.js
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Received event:', JSON.parse(body));
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end('{"status": "received"}');
        });
    }
});

server.listen(5000, () => {
    console.log('Test server running on port 5000');
});
```

### Integration with Javabot

For comprehensive testing:

1. **Clone Javabot**: `git clone https://github.com/WebexSamples/javabot.git`
2. **Configure Javabot**: Use the same access token and set it to listen on port 5000
3. **Start Both Applications**: Run hookbuster and javabot simultaneously
4. **Test Interaction**: Message your bot in Webex Teams
5. **Verify Response**: Bot should respond, confirming the event flow works

## 🔍 Monitoring & Logging

### Console Output

Hookbuster provides detailed console logging:

- **Authentication**: Token validation and user identification
- **Registration**: Event listener registration confirmation
- **Event Processing**: Real-time event reception notifications
- **Forwarding**: HTTP request forwarding status
- **Errors**: Detailed error messages and stack traces

### Log Levels

- **INFO**: General information and status updates
- **ERROR**: Error conditions and failures
- **HIGHLIGHT**: Important events and resource:event combinations

## 🐛 Troubleshooting

### Common Issues

**Connection Errors**
- Verify access token is valid and has appropriate permissions
- Check network connectivity and firewall settings
- Ensure WebSocket connections are allowed

**Forwarding Failures**
- Verify target application is running and accessible
- Check port availability and firewall rules
- Confirm target application accepts POST requests

**Event Registration Issues**
- Validate access token permissions for requested resources
- Check if bot is member of spaces for room/membership events
- Verify event types are supported by the SDK version

### Debug Mode

Enable detailed logging by modifying the Webex SDK initialization:

```javascript
    webex = Webex.init({
        config: {
            logger: {
                level: 'debug'
            }
        },
        credentials: {
            access_token: accessToken
        }
    });
```

## 🔄 Graceful Shutdown

Hookbuster handles graceful shutdown with Ctrl+C:

1. **Signal Handling**: Captures SIGINT signal
2. **Listener Cleanup**: Stops all active WebSocket listeners
3. **Event Deregistration**: Removes all event handlers
4. **Process Termination**: Exits cleanly once all listeners are stopped

## 📊 Performance Considerations

### Resource Usage

- **Memory**: Minimal memory footprint, scales with number of active listeners
- **CPU**: Low CPU usage for event processing and forwarding
- **Network**: Persistent WebSocket connection plus HTTP forwarding requests

### Scaling

- **Single Instance**: Handles multiple resource listeners efficiently
- **Multiple Instances**: Can run multiple instances with different tokens/targets
- **Load Balancing**: Consider load balancing for high-volume deployments

## 🔐 Security Best Practices

### Token Management

- **Environment Variables**: Store tokens in environment variables, not code
- **Least Privilege**: Use tokens with minimal required permissions
- **Token Rotation**: Regularly rotate access tokens
- **Secure Storage**: Use secure credential storage in production

### Network Security

- **Firewall Rules**: Restrict access to forwarding ports
- **HTTPS**: Use HTTPS for production deployments
- **Authentication**: Implement authentication on target applications
- **Rate Limiting**: Consider rate limiting on target endpoints

## 📈 Production Deployment

### Docker Deployment

```dockerfile
# Dockerfile included
FROM node:22
RUN git clone "https://github.com/WebexSamples/hookbuster.git"
WORKDIR /hookbuster
RUN npm install
ENTRYPOINT ["node", "app.js"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hookbuster
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hookbuster
  template:
    metadata:
      labels:
        app: hookbuster
    spec:
      containers:
      - name: hookbuster
        image: hookbuster:latest
        env:
        - name: TOKEN
          valueFrom:
            secretKeyRef:
              name: webex-token
              key: token
        - name: PORT
          value: "5000"
        - name: TARGET
          value: "target-service"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test thoroughly with different event types
5. Submit a pull request with detailed description

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🔗 Related Projects

- [Javabot](https://github.com/WebexSamples/javabot): Java-based Webex bot for testing
- [Webex JS SDK](https://github.com/webex/webex-js-sdk/tree/next/packages/webex-node): Official JavaScript SDK
- [Webex Node Bot Framework](https://github.com/WebexCommunity/webex-node-bot-framework): Node.js bot framework

## 📚 Additional Resources

- [Webex Developer Portal](https://developer.webex.com/)
- [Webex Webhooks Documentation](https://developer.webex.com/docs/api/guides/webhooks)
- [Webex JavaScript SDK Documentation](https://webex.github.io/webex-js-sdk/)
- [Webex Events via WebSocket Sample](https://webex.github.io/webex-js-sdk/samples/browser-socket/)

## 🆘 Support

- Create an issue in this repository
- Review [Webex Developer Documentation](https://developer.webex.com/docs)
- Join the [Webex Developer Community](https://community.cisco.com/t5/webex-for-developers/bd-p/disc-webex-developers)

---

**Repository**: https://github.com/WebexSamples/hookbuster
