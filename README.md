# 🛡️ VulnGuard - Vulnerability Management Dashboard

A comprehensive, real-time vulnerability management dashboard that integrates with **Tenable** for network device security monitoring and **ManageEngine** for endpoint management. Built with modern web technologies for enterprise security teams.

## ✨ Features

### 🔄 Real-Time Monitoring
- **Live Dashboard Updates**: WebSocket-powered real-time vulnerability data updates
- **Consolidated View**: Unified dashboard showing data from both Tenable and ManageEngine
- **Automated Refresh**: Configurable automatic data synchronization

### 📊 Advanced Analytics
- **Risk Scoring**: Intelligent risk calculation based on vulnerability severity and asset importance
- **Trend Analysis**: 30-day vulnerability trend charts and historical data
- **Patching Efficiency**: Real-time patching status and compliance metrics
- **Interactive Charts**: Beautiful, responsive charts using Recharts

### 🔌 Enterprise Integrations
- **Tenable Integration**: Complete API integration for network vulnerability scanning
- **ManageEngine Integration**: Endpoint management and patch status monitoring
- **RESTful APIs**: Well-documented API endpoints for external integrations

### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark mode interface optimized for SOC environments
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Material-UI**: Clean, consistent interface using Google's Material Design
- **Accessibility**: WCAG compliant design for inclusive accessibility

## 🏗️ Architecture

```
├── client/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── services/      # API communication services
│   │   └── App.tsx        # Main application component
│   └── package.json
│
├── server/                # Node.js Express Backend
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic and external API integrations
│   ├── utils/           # Utility functions and helpers
│   └── index.js         # Main server entry point
│
└── package.json         # Root package manager
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **Tenable** account with API access keys
- **ManageEngine** instance with API access

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd vulnerability-management-dashboard

# Install all dependencies
npm run install-all
```

### 2. Configuration

Create environment files:

```bash
# Backend configuration
cp server/.env.example server/.env
```

Edit `server/.env` with your API credentials:

```env
# Tenable Configuration
TENABLE_ACCESS_KEY=your_tenable_access_key_here
TENABLE_SECRET_KEY=your_tenable_secret_key_here
TENABLE_BASE_URL=https://cloud.tenable.com

# ManageEngine Configuration
MANAGE_ENGINE_API_KEY=your_manage_engine_api_key_here
MANAGE_ENGINE_BASE_URL=https://your-manageengine-instance.com

# Refresh Intervals (in minutes)
TENABLE_REFRESH_INTERVAL=15
MANAGE_ENGINE_REFRESH_INTERVAL=10
```

### 3. Development

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them separately:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

### 4. Production

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## 🔧 API Endpoints

### Dashboard APIs
- `GET /api/dashboard/data` - Get consolidated dashboard data
- `GET /api/dashboard/summary` - Get summary statistics
- `POST /api/dashboard/refresh` - Force refresh all data
- `GET /api/dashboard/trends?days=30` - Get vulnerability trends

### Tenable APIs
- `GET /api/tenable/stats` - Get Tenable statistics
- `GET /api/tenable/vulnerabilities` - Get vulnerabilities with filters
- `GET /api/tenable/assets` - Get network assets
- `GET /api/tenable/scans` - Get scan information

### ManageEngine APIs
- `GET /api/manageengine/stats` - Get ManageEngine statistics
- `GET /api/manageengine/vulnerabilities` - Get vulnerabilities
- `GET /api/manageengine/endpoints` - Get managed endpoints
- `GET /api/manageengine/patch-status` - Get patching status

## 🔌 API Integration Guide

### Tenable Integration

The dashboard uses Tenable's REST API v2. Required permissions:
- Vulnerability data access
- Asset information
- Scan results

### ManageEngine Integration

Supports multiple ManageEngine products:
- **Desktop Central**: Endpoint management and patching
- **Patch Manager Plus**: Advanced patch management
- **Vulnerability Manager Plus**: Vulnerability assessment

## 📊 Dashboard Features

### Main Dashboard
- **Real-time Metrics**: Live vulnerability counts and severity breakdown
- **Risk Assessment**: Calculated risk scores based on CVSS and asset criticality
- **Source Status**: Connection health for Tenable and ManageEngine
- **Trend Charts**: Historical vulnerability data visualization

### Vulnerability Management
- **Unified View**: Combined vulnerabilities from both platforms
- **Advanced Filtering**: Filter by severity, source, status, and more
- **Search Functionality**: Full-text search across vulnerability data
- **Export Capabilities**: CSV/PDF export for reporting

### Settings & Configuration
- **API Key Management**: Secure credential storage and testing
- **Refresh Intervals**: Configurable data synchronization timing
- **Connection Testing**: Built-in API connectivity verification

## 🔒 Security Features

- **API Key Protection**: Secure credential storage with environment variables
- **Rate Limiting**: Built-in API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization and validation
- **HTTPS Support**: SSL/TLS encryption for all communications
- **Audit Logging**: Comprehensive logging for security monitoring

## 🎨 Customization

### Themes
The dashboard supports custom themes. Modify `client/src/App.tsx` to customize:
- Color schemes
- Typography
- Component styling
- Layout preferences

### Charts
Vulnerability trends and metrics use Recharts. Customize in:
- `client/src/components/Dashboard.tsx`
- Chart colors, types, and data visualization options

## 📈 Monitoring & Logging

### Application Logs
- **Winston Logger**: Structured logging with multiple levels
- **Log Rotation**: Automatic log file rotation and archiving
- **Error Tracking**: Comprehensive error capture and reporting

### Health Checks
- `GET /health` - Application health status
- WebSocket connection monitoring
- API endpoint availability checks

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [Issues](../../issues) page for known problems
- Review API documentation for integration questions
- Contact your system administrator for enterprise deployment support

## 🔄 Updates

Regular updates include:
- Security patches and vulnerability fixes
- New integration capabilities
- Enhanced dashboard features
- Performance improvements

---

**Built with ❤️ for security teams worldwide**
