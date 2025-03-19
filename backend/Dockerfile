FROM maven:3.9-eclipse-temurin-17

WORKDIR /app
COPY . .

# Para debug - mostrar arquivos 
RUN ls -la
RUN ls -la src/main/resources/

# Mais detalhes no log
ENV MAVEN_OPTS="-Xmx512m"

EXPOSE 8080

# Comando com mais logs para debug
CMD ["sh", "-c", "mvn -X spring-boot:run"]
