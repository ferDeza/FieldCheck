# Build stage
FROM gradle:8.14-jdk21 AS builder
WORKDIR /app
COPY . .


RUN mkdir -p src/main/resources/certs && \
    cp public.pem src/main/resources/certs/ 2>/dev/null || true && \
    cp private.pem src/main/resources/certs/ 2>/dev/null || true

RUN chmod +x ./gradlew && ./gradlew clean build -x test

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]