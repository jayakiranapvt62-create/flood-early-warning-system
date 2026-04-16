# Flood Early Warning System - Sri Lanka

A GIS-enabled web application that helps users identify flood risk zones in Sri Lanka using GPS, Spring Boot, MySQL Spatial features, and Leaflet.js.

## Project Owner

- **Name:** Roshan
- **AQ ID:** AQ-185421
- **Role:** Full-Stack Developer (Backend + Frontend)

## Features

- Live location check using browser GPS
- Flood risk result (`LOW`, `MEDIUM`, `HIGH`)
- Nearest flood-prone zone display
- Water level indicator
- Emergency contacts by district
- AI safety assistant panel
- Responsive modern UI with map and navigation

## Tech Stack

- **Backend:** Spring Boot, Spring Data JPA, Validation
- **Database:** MySQL 8 (Spatial: `POINT`, `POLYGON`)
- **Frontend:** HTML5, CSS3, JavaScript, Leaflet.js, Tailwind CDN

## Project Structure

```text
backend/
  src/main/java/com/srilanka/floodwarning/
    controller/
    service/
    repository/
    entity/
    dto/
  src/main/resources/application.properties
  pom.xml

frontend/
  index.html
  style.css
  app.js