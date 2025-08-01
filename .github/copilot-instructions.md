<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Webhook Testing Server

This is a webhook testing application built with Express.js for receiving, monitoring, and testing webhooks. The application is designed to be deployed to Koyeb for public webhook URL access.

## Code Guidelines

- Use modern JavaScript (ES6+) features where appropriate
- Follow Express.js best practices for middleware and routing
- Ensure all endpoints return proper JSON responses
- Include error handling for all async operations
- Use descriptive variable and function names
- Add comments for complex logic
- Maintain security with helmet and proper CORS configuration

## Architecture

- **server.js** - Main Express server with all endpoints
- **public/index.html** - Web dashboard for monitoring webhooks
- Webhook storage is in-memory (consider database for production)
- Supports all HTTP methods on webhook endpoints
- Includes test functionality to send webhooks to other applications

## Key Features

- Real-time webhook reception and display
- Web dashboard with auto-refresh
- API endpoints for webhook management
- Test webhook sender functionality
- Deployment-ready for Koyeb platform
