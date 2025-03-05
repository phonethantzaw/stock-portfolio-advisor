# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create a non-root user
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy jar from build stage with specific name
COPY --from=build /app/target/stock-advisor-api-0.0.1.jar app.jar

# Environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV JWT_ISSUER_URI="https://keycloak.phonethantzaw.cloud/realms/stock-advisor"
ENV POSTGRES_URL="jdbc:postgresql://137.184.127.217:5432/stock_advisor"
ENV STOCK_API_URL="https://financialmodelingprep.com/api/v3"
ENV FRONTEND_URL="https://stockadvisor.phonethantzaw.cloud"

# Port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]