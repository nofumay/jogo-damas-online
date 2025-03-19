FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar os arquivos de configuração primeiro
COPY . .

# Construir o aplicativo
RUN mvn clean package -DskipTests

# Segunda etapa: apenas o runtime Java
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar o JAR gerado da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Variáveis de ambiente
ENV PORT=8080

# Expor a porta da aplicação
EXPOSE ${PORT}

# Comando para iniciar a aplicação
CMD ["java", "-jar", "app.jar"]
