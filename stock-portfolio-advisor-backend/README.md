# Stock Portfolio Advisor

A Spring Boot-based backend application that provides stock portfolio management and advisory services.

## 🚀 Features

- Stock portfolio management
- Data-driven investment recommendations
- RESTful API endpoints
- PostgreSQL database integration
- Docker support for easy deployment

## 🛠️ Technologies

- Java 17
- Spring Boot 3.4.2
- Spring Data JDBC
- PostgreSQL
- Docker & Docker Compose
- Maven

## 📋 Prerequisites

- Java 17 or higher
- Maven
- Docker and Docker Compose
- PostgreSQL

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/phonethantzaw/stock-portfolio-advisor.git
cd stock-portfolio-advisor-backend
```

2. Build the project:
```bash
./mvnw clean install
```

3. Run with Docker Compose:
```bash
docker compose up
```

The application will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
stock-portfolio-advisor-backend/
├── src/                    # Source files
├── .mvn/                   # Maven wrapper directory
├── docker-compose.yaml     # Docker compose configuration
├── pom.xml                # Maven dependencies
└── README.md              # Project documentation
```

## 🔌 API Endpoints

Documentation for API endpoints will be available at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/v3/api-docs`

## 🛠️ Development

To run the application locally:

```bash
./mvnw spring-boot:run
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Ko Phone (@phonethantzaw)

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
