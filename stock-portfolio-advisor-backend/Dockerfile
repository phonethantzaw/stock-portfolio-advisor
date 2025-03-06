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
ENV SPRING_PROFILES_ACTIVE=dev


# Port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]