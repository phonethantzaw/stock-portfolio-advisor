# 📈 Stock Portfolio Advisor

A modern web application that helps users manage and optimize their stock portfolios with AI-powered insights and recommendations.

## 🌟 Features

### Frontend
- 📊 Real-time stock market data visualization
- 🤖 AI-powered stock analysis and recommendations
- 💼 Portfolio management and tracking
- 🌓 Dark/Light mode support
- 📱 Responsive design for all devices

### Backend
- 🔒 Secure OAuth2/OpenID Connect authentication
- 📡 RESTful API endpoints
- 🗄️ PostgreSQL database integration
- 📊 Real-time data processing
- 🔄 Automated portfolio rebalancing

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2
- **UI**: Shadcn UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **Language**: TypeScript/React 18
- **Authentication**: Keycloak integration

### Backend
- **Framework**: Spring Boot 3.4.2
- **Database**: PostgreSQL 16
- **Language**: Java 17
- **Build Tool**: Maven
- **Security**: OAuth2/OpenID Connect with Keycloak

### Infrastructure
- **Authentication**: Keycloak 24.0.2
- **Database**: PostgreSQL 16
- **Platform**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- Docker Desktop (latest version)
- Docker Compose

No need to install Node.js, Java, or PostgreSQL locally - everything runs in containers! 🐳

### 📋 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/phonethantzaw/stock-portfolio-advisor.git
   cd stock-portfolio-advisor
   ```

2. Obtain required API keys:
   - **OpenAI API Key**: 
     - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
     - Sign up or log in to your account
     - Navigate to API keys section and create a new secret key
     - Copy the key (you won't be able to see it again)
   
   - **Stock API Key**: 
     - Visit [Financial Modeling Prep](https://site.financialmodelingprep.com/)
     - Sign up for an account
     - Navigate to your dashboard to find your API key
     - Free tier provides limited API calls, consider a paid plan for production use

3. Set up environment variables:
   - **Backend**: Copy the example environment file
     ```bash
     cp stock-portfolio-advisor-backend/.env.example stock-portfolio-advisor-backend/.env
     ```
     Backend `.env` contains:
     ```
     OPENAI_API_KEY=your_openai_api_key
     STOCK_API_KEY=your_stock_api_key
     JWT_ISSUER_URI=http://keycloak:8080/realms/stock-advisor
     POSTGRES_URL=jdbc:postgresql://postgres:5432/stock_advisor
     POSTGRES_USER=admin
     POSTGRES_PASSWORD=password
     STOCK_API_URL=https://financialmodelingprep.com/api/v3
     FRONTEND_URL=http://frontend:3000
     ```
   
   - **Frontend**: Copy the example environment file
     ```bash
     cp stock-portfolio-advisor-frontend/.env.example stock-portfolio-advisor-frontend/.env
     ```
     Frontend `.env` contains:
     ```
     # Keycloak Configuration
     NEXT_PUBLIC_KEYCLOAK_URL=http://keycloak:8080
     NEXT_PUBLIC_KEYCLOAK_REALM=stock-advisor
     NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=sa
     
     # API Configuration
     NEXT_PUBLIC_API_URL=http://backend:8080
     ```

4. Start all services:
   ```bash
   docker compose up --build
   ```

### 🌐 Access Services

- Frontend UI: http://localhost:3000
- Backend API: http://localhost:8080
- Keycloak Admin: http://localhost:9090 (admin/admin)
  - Once deployed, go to http://localhost:9090, login with admin credentials, select "stock-advisor" realm, navigate to Users section, and click "Add user" to create a new user with credentials
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/v3/api-docs

## 🛠️ Development

### Docker Commands

```bash
# Start all services in background
docker compose up -d

# View all logs
docker compose logs

# View service-specific logs
docker compose logs frontend
docker compose logs backend

# Stop all services
docker compose down

# Rebuild specific service
docker compose up --build frontend
```

### 🏗️ Project Structure

```
stock-portfolio-advisor/
├── stock-portfolio-advisor-frontend/   # Next.js frontend
├── stock-portfolio-advisor-backend/    # Spring Boot backend
├── docker-compose.yml                  # Container orchestration
├── realm-sd-export.json               # Keycloak realm config
└── README.md                          # Project documentation
```

### 🔌 Service Architecture

1. **Frontend (3000)**
   - Next.js application
   - Real-time data visualization
   - Keycloak authentication
   - Responsive UI components

2. **Backend (8080)**
   - Spring Boot REST API
   - PostgreSQL integration
   - Token validation
   - Business logic

3. **Keycloak (9090)**
   - User authentication
   - Role-based access control
   - OAuth2/OpenID Connect
   - Pre-configured realm

4. **PostgreSQL (5432)**
   - User data
   - Portfolio information
   - Stock analytics
   - Performance metrics

## 👥 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Bryan Phone (@phonethantzaw)