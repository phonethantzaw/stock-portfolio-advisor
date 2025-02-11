# Stock Portfolio Advisor

A modern web application that helps users manage and optimize their stock portfolios with intelligent insights and recommendations.

## Project Overview

The Stock Portfolio Advisor is a full-stack application built with:

### Frontend (Next.js Application)
- **Framework**: Next.js 14.2
- **UI Components**: Shadcn UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **Language**: TypeScript/React 18

### Backend (Spring Boot Application)
- **Framework**: Spring Boot 3.4.2
- **Database**: PostgreSQL
- **Language**: Java 17
- **Build Tool**: Maven

## Features

- Modern, responsive user interface
- Real-time stock portfolio management
- Data visualization and analytics
- Secure user authentication
- RESTful API integration

## Getting Started

### Prerequisites

- Node.js (LTS version)
- Java 17 or higher
- Docker and Docker Compose
- PostgreSQL

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd stock-portfolio-advisor-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd stock-portfolio-advisor-backend
   ```

2. Build the project:
   ```bash
   ./mvnw clean install
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Docker Support

The project includes Docker support for easy deployment. Use Docker Compose to run both frontend and backend services:

```bash
docker-compose up
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.