FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY R7L/*.csproj ./R7L/
RUN dotnet restore R7L/R7L.csproj

COPY R7L/. ./R7L/
WORKDIR /src/R7L
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000 \
    ASPNETCORE_ENVIRONMENT=Development \
    DOTNET_EnableDiagnostics=0 \
    HTTP_PORTS= \
    HTTPS_PORTS=

USER appuser

EXPOSE 5000
ENTRYPOINT ["dotnet", "R7L.dll"]