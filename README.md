# Webhook Testing Server

A comprehensive webhook testing server built with Express.js that allows you to receive, monitor, and test webhooks in real-time.

## 🚀 Features

- **Webhook Reception**: Accept webhooks on `/webhook` and `/webhook/:name` endpoints
- **Real-time Dashboard**: Web interface to view received webhooks
- **API Endpoints**: RESTful API for webhook management
- **Test Functionality**: Send test webhooks to your local applications
- **Multiple HTTP Methods**: Support for GET, POST, PUT, DELETE, PATCH
- **Request Details**: View headers, body, query parameters, and metadata
- **History Management**: Store and clear webhook history
- **Koyeb Ready**: Configured for easy deployment to Koyeb

## 🌐 Live Deployment

Deploy this to Koyeb to get a public URL for webhook testing:

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&repository=your-repo-url&branch=main&name=webhook-tester)

## 📡 API Endpoints

### Webhook Endpoints
- `ALL /webhook` - Main webhook endpoint (accepts all HTTP methods)
- `ALL /webhook/:name` - Named webhook endpoint

### API Endpoints
- `GET /` - Web dashboard
- `GET /health` - Health check
- `GET /api/webhooks` - Get webhook history
- `GET /api/webhooks/:id` - Get specific webhook
- `DELETE /api/webhooks` - Clear webhook history
- `POST /api/test-webhook` - Send test webhook

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webhooktest.git
   cd webhooktest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the dashboard**
   - Open http://localhost:3000 in your browser
   - Your webhook URL will be: http://localhost:3000/webhook

## 🚀 Deployment to Koyeb

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/webhooktest.git
   git push -u origin main
   ```

2. **Deploy to Koyeb**
   - Go to [Koyeb Dashboard](https://app.koyeb.com)
   - Create new app
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set run command: `npm start`
   - Deploy!

3. **Get your public webhook URL**
   - After deployment, your webhook URL will be: `https://your-app-name.koyeb.app/webhook`

## 📝 Usage Examples

### Testing Your Local App

Once deployed to Koyeb, you can use the web interface to send test webhooks to your local application:

1. Enter your local app URL (e.g., `http://localhost:3000/webhook`)
2. Choose HTTP method (POST, GET, etc.)
3. Add custom headers if needed
4. Add JSON body data
5. Click "Send Test Webhook"

### Receiving Webhooks

Your deployed Koyeb URL can receive webhooks from any service:

```bash
# Example: Send a webhook to your deployed app
curl -X POST https://your-app-name.koyeb.app/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": {"message": "Hello World"}}'
```

### Named Webhooks

Use named endpoints for different webhook sources:

```bash
# GitHub webhook
curl -X POST https://your-app-name.koyeb.app/webhook/github \
  -H "Content-Type: application/json" \
  -d '{"action": "push", "repository": {"name": "test-repo"}}'

# Stripe webhook
curl -X POST https://your-app-name.koyeb.app/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded", "data": {}}'
```

## 🔧 Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## 📦 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **helmet** - Security middleware
- **morgan** - Request logging
- **body-parser** - Request body parsing
- **uuid** - Unique ID generation
- **node-fetch** - HTTP client for test webhooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details

## 🆘 Support

If you need help:
1. Check the web dashboard for real-time webhook data
2. Use the health endpoint: `/health`
3. Check server logs for detailed information
4. Create an issue on GitHub

---

**Happy webhook testing! 🪝**
