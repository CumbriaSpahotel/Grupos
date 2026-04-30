
const admin = require('firebase-admin');
const serviceAccount = require('c:\\Users\\comun\\Documents\\GitHub\\Grupos\\serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkGroup() {
    console.log("Checking for group 208387...");
    const snapshot = await db.collection('groups').where('Reserva', '==', '208387').get();
    if (snapshot.empty) {
        console.log("No group found with Reserva == '208387' (Literal)");
        
        // Try normalized ID
        const normId = '208387'; 
        const doc = await db.collection('groups').doc(normId).get();
        if (doc.exists) {
            console.log("Found group by doc ID:", doc.id, doc.data());
        } else {
            console.log("No group found with doc ID == '208387'");
            
            // Try searching by name
            const nameSnapshot = await db.collection('groups').where('Nombre del Grupo', '>=', 'NUTRECO').get();
            if (nameSnapshot.empty) {
                console.log("No group found with name containing 'NUTRECO'");
            } else {
                nameSnapshot.forEach(d => {
                    console.log("Found by name:", d.id, d.data());
                });
            }
        }
    } else {
        snapshot.forEach(doc => {
            console.log("Found group:", doc.id, doc.data());
        });
    }
}

checkGroup().catch(console.error);
