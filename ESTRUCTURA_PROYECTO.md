# 📁 ESTRUCTURA DEL PROYECTO - FieldCheck Actualizado

## Backend (Spring Boot)

```
backend/
├── src/
│   ├── main/java/com/app/fieldcheck/
│   │   ├── controllers/
│   │   │   ├── AuthController.java          ✓ (sin cambios)
│   │   │   ├── SportFieldController.java    ✏️ MODIFICADO (filtros)
│   │   │   ├── BookingController.java       ✓ (sin cambios)
│   │   │   ├── UsersController.java         ✓ (sin cambios)
│   │   │   ├── ScheduleController.java      🆕 NUEVO
│   │   │   └── AdminController.java         🆕 NUEVO
│   │   │
│   │   ├── models/
│   │   │   ├── User.java                    ✓ (sin cambios)
│   │   │   ├── SportField.java              ✏️ MODIFICADO (atributos)
│   │   │   ├── Booking.java                 ✓ (sin cambios)
│   │   │   └── Schedule.java                🆕 NUEVO
│   │   │
│   │   ├── repositories/
│   │   │   ├── UserRepository.java          ✓ (sin cambios)
│   │   │   ├── SportFieldRepository.java    ✓ (sin cambios)
│   │   │   ├── BookingRepository.java       ✓ (sin cambios)
│   │   │   └── ScheduleRepository.java      🆕 NUEVO
│   │   │
│   │   ├── services/
│   │   │   ├── AuthService.java             ✓ (sin cambios)
│   │   │   ├── SportFieldService.java       ✏️ MODIFICADO (filtros)
│   │   │   ├── BookingService.java          ✓ (sin cambios)
│   │   │   ├── ScheduleService.java         🆕 NUEVO
│   │   │   └── AdminService.java            🆕 NUEVO
│   │   │
│   │   ├── web/dtos/
│   │   │   ├── LoginRequest.java            ✓ (sin cambios)
│   │   │   ├── LoginResponse.java           ✓ (sin cambios)
│   │   │   ├── RegisterRequest.java         ✓ (sin cambios)
│   │   │   ├── UserResponse.java            ✓ (sin cambios)
│   │   │   ├── BookingDTO.java              ✓ (sin cambios)
│   │   │   ├── BookingRequest.java          ✓ (sin cambios)
│   │   │   ├── BookingWebDTO.java           ✓ (sin cambios)
│   │   │   ├── ScheduleDTO.java             🆕 NUEVO
│   │   │   └── AdminDashboardDTO.java       🆕 NUEVO
│   │   │
│   │   ├── enums/
│   │   │   └── UserRole.java                ✓ (sin cambios)
│   │   │
│   │   └── FieldCheckApplication.java       ✓ (sin cambios)
│   │
│   └── resources/
│       ├── application.yml                  ✓ (sin cambios)
│       └── application-test.yml             ✓ (sin cambios)
│
├── build/                                   (build artifacts)
├── gradle/
├── build.gradle                            ✓ (sin cambios)
├── settings.gradle                         ✓ (sin cambios)
└── gradlew                                 ✓ (sin cambios)
```

---

## Frontend (React)

```
frontend/
├── public/
│   ├── index.html                          ✓ (sin cambios)
│   └── manifest.json                       ✓ (sin cambios)
│
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx                   ✓ (sin cambios)
│   │   ├── Dashboard.css                   ✓ (sin cambios)
│   │   ├── Login.jsx                       ✓ (sin cambios)
│   │   ├── Login.css                       ✓ (sin cambios)
│   │   ├── Register.jsx                    ✓ (sin cambios)
│   │   ├── Register.css                    ✓ (sin cambios)
│   │   ├── SportFields.jsx                 ✏️ MODIFICADO (filtros)
│   │   ├── SportFields.css                 ✏️ MODIFICADO (estilos)
│   │   ├── Bookings.jsx                    ✏️ MODIFICADO (ScheduleWeeklyView)
│   │   ├── Bookings.css                    ✏️ MODIFICADO (estilos)
│   │   ├── AdminDashboard.jsx              🆕 NUEVO
│   │   └── AdminDashboard.css              🆕 NUEVO
│   │
│   ├── components/
│   │   ├── Navigation.jsx                  ✏️ MODIFICADO (admin menu)
│   │   ├── Navigation.css                  ✓ (sin cambios)
│   │   ├── ProtectedRoute.jsx              ✓ (sin cambios)
│   │   ├── ScheduleWeeklyView.jsx          🆕 NUEVO
│   │   ├── KPICard.jsx                     🆕 NUEVO
│   │   └── (otros componentes)             ✓ (sin cambios)
│   │
│   ├── styles/
│   │   ├── ScheduleWeeklyView.css          🆕 NUEVO
│   │   ├── KPICard.css                     🆕 NUEVO
│   │   └── (otros estilos)                 ✓ (sin cambios)
│   │
│   ├── services/
│   │   ├── api.js                          ✏️ MODIFICADO (nuevos servicios)
│   │   └── (otros servicios)               ✓ (sin cambios)
│   │
│   ├── context/
│   │   └── AuthContext.jsx                 ✓ (sin cambios)
│   │
│   ├── api/
│   │   └── apiClient.ts                    ✓ (sin cambios)
│   │
│   ├── assets/
│   │   └── (imágenes)                      ✓ (sin cambios)
│   │
│   ├── App.tsx                             ✏️ MODIFICADO (ruta admin)
│   ├── App.css                             ✓ (sin cambios)
│   ├── index.tsx                           ✓ (sin cambios)
│   ├── index.css                           ✓ (sin cambios)
│   └── reportWebVitals.ts                  ✓ (sin cambios)
│
├── tsconfig.json                           ✓ (sin cambios)
├── package.json                            ✓ (sin cambios)
├── Dockerfile                              ✓ (sin cambios)
└── README.md                               ✓ (sin cambios)
```

