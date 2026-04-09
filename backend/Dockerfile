# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore backend.csproj
RUN dotnet publish backend.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "backend.dll"]

FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=root123
ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=pass123

EXPOSE 3306