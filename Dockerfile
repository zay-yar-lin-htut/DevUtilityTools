FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
RUN npm install -g pnpm
COPY API/ClientApp/package.json API/ClientApp/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY API/ClientApp/ ./
RUN pnpm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY API/API.csproj ./
RUN dotnet restore API.csproj
COPY API/ ./
RUN dotnet build "API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=frontend-build /app/frontend/dist ./wwwroot
EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]