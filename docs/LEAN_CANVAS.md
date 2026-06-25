# Lean Canvas — DNIPRO

> DNI Profesional Web3 | Universidad Champagnat | Junio 2026

---

## 🔴 Problema

Las tres principales frustraciones de nuestros usuarios:

1. **CVs no verificables** — cualquiera puede escribir lo que quiera sin respaldo real
2. **Certificados falsificables** — un PDF con firma digital se replica en minutos con Canva
3. **Experiencia dispersa e informal** — freelancers, hackathones y voluntariados no tienen validación objetiva

**Alternativas existentes que fallan:**
- LinkedIn: no verifica nada, el usuario se autoinforma
- Certificados PDF: no tienen mecanismo de verificación independiente
- Correo/carta de recomendación: depende de intermediarios y es subjetivo

---

## 👥 Segmentos de Clientes

**Usuario principal — el Profesional:**
- Estudiantes universitarios y recién egresados
- Desarrolladores y técnicos con experiencia autodidacta
- Freelancers sin empleador formal
- Participantes de hackathones y proyectos open source

**Cliente pagador — el Emisor:**
- Universidades e instituciones educativas
- Empresas que contratan pasantes y empleados
- Organizaciones de hackathones y eventos tech
- ONGs y organizaciones de voluntariado

**Usuario secundario — el Verificador:**
- Reclutadores y áreas de RRHH
- Clientes que contratan freelancers
- Instituciones que evalúan candidatos

---

## 💡 Propuesta de Valor Única

> **Credenciales profesionales imposibles de falsificar, verificables en segundos por cualquier persona en el mundo, sin intermediarios.**

Para el **profesional:** una identidad verificable que lo diferencia en el mercado laboral.

Para el **emisor:** emitir credenciales que refuerzan su autoridad institucional sin procesos administrativos.

Para el **verificador:** certeza instantánea sobre la autenticidad de la trayectoria de un candidato, sin llamar a nadie.

---

## ✅ Solución

Una plataforma web donde:

1. **El emisor** completa un formulario y emite un Soulbound Token directamente a la wallet del profesional — la transacción queda registrada en blockchain de forma permanente
2. **El profesional** conecta su wallet y ve todas sus credenciales agrupadas en su perfil: Educación, Trabajo, Proyectos e Impacto Social
3. **El verificador** abre una URL pública — sin instalar nada, sin wallet — y ve las credenciales verificadas on-chain en tiempo real

---

## 📢 Canales

**Adquisición de emisores (B2B):**
- Visitas directas a universidades y centros de formación
- Alianzas con organizadores de hackathones
- Integraciones con plataformas de empleo (LinkedIn, Bumeran)

**Adquisición de profesionales:**
- Boca a boca dentro de comunidades tech
- Redes sociales orientadas a developers (Twitter/X, Discord)
- Integración como badge verificable en perfiles de LinkedIn y GitHub

---

## 💰 Fuentes de Ingresos

| Fuente | Modelo | Target |
|---|---|---|
| Suscripción emisores | Mensual / anual B2B | Universidades y empresas |
| Plan premium profesional | Freemium → pago | Analytics, exportación, portfolio |
| API para reclutadores | Por consulta o suscripción | HR Tech, ATS, plataformas de empleo |
| Servicios de integración | Proyecto único | Empresas que integran con sus sistemas |

---

## 🏗️ Estructura de Costos

| Costo | Tipo |
|---|---|
| Infraestructura cloud (frontend + backend) | Variable |
| Gas fees en Polygon (por transacción) | Variable — muy bajo en Polygon |
| Pinata IPFS (almacenamiento de metadatos) | Fijo mensual |
| Desarrollo y mantenimiento | Fijo |
| Auditoría de smart contracts | Puntual (antes de mainnet) |

> **Ventaja:** la verificación es gratuita e infinitamente escalable — leer la blockchain no tiene costo.

---

## 📊 Métricas Clave

| Métrica | Descripción |
|---|---|
| Credenciales emitidas / mes | Indicador de adopción de emisores |
| Verificaciones realizadas / mes | Indicador de valor percibido por el mercado |
| Emisores activos | Instituciones que usaron la plataforma en los últimos 30 días |
| Wallets con al menos 1 credencial | Base de usuarios activos |
| Tasa de conversión freemium → premium | Salud del modelo de negocio |

---

## 🛡️ Ventaja Diferencial

Lo que **no pueden copiar fácilmente:**

- **Inmutabilidad blockchain:** una vez emitida, la credencial no puede modificarse ni borrarse — ni siquiera por nosotros
- **Sin intermediarios:** la verificación es directa en la blockchain, no depende de nuestra plataforma estando online
- **Estándar abierto ERC-721:** cualquier wallet, explorador o plataforma puede leer los tokens sin permiso
- **Red de emisores autorizados:** el valor crece con cada institución que se suma — efecto de red

---

## 📋 Resumen Visual

```
┌─────────────────┬──────────────────┬──────────────────────────┬──────────────────┬──────────────┐
│   PROBLEMA      │    SOLUCIÓN      │   PROPUESTA DE VALOR     │    VENTAJA       │  SEGMENTOS   │
│                 │                  │         ÚNICA            │  DIFERENCIAL     │              │
│ • CVs falsos    │ SBT on-chain     │ Credenciales imposibles  │ Inmutabilidad    │ Profesionales│
│ • Certs. fals.  │ por institución  │ de falsificar,           │ blockchain.      │ Estudiantes  │
│ • Info dispersa │ autorizada.      │ verificables en          │ Sin servidor     │ Freelancers  │
│                 │ Perfil unif.     │ segundos por             │ central.         │ Universidades│
│                 │ por categoría.   │ cualquier persona        │ Estándar abierto │ Empresas     │
│                 │ Verif. pública   │ en el mundo.             │ ERC-721.         │ Reclutadores │
│                 │ sin wallet.      │                          │                  │              │
├─────────────────┴──────────────────┤                          ├──────────────────┴──────────────┤
│         MÉTRICAS CLAVE             │                          │          CANALES                │
│                                    │                          │                                 │
│ • Credenciales / mes               │                          │ • Visitas directas B2B          │
│ • Verificaciones / mes             │                          │ • Comunidades tech              │
│ • Emisores activos                 │                          │ • Alianzas hackathones          │
│ • Wallets con SBT                  │                          │ • Integraciones plataformas     │
├────────────────────────────────────┴──────────────────────────┴─────────────────────────────────┤
│              ESTRUCTURA DE COSTOS                    │              FUENTES DE INGRESO           │
│                                                      │                                           │
│  Infraestructura · Gas fees · IPFS · Desarrollo      │  Suscripción B2B · Freemium · API · Integr│
└──────────────────────────────────────────────────────┴───────────────────────────────────────────┘
```

---

*DNIPRO — Facundo Silva · Iván Vargas · Nicolás Garín — Universidad Champagnat — Junio 2026*
