# Asesoría Financiera - Gestión de Citas

## 1. Project Description
Aplicación web profesional para la gestión de citas de asesoría financiera. Los clientes pueden reservar citas con analistas financieros, seleccionando fecha y horario según disponibilidad en tiempo real. Incluye un panel administrativo para gestionar y visualizar todas las citas.

## 2. Page Structure
- `/` - Landing page con presentación del servicio y botón "Reservar cita"
- `/reservar` - Página de reserva con formulario completo
- `/admin` - Panel administrativo con dashboard y agenda
- `/admin/calendario` - Vista de calendario con filtros
- `*` - Página 404

## 3. Core Features
- [ ] Landing page profesional con información del servicio
- [ ] Formulario de reserva con validaciones
- [ ] Selección de analista, fecha y horario
- [ ] Disponibilidad en tiempo real (Supabase Realtime)
- [ ] Prevención de reservas duplicadas
- [ ] Panel administrativo con dashboard de estadísticas
- [ ] Agenda por analista con tabla ordenable
- [ ] Vista de calendario con filtros
- [ ] Diseño responsive (desktop, tablet, móvil)

## 4. Data Model Design

### Table: analysts
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Nombre del analista |
| active | boolean | Si está activo |

### Table: analyst_availability
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| analyst_id | uuid | FK → analysts.id |
| day_of_week | int | Día de la semana (0=Domingo, 1=Lunes...) |
| start_time | time | Hora de inicio |
| end_time | time | Hora de fin |

### Table: clients
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| full_name | text | Nombre completo |
| phone | text | Número de teléfono |
| email | text | Correo electrónico (opcional) |

### Table: appointments
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| analyst_id | uuid | FK → analysts.id |
| client_id | uuid | FK → clients.id |
| appointment_date | date | Fecha de la cita |
| appointment_time | time | Hora de la cita |
| status | text | Pending / Confirmed / Cancelled / Completed |
| comments | text | Comentarios (opcional) |
| created_at | timestamptz | Fecha de creación |

## 5. Backend / Third-party Integration Plan
- **Supabase**: Backend completo - base de datos, Realtime para sincronización en tiempo real, y autenticación (preparada para futuro)

## 6. Development Phase Plan

### Phase 1: Fundación - Supabase + Landing Page + Base de Datos
- Goal: Conectar Supabase, crear tablas, construir la landing page
- Status: ✅ COMPLETADO
- Deliverable: Landing page funcional con diseño profesional, tablas creadas en Supabase

### Phase 2: Sistema de Reservas
- Goal: Formulario de reserva completo con selección de analista, fecha, horario y disponibilidad en tiempo real
- Status: ✅ COMPLETADO
- Deliverable: Página de reserva funcional con validaciones, prevención de duplicados y Realtime

### Phase 3: Panel Administrativo
- Goal: Dashboard con estadísticas, agenda por analista y vista de calendario
- Status: ✅ COMPLETADO
- Deliverable: Panel admin completo con todas las vistas y filtros

### Phase 4: Pulido Final
- Goal: Animaciones, responsive fino, edge cases, mensajes de error/success
- Deliverable: Aplicación lista para producción