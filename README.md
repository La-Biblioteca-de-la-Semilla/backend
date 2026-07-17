# La Biblioteca del Club de la Semilla - Entorno de Desarrollo Local

Este documento explica cómo configurar un entorno de desarrollo local para el proyecto "La Biblioteca del Club de la Semilla", incluyendo la configuración de los emuladores de Firebase para simular Firestore y otros servicios de Firebase.

## Requisitos Previos

- Node.js (versión 22 o superior)
- npm (incluido con Node.js)
- Java JDK (versión 11 o superior) - **Requerido para los emuladores de Firebase**
- Firebase CLI (`npm install -g firebase-tools`)


## Configuración del Entorno Local

### 1. Instalar Dependencias

```bash
# En el directorio raíz del proyecto
npm install

# En el directorio de functions
cd functions
npm install
```

### 2. Iniciar los Emuladores de Firebase

Hemos configurado el proyecto para utilizar los emuladores de Firebase, lo que te permite desarrollar y probar la aplicación sin conectarte a los servicios de Firebase en producción.

Para iniciar todos los emuladores (Functions, Firestore, Auth, Storage):

```bash
cd functions
npm run serve
```

Esto iniciará:
- Emulador de Functions en el puerto 5001
- Emulador de Firestore en el puerto 8080
- Emulador de Auth en el puerto 9099
- Emulador de Storage en el puerto 9199
- UI de los emuladores (accesible en http://localhost:4000)

También puedes usar estos scripts adicionales:

```bash
# Iniciar emuladores con la variable de entorno FIRESTORE_EMULATOR_HOST configurada
npm run serve:dev

# Iniciar emuladores con persistencia de datos
npm run serve:with-data
```

### 3. Persistencia de Datos en los Emuladores

Por defecto, los datos en los emuladores se pierden cuando los emuladores se detienen. Para mantener los datos entre sesiones, puedes usar el script `serve:with-data` que hemos configurado:

```bash
cd functions
npm run serve:with-data
```

Este script inicia los emuladores con las opciones `--import=../emulator-data` y `--export-on-exit=../emulator-data`, lo que permite cargar datos existentes al iniciar y guardar los datos al detener los emuladores.

### 4. Cargar Datos de Prueba

Ya hemos creado un script para cargar datos de prueba en el emulador de Firestore. El script utiliza la API de Firestore para insertar datos de semillas, usuarios, organizaciones y sugerencias.

Para ejecutar el script de carga de datos:

```bash
cd functions
npm run seed
```

Este script cargará los datos de ejemplo definidos en `scripts/seed-data.json`. Puedes modificar este archivo para añadir, modificar o eliminar datos de prueba según tus necesidades.

⚠️ **IMPORTANTE**: Este script está diseñado para ejecutarse **únicamente** contra el emulador local y nunca contra la base de datos de producción. Esto es una medida de seguridad para proteger los datos de producción.

Para ejecutar el script:

```bash
# Asegúrate de que el emulador de Firestore esté en ejecución
cd functions
npm run seed
```

Si intentas ejecutar el script sin el emulador en ejecución, recibirás un mensaje de error y el script se detendrá.

## Configuración de Variables de Entorno

El proyecto utiliza variables de entorno para configurar ciertos aspectos, como las claves de API para servicios externos. Hay dos formas de configurar estas variables, dependiendo del entorno:

### Variables de Entorno para Desarrollo (con dotenv)

Para el entorno de desarrollo local, utilizamos archivos `.env` que son cargados automáticamente por la biblioteca dotenv:

1. Crea un archivo `.env.development` en el directorio `functions/` (si no existe ya)
2. Añade las variables de entorno necesarias en el formato `CLAVE=valor`

Ejemplo de `.env.development`:
```
IMGBB_API_KEY=tu_api_key_aquí
```

El sistema cargará automáticamente el archivo `.env.development` cuando NODE_ENV sea "development" (valor por defecto).

### Variables de Entorno para Producción (con Firebase Functions)

Para el entorno de producción, utilizamos la configuración de Firebase Functions:

```bash
# Configurar una variable de entorno para producción
firebase functions:config:set imgbb.api_key="tu_api_key_aquí"

# Verificar la configuración actual
firebase functions:config:get
```

En el código, estas variables se acceden a través de la clase `EnvConfigService`, que busca primero en la configuración de Firebase y luego en las variables de entorno locales.

### Variables de Entorno Requeridas

- **IMGBB_API_KEY**: Clave de API para el servicio ImgBB (usado para almacenar imágenes)
  - Desarrollo: `IMGBB_API_KEY=tu_api_key_aquí` en `.env.development`
  - Producción: `firebase functions:config:set imgbb.api_key="tu_api_key_aquí"`

## Emulador de PostgreSQL (Base de Datos Local)

El proyecto usa PostgreSQL como base de datos principal. Para desarrollo local se incluye un `docker-compose.yml` que levanta una instancia de PostgreSQL sin necesidad de instalar nada más que Docker.

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine + Compose

### Iniciar la base de datos

```bash
# Desde el directorio functions/
npm run db:start
```

Esto levanta un contenedor PostgreSQL 16 en `localhost:5432` con:
- **Usuario**: `seeds`
- **Contraseña**: `seeds`
- **Base de datos**: `seeds_db`

Los datos persisten en un volumen Docker entre reinicios.

### Configurar la conexión

Copia `.env.example` a `.env` en el directorio `functions/` y ajusta si es necesario:

```bash
cp functions/.env.example functions/.env
```

El valor por defecto ya apunta al contenedor local:
```
DATABASE_URL=postgresql://seeds:seeds@localhost:5432/seeds_db
```

### Ejecutar las migraciones

Una vez la base de datos esté en marcha, aplica el esquema:

```bash
cd functions
npm run migrate
```

### Parar la base de datos

```bash
cd functions
npm run db:stop
```

### Flujo completo de desarrollo

```bash
# 1. Levantar PostgreSQL
cd functions && npm run db:start

# 2. Aplicar migraciones (solo la primera vez o tras nuevas migraciones)
npm run migrate

# 3. Iniciar los emuladores de Firebase + Functions
npm run serve
```

---

## Estructura del Proyecto

El proyecto está organizado en módulos:

- **seeds**: Gestión de semillas
- **users**: Gestión de usuarios
- **organizations**: Gestión de organizaciones
- **images**: Gestión de imágenes
- **suggestions**: Gestión de sugerencias

Cada módulo sigue una arquitectura hexagonal con:
- **domain**: Entidades y repositorios
- **application**: Casos de uso
- **infrastructure**: Implementaciones de repositorios y API

## Desarrollo con Emuladores

Cuando desarrollas con los emuladores, el código detecta automáticamente si está ejecutándose en un entorno de emulador y se conecta a los servicios locales en lugar de los servicios de producción.

Esto se configura en `functions/src/index.ts`:

```typescript
// Connect to Firestore emulator if running locally
if (process.env.FUNCTIONS_EMULATOR === "true") {
    logger.info("Using Firestore emulator");
    admin.firestore().settings({
        host: "localhost:8080",
        ssl: false,
    });
}
```

## Solución de Problemas

### Problemas con los Emuladores

Si tienes problemas con los emuladores:

1. Asegúrate de que los puertos no estén siendo utilizados por otras aplicaciones
2. Intenta detener y reiniciar los emuladores
3. Borra la caché de los emuladores: `firebase emulators:start --only firestore --clear-targets`

### Problemas de Conexión

Si la aplicación no se conecta a los emuladores:

1. Verifica que los emuladores estén en ejecución
2. Comprueba que la aplicación esté configurada para usar los emuladores
3. Revisa los logs para ver si hay errores de conexión
