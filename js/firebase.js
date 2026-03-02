// --- FIREBASE FIRESTORE LEAD CAPTURE LOGIC ---

// IMPORTANT: Replace this config object with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAXpmSLVVadvgVYPwLS1D2FtrI_IrQaQs",
    authDomain: "calle9-2ca66.firebaseapp.com",
    projectId: "calle9-2ca66",
    storageBucket: "calle9-2ca66.firebasestorage.app",
    messagingSenderId: "1064897799867",
    appId: "1:1064897799867:web:740a957d9d742e63f1ab9e",
    measurementId: "G-VVHNJ5M231"
};

let db;

// Initialize Firebase only if the config is updated
if (firebaseConfig.apiKey !== "YOUR_API_KEY" && window.firebase) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Firestore Client Initialized");
} else {
    console.warn("Firebase not initialized. Using Mock submission for Demo.");
}

window.submitConversationalLead = async function (leadData) {
    console.log("Submitting conversational lead to Firebase:", leadData);
    try {
        if (db) {
            await db.collection("real_estate_leads").add({
                name: leadData.name,
                phone: leadData.phone,
                email: leadData.email,
                score: leadData.score,
                date_preference: leadData.date,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Mock Submission for Local Demonstration
            await new Promise(r => setTimeout(r, 1500));
            console.log("Mock lead captured successfully:", leadData);
        }
        return { success: true };
    } catch (error) {
        console.error("Error inserting lead to Firebase:", error);
        return { success: false, error };
    }
};
