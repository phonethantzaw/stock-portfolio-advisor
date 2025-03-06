# Stock Portfolio Advisor

A modern web application that helps users manage and optimize their stock portfolios with intelligent insights and recommendations.

## Project Overview

The Stock Portfolio Advisor is a full-stack application built with:

### Frontend
- **Framework**: Next.js 14.2
- **UI Components**: Shadcn UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **Language**: TypeScript/React 18
- **Authentication**: Keycloak integration

### Backend
- **Framework**: Spring Boot 3.4.2
- **Database**: PostgreSQL
- **Language**: Java 17
- **Build Tool**: Maven
- **Security**: OAuth2/OpenID Connect with Keycloak

### Infrastructure
- **Authentication Server**: Keycloak 24.0.2
- **Database**: PostgreSQL 16
- **Container Platform**: Docker
- **Service Orchestration**: Docker Compose

## Features

- Modern, responsive user interface
- Real-time stock portfolio management
- Data visualization and analytics
- Secure authentication with Keycloak
- RESTful API integration

## Getting Started

### Prerequisites

- Docker Desktop (latest version)
- Docker Compose

No need to install Node.js, Java, or PostgreSQL locally as everything runs in containers!

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-portfolio-advisor.git
   cd stock-portfolio-advisor
   ```

2. Create necessary .env files:
   - Backend `.env`:
     ```
     SPRING_PROFILES_ACTIVE=dev
     JWT_ISSUER_URI=http://keycloak:8080/realms/stock-advisor
     ```

### Running the Application

1. Start all services using Docker Compose:
   ```bash
   docker compose up --build
   ```

2. Access the services:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Keycloak Admin: http://localhost:9090
   - PostgreSQL: localhost:5432

### Development Commands

```bash
# Start services in detached mode
docker compose up -d

# View logs
docker compose logs

# View logs for specific service
docker compose logs frontend
docker compose logs backend

# Stop all services
docker compose down

# Rebuild specific service
docker compose up --build frontend
```

### Service Architecture

1. **Frontend (port 3000)**
   - Next.js application
   - Communicates with backend API
   - Authenticates via Keycloak

2. **Backend (port 8080)**
   - Spring Boot REST API
   - Connects to PostgreSQL
   - Validates Keycloak tokens

3. **Keycloak (port 9090)**
   - Handles authentication/authorization
   - Pre-configured realm for the application
   - Default admin credentials: admin/admin

4. **PostgreSQL (port 5432)**
   - Persistent data storage
   - Automatically initialized with required schemas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.