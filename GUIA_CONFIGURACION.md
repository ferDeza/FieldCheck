# 🔧 GUÍA DE CONFIGURACIÓN - FieldCheck Fase 1

## ⚡ INICIO RÁPIDO

### 1. Backend - Compilar cambios
```bash
cd backend
./gradlew clean build
./gradlew bootRun
```

### 2. Frontend - Instalar e iniciar
```bash
cd frontend
npm install
npm start
```

---

## 🗄️ BASE DE DATOS - Scripts SQL

Ejecuta estos scripts en PostgreSQL para crear las tablas necesarias:

### Tabla de Secuencias
```sql
CREATE SEQUENCE IF NOT EXISTS schedule_seq START WITH 1 INCREMENT BY 1;
```

### Tabla de Horarios
```sql
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT PRIMARY KEY DEFAULT nextval('schedule_seq'),
    field_id BIGINT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES sports_field(id)
);
```

### Alterar Tabla SportField
```sql
ALTER TABLE sports_field ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE sports_field ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE sports_field ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE sports_field ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);
ALTER TABLE sports_field ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION DEFAULT 4.5;
```

### Insertar Datos de Ejemplo
```sql
-- Insertar usuarios admin y cliente
INSERT INTO users (id, full_name, email, password, phone_number, role) VALUES
(1, 'Admin Sistema', 'admin@fieldcheck.com', '$2a$10$...', '999999999', 'ADMIN'),
(2, 'Juan Pérez', 'juan@email.com', '$2a$10$...', '987654321', 'CUSTOMER');

-- Insertar canchas de ejemplo
INSERT INTO sports_field (id, name, type, base_price, description, district, latitude, longitude, rating) VALUES
(1, 'Cancha 1 (Fútbol 7)', 'Fútbol 7', 120.00, 'Grass sintético, iluminación LED', 'Cayma', -16.4089, -71.5329, 4.8),
(2, 'Cancha 2 (Fútbol 5)', 'Fútbol 5', 100.00, 'Techada, piso de cemento', 'Yanahuara', -16.4034, -71.5200, 4.6),
(3, 'Cancha 3 (Vóley)', 'Vóley', 150.00, 'Grass sintético, techada', 'Cercado', -16.3988, -71.5367, 4.9),
(4, 'Cancha 4 (Fútbol 11)', 'Fútbol 11', 200.00, 'Grass natural, iluminación profesional', 'La Joya', -16.4150, -71.5450, 4.7);

-- Insertar horarios de ejemplo (lunes a viernes 7am-10pm)
INSERT INTO schedules (field_id, day_of_week, start_time, end_time, is_available) VALUES
(1, 'MON', '07:00', '22:00', true),
(1, 'TUE', '07:00', '22:00', true),
(1, 'WED', '07:00', '22:00', true),
(1, 'THU', '07:00', '22:00', true),
(1, 'FRI', '07:00', '22:00', true),
(1, 'SAT', '08:00', '20:00', true),
(1, 'SUN', '08:00', '20:00', true);
```

---

## 🔐 Autenticación - Datos de Prueba

### Usuario Admin
```
Email: admin@fieldcheck.com
Contraseña: admin123
Rol: ADMIN
```

### Usuario Cliente
```
Email: juan@email.com
Contraseña: password123
Rol: CUSTOMER
```

---

## 🌐 URLs de Acceso

### Desarrollo Local
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081/api
- **Swagger API**: http://localhost:8081/swagger-ui.html (si está configurado)

### Rutas Frontend
```
/login                  - Login
/register              - Registro
/dashboard             - Dashboard usuario
/admin-dashboard       - Panel admin (solo admin)
/sport-fields          - Catálogo de canchas
/bookings              - Mis reservas
```

### Endpoints Backend Principales
```
POST   /api/v1/auth/register            - Registrar
POST   /api/v1/auth/login               - Login (obtiene JWT)
GET    /api/fields                      - Canchas (con filtros)
GET    /api/schedules/field/{id}        - Horarios de cancha
POST   /api/v1/booking                  - Crear reserva
GET    /api/admin/dashboard             - Dashboard admin
GET    /api/admin/bookings-today        - Reservas del día
```

---

## 🐛 TROUBLESHOOTING

### Error: "No ScheduleWeeklyView data"
**Causa**: Los horarios son mock (aleatorios)
**Solución**: Conectar a API real o importar datos a BD

### Error: "admin-dashboard ruta no encontrada"
**Causa**: App.tsx no tiene la ruta
**Solución**: Verificar que AdminDashboard está importado en App.tsx

### Error: "No se muestran filtros de canchas"
**Causa**: SportFields.jsx no está actualizado
**Solución**: Recompilar frontend con `npm start`

### Error: CORS en browser
**Causa**: Backend no tiene CORS habilitado
**Solución**: Agregar a SecurityConfig:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

---

## 📝 VARIABLES DE ENTORNO

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8081/api
```

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fieldcheck
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Backend compila sin errores
- [ ] Frontend instala dependencias sin problemas
- [ ] BD PostgreSQL tiene tablas creadas
- [ ] Datos de ejemplo insertados
- [ ] Login funciona con usuario admin
- [ ] Login funciona con usuario cliente
- [ ] Admin ve panel en `/admin-dashboard`
- [ ] Cliente ve catálogo en `/sport-fields`
- [ ] Filtros de canchas funcionan
- [ ] Tabla de horarios se muestra en reservas
- [ ] Resumen de precio se calcula correctamente

---

## 🎯 FUNCIONALIDADES VERIFICADAS

✅ **Admin:**
- Ver dashboard con estadísticas
- Ver tabla de reservas del día
- Ver gráficos de ingresos
- Ver ranking de canchas

✅ **Cliente:**
- Filtrar canchas por distrito
- Filtrar canchas por tipo de deporte
- Ver tabla de horarios disponibles
- Seleccionar horario para reservar
- Ver resumen y precio total
- Crear reserva

✅ **General:**
- Navegación responsiva
- Colores consistentes (verde)
- Estilos profesionales
- Mensajes de error claros

---

## 📞 SOPORTE

Para reportar problemas o sugerencias:
1. Revisar este documento
2. Verificar logs del backend: `backend/build/logs/`
3. Verificar console del navegador (F12)
4. Consultar la memoria de cambios: `CAMBIOS_REALIZADOS.md`

---

Última actualización: 23 de Mayo, 2026
Versión: 1.0
