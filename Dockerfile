FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY API/ClientApp/package*.json API/ClientApp/pnpm-lock.yaml ./
RUN npm ci
COPY API/ClientApp/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY API/Api.sln ./
COPY API/API.csproj API/
RUN dotnet restore Api.sln
COPY API/ ./
RUN dotnet build "API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false
RUN mkdir -p /app/publish/wwwroot
COPY --from=frontend-build /app/frontend/dist/* /app/publish/wwwroot/

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]