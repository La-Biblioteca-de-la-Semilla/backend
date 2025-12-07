const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Cargar la configuración del servicio
const serviceAccount = require('../../config/serviceAccountKey.json');

// Este script solo debe ejecutarse contra el emulador local
// Verificar si estamos en el emulador
const isEmulator = process.env.FIRESTORE_EMULATOR_HOST === 'localhost:8080' || process.env.USE_EMULATOR !== 'false';

if (!isEmulator) {
  console.error('ERROR: Este script solo puede ejecutarse contra el emulador local.');
  console.error('Por favor, asegúrese de que el emulador de Firestore está en ejecución y ejecute:');
  console.error('USE_EMULATOR=true node scripts/seed-firestore.js');
  console.error('O configure manualmente la variable de entorno FIRESTORE_EMULATOR_HOST=localhost:8080');
  process.exit(1);
}

// Configurar para usar el emulador
console.log('Usando emulador de Firestore en localhost:8080');
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Inicializar Firebase con la configuración adecuada
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});
const db = admin.firestore();

// Cargar datos de ejemplo
const seedData = require('./seed-data.json');

async function seedFirestore() {
  try {
    // Cargar semillas
    console.log('Cargando semillas...');
    for (const seed of seedData.seeds) {
      await db.collection('seeds').doc(seed.id).set(seed);
      console.log(`Semilla añadida: ${seed.name}`);
    }

    // Cargar usuarios
    console.log('Cargando usuarios...');
    for (const user of seedData.users) {
      await db.collection('users').doc(user.id).set(user);
      console.log(`Usuario añadido: ${user.name}`);
    }

    // Cargar organizaciones
    console.log('Cargando organizaciones...');
    for (const org of seedData.organizations) {
      await db.collection('organizations').doc(org.id).set(org);
      console.log(`Organización añadida: ${org.name}`);
    }

    // Cargar sugerencias
    console.log('Cargando sugerencias...');
    for (const suggestion of seedData.suggestions) {
      await db.collection('suggestions').doc(suggestion.id).set(suggestion);
      console.log(`Sugerencia añadida para semilla: ${suggestion.seedId}`);
    }

    console.log('Datos cargados correctamente');
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

seedFirestore();