---

## Root Project

```
fieldCheck/
├── backend/                                (Spring Boot)
├── frontend/                               (React)
├── compose.yaml                            ✓ (sin cambios)
├── Readme.md                               ✓ (sin cambios)
├── CAMBIOS_REALIZADOS.md                   🆕 NUEVO
├── GUIA_CONFIGURACION.md                   🆕 NUEVO
└── ESTRUCTURA_PROYECTO.md                  🆕 NUEVO (este archivo)
```

---

## 📊 RESUMEN DE CAMBIOS POR ÁREA

### Backend
- **Archivos Nuevos**: 5 (Schedule, ScheduleDTO, AdminDashboardDTO, ScheduleService, AdminService, ScheduleController, AdminController)
- **Archivos Modificados**: 2 (SportField, SportFieldService, SportFieldController)
- **Total de Cambios**: 12 clases/interfaces nuevas

### Frontend
- **Archivos Nuevos**: 5 (AdminDashboard.jsx, ScheduleWeeklyView.jsx, KPICard.jsx + 3 CSS)
- **Archivos Modificados**: 5 (SportFields, Bookings, Navigation, App.tsx, api.js)
- **Total de Cambios**: 13 archivos

---

## 🔄 FLUJO DE DATOS

### Admin Dashboard
```
AdminDashboard.jsx
    ↓
AdminService (api.js)
    ↓
/api/admin/dashboard → AdminService (backend)
    ↓
AdminDashboardDTO → AdminService.getDashboardStats()
    ↓
Mostrar KPICards + Tabla + Gráficos
```

### Catálogo de Canchas
```
SportFields.jsx (Filtros: distrito, tipo)
    ↓
SportFieldService.getAllSportFields(district, type)
    ↓
GET /api/fields?district=X&type=Y
    ↓
SportFieldController → SportFieldService
    ↓
List<SportField> con tarjetas, fotos, ratings
```

### Calendario de Disponibilidad
```
Bookings.jsx → ScheduleWeeklyView.jsx
    ↓
ScheduleService.getSchedulesByField(fieldId)
    ↓
GET /api/schedules/field/{fieldId}
    ↓
ScheduleController → ScheduleService
    ↓
Tabla semanal de horarios (MON-SUN, 07:00-22:00)
```

---

## 🎯 ESTADO DE LAS CARACTERÍSTICAS

### ✅ COMPLETADAS
- [x] Modelo Schedule con BD
- [x] Endpoints de horarios
- [x] Tabla semanal visual
- [x] Filtros de canchas (distrito, tipo)
- [x] Panel de administración
- [x] KPIs y estadísticas
- [x] Resumen de reserva con cálculo de precio
- [x] Navegación diferenciada por rol

### 🔄 EN PROGRESO
- [ ] Integración de datos reales con DB
- [ ] Mock data de horarios funcional

### ⏳ PENDIENTES (Fase 2)
- [ ] Integración Culqi
- [ ] Bloqueo de horarios (admin)
- [ ] Reportes avanzados
- [ ] Notificaciones por email
- [ ] Historial de reservas
- [ ] Sistema de calificaciones

---

## 📦 DEPENDENCIAS NUEVAS

### Backend
```gradle
// Ya están en build.gradle
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-security
postgresql driver
```

### Frontend
```json
// Ya están en package.json
react 19.2.4
react-router-dom 7.13.1
```

---

Última actualización: 23 de Mayo, 2026
Versión: 1.0
