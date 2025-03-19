FROM maven:3.9-eclipse-temurin-17

# Diretório de trabalho
WORKDIR /app

# Copiar o pom.xml primeiro para aproveitar o cache de dependências
COPY pom.xml .

# Copiar o código-fonte
COPY src/ src/
COPY system.properties .

# Executar o Maven para construir
RUN ls -la && mvn clean package -DskipTests

# Configurar variáveis de ambiente
ENV PORT=8080

# Expor a porta
EXPOSE ${PORT}

# Comando para iniciar a aplicação
CMD ["java", "-jar", "target/*.jar"]
