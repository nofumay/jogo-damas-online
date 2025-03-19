FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# Imprimir o conteúdo do diretório para debug
RUN ls -la
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
