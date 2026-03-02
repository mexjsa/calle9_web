// --- AUTONOMOUS CHAT AGENT SCRIPT ---
const agentToggle = document.getElementById('agent-toggle');
const agentWindow = document.getElementById('agent-window');
const agentClose = document.getElementById('agent-close');
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const formContainer = document.getElementById('lead-form-container');

// State
let botLang = 'es';
let chatState = 'START';
let leadParams = { name: '', phone: '', email: '', date: '', score: 0 };

function resetLeadState() {
    chatState = 'START';
    leadParams = { name: '', phone: '', email: '', date: '', score: 0 };
}

// Called by main.js when lang changes
window.changeChatLanguage = function (lang) {
    botLang = lang;
    chatHistory.innerHTML = '';
    resetLeadState();

    // Welcome message changes
    let welcome = "¡Hola! Soy el asistente de Juan. Conozco todos los detalles de Calle 9. ¿Tienes alguna duda sobre mascotas, estacionamiento o la ubicación?";
    if (lang === 'en') welcome = "Hello! I am Juan's assistant. I know all the details of Calle 9. Do you have any questions about pets, parking, or location?";
    if (lang === 'fr') welcome = "Bonjour! Je suis l'assistant de Juan. J'ai tous les détails de Calle 9. Avez-vous des questions sur les animaux, le parking ou l'emplacement?";

    appendMessage(welcome, 'bot');
};

// Toggle Window
agentToggle.addEventListener('click', () => {
    agentWindow.classList.add('open');
    agentToggle.style.transform = 'scale(0)';
});

agentClose.addEventListener('click', () => {
    agentWindow.classList.remove('open');
    agentToggle.style.transform = 'scale(1)';
});

// Handle Chat
function handleUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Typing indication simulation
    setTimeout(async () => {
        if (chatState !== 'START') {
            await handleCaptureFlow(text);
        } else {
            const response = generateBotResponse(text.toLowerCase());
            appendMessage(response, 'bot');
        }
    }, 800);
}

async function handleCaptureFlow(msg) {
    switch (chatState) {
        case 'CAPTURE_NAME':
            leadParams.name = msg;
            chatState = 'CAPTURE_PHONE';
            appendMessage(botLang === 'es' ? "Gracias 😊 Ahora compárteme tu número telefónico." : (botLang === 'en' ? "Thanks 😊 Now share your phone number." : "Merci 😊 Maintenant, partagez votre numéro de téléphone."), 'bot');
            break;
        case 'CAPTURE_PHONE':
            const phoneRegex = /^\+?\d{10,15}$/;
            const phoneClean = msg.replace(/\s+/g, ''); // Allow spaces by removing them before validation
            if (!phoneRegex.test(phoneClean)) {
                appendMessage(botLang === 'es' ? "Ese no parece un número de teléfono válido 😅 Por favor, escríbelo de nuevo (solo números, al menos 10 dígitos)." : (botLang === 'en' ? "That doesn't look like a valid phone number 😅 Please enter it again (only numbers, at least 10 digits)." : "Cela ne ressemble pas à un numéro de téléphone valide 😅 Veuillez l'entrer à nouveau (uniquement des chiffres, au moins 10)."), 'bot');
                return;
            }
            leadParams.phone = phoneClean;
            chatState = 'CAPTURE_EMAIL';
            appendMessage(botLang === 'es' ? "Perfecto 📧 Ahora tu correo electrónico." : (botLang === 'en' ? "Perfect 📧 Now your email address." : "Parfait 📧 Maintenant, votre adresse e-mail."), 'bot');
            break;
        case 'CAPTURE_EMAIL':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/; // Requires @, no spaces, and a valid TLD
            if (!emailRegex.test(msg)) {
                appendMessage(botLang === 'es' ? "Ese correo parece tener algún detallito 😅 Asegúrate de que tenga un '@' y termine en '.com', '.org', etc., sin dejar espacios. ¿Podrías escribirlo de nuevo?" : (botLang === 'en' ? "That email seems to have a typo 😅 Make sure it has an '@' and ends in '.com', '.org', etc., without spaces. Could you type it again?" : "Cet e-mail semble comporter une erreur 😅 Assurez-vous qu'il contient un '@' et se termine par '.com', '.org', etc., sans espaces. Pourriez-vous le taper à nouveau ?"), 'bot');
                return;
            }
            leadParams.email = msg;
            chatState = 'WAITING_DATE_SELECTION';

            appendMessage(botLang === 'es' ? "¿Qué fecha prefieres para la visita? 📅" : (botLang === 'en' ? "What date do you prefer for the visit? 📅" : "Quelle date préférez-vous pour la visite ? 📅"), 'bot');

            // Generate next 4 Wednesdays
            const wednesdays = getNextFourWednesdays();

            // Create a container for the buttons
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('date-btn-container');
            btnContainer.style.display = 'flex';
            btnContainer.style.flexDirection = 'column';
            btnContainer.style.gap = '8px';
            btnContainer.style.marginTop = '10px';
            btnContainer.style.marginBottom = '10px';

            wednesdays.forEach(dateStr => {
                const btn = document.createElement('button');
                btn.textContent = dateStr;
                btn.style.padding = '8px 12px';
                btn.style.borderRadius = '20px';
                btn.style.border = '1px solid var(--accent-color)';
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--text-color, #2b3a2f)';
                btn.style.cursor = 'pointer';
                btn.style.fontFamily = 'var(--font-primary)';
                btn.style.transition = 'all 0.3s ease';

                btn.addEventListener('mouseover', () => {
                    btn.style.backgroundColor = 'var(--accent-color)';
                    btn.style.color = 'var(--bg-color)';
                });
                btn.addEventListener('mouseout', () => {
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = 'var(--text-color, #2b3a2f)';
                });

                btn.addEventListener('click', () => {
                    // Remove buttons after selection
                    btnContainer.remove();
                    // Disable text input while processing
                    chatInput.disabled = true;
                    chatSend.disabled = true;

                    handleDateSelection(dateStr);
                });

                btnContainer.appendChild(btn);
            });

            chatHistory.appendChild(btnContainer);
            chatHistory.scrollTop = chatHistory.scrollHeight;

            // Also disable input until they click a button
            chatInput.disabled = true;
            chatSend.disabled = true;
            chatInput.placeholder = botLang === 'es' ? "Selecciona una fecha arriba..." : (botLang === 'en' ? "Select a date above..." : "Sélectionnez une date ci-dessus...");

            break;
        case 'WAITING_DATE_SELECTION':
            // Users shouldn't be able to type here due to disabled input,
            // but just in case, ignore text input if we are in this state.
            break;
    }
}

function getNextFourWednesdays() {
    const dates = [];
    let d = new Date();
    d.setDate(d.getDate() + (3 + 7 - d.getDay()) % 7); // 3 is Wednesday

    // If today is Wednesday, we might want to start from next week depending on time
    // Let's just strictly get the *next* upcoming 4 ones for simplicity.
    if (d.getDate() === new Date().getDate()) {
        d.setDate(d.getDate() + 7);
    }

    for (let i = 0; i < 4; i++) {
        // Format: Miércoles, 15 de Octubre
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        let formattedStr = d.toLocaleDateString(botLang === 'en' ? 'en-US' : (botLang === 'fr' ? 'fr-FR' : 'es-MX'), options);
        // Capitalize first letter
        formattedStr = formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
        dates.push(formattedStr);
        d.setDate(d.getDate() + 7);
    }
    return dates;
}

async function handleDateSelection(selectedDate) {
    // Echo the selection back as a user message
    appendMessage(selectedDate, 'user');

    leadParams.date = selectedDate;
    chatState = 'START';

    // Re-enable input
    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.placeholder = "Pregunta algo...";

    appendMessage(botLang === 'es' ? "¡Cita registrada! 🎉 Guardando de forma segura tus datos..." : (botLang === 'en' ? "Appointment recorded! 🎉 Saving your data securely..." : "Rendez-vous enregistré ! 🎉 Enregistrement de vos données en toute sécurité..."), 'bot');

    let result = await window.submitConversationalLead(leadParams);
    if (result && result.success) {
        appendMessage(botLang === 'es' ? "✅ Te enviaremos confirmación pronto a tus datos de contacto." : (botLang === 'en' ? "✅ We will send you a confirmation soon to your contact details." : "✅ Nous vous enverrons une confirmation bientôt à vos coordonnées."), 'bot');
    } else {
        appendMessage(botLang === 'es' ? "⚠️ Hubo un error de conexión, pero tenemos tu registro temporal." : (botLang === 'en' ? "⚠️ Connect error saving data, but we have a temp record." : "⚠️ Erreur de réseau, mais nous avons votre demande."), 'bot');
    }
}

chatSend.addEventListener('click', handleUserMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage();
});

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerHTML = text; // Allow HTML rendering for WhatsApp links
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Bot Brain based on Strategy txt
function generateBotResponse(msg) {
    // Scoring & Intent
    if (msg.includes('humano') || msg.includes('asesor') || msg.includes('whatsapp') || msg.includes('human')) {
        leadParams.score += 50;
        return botLang === 'es' ? "Claro 😊 Puedes hablar directo por WhatsApp aquí 👉 <a href='https://wa.me/5215514803488' target='_blank' style='color: white; text-decoration: underline;'>WhatsApp</a>" :
            (botLang === 'en' ? "Sure 😊 You can talk directly via WhatsApp here 👉 <a href='https://wa.me/5215514803488' target='_blank' style='color: white; text-decoration: underline;'>WhatsApp</a>" :
                "Bien sûr 😊 Vous pouvez parler directement sur WhatsApp ici 👉 <a href='https://wa.me/5215514803488' target='_blank' style='color: white; text-decoration: underline;'>WhatsApp</a>");
    }

    if (msg.includes('cita') || msg.includes('ver') || msg.includes('appointment') || msg.includes('rendez-vous') || msg.includes('agendar') || msg.includes('visita')) {
        leadParams.score += 40;
        chatState = 'CAPTURE_NAME';
        return botLang === 'es' ? "Perfecto 😊 Para agendar necesito tu nombre completo." :
            (botLang === 'en' ? "Perfect 😊 To schedule, I need your full name." :
                "Parfait 😊 Pour planifier, j'ai besoin de votre nom complet.");
    }

    if (msg.includes('renta') || msg.includes('precio') || msg.includes('price') || msg.includes('loyer') || msg.includes('cuesta')) leadParams.score += 10;
    if (msg.includes('requisito') || msg.includes('requirement')) leadParams.score += 15;

    // English
    if (botLang === 'en') {
        if (msg.includes('pet') || msg.includes('dog') || msg.includes('cat')) return "Yes, we accept small pets. We are open to friendly negotiation. Do you want to schedule a visit?";
        if (msg.includes('location') || msg.includes('where')) return "Calle 9, in the Miguel Hidalgo 4a Sección neighborhood, Tlalpan Municipality. You can check the exact location on the map section.";
        if (msg.includes('furniture') || msg.includes('furnished')) return "It is possible to rent it fully furnished, but this will understandably increase the rent and deposit. We can discuss this in a personalized appointment.";
        if (msg.includes('parking')) return "There is no parking in the building, but there are pensions around that cost between $500 and $800 MXN per month. Want to schedule an appointment to see it?";
        if (msg.includes('room') || msg.includes('size')) return "It has one bedroom. The property is approximately 80m2, of which about 30m2 is a completely private garden space.";
        if (msg.includes('garden')) return "The garden terrace is completely private, very beautiful and quiet.";
        if (msg.includes('include') || msg.includes('what')) return "The rent includes: solid wood bed base, stove with hood, artisanal kitchen rack, electric fireplace, high-capacity programmable boiler, energy regulator, and a no-break for internet during outages.";

        return "I can help you with rent, requirements, or scheduling a visit 😊";
    }

    // French
    if (botLang === 'fr') {
        if (msg.includes('animal') || msg.includes('chien') || msg.includes('chat')) return "Oui, nous acceptons les petits animaux. Nous sommes ouverts à la négociation. Souhaitez-vous prendre rendez-vous ?";
        if (msg.includes('où') || msg.includes('emplacement') || msg.includes('lieu')) return "Calle 9, dans le quartier Miguel Hidalgo 4a Sección, municipalité de Tlalpan. Vous pouvez vérifier l'emplacement exact sur la carte.";
        if (msg.includes('meuble') || msg.includes('meublé')) return "Il est possible de louer meublé, mais cela augmentera le loyer et la caution. Nous pouvons en discuter lors d'un rendez-vous. Voulez-vous planifier une visite?";
        if (msg.includes('parking') || msg.includes('garage')) return "Il n'y a pas de parking dans l'immeuble, mais il y a des pensions autour (500-800 MXN / mois). Voudriez-vous prendre rendez-vous?";
        if (msg.includes('chambre') || msg.includes('taille')) return "Il a une chambre. La propriété fait environ 80m2, dont environ 30m2 de jardin entièrement privé.";
        if (msg.includes('jardin')) return "Non, la terrasse de jardin est entièrement privée, très belle et calme.";

        return "Je peux vous aider avec le loyer, les exigences ou pour planifier une visite 😊";
    }

    // Default Spanish
    if (msg.includes('hola') || msg.includes('info')) return "Hola, que puedo hacer por ti? requieres informacion de...";
    if (msg.includes('foto')) return "Todas las fotos se encuentran detalladas en la sección de 'Espacios' aquí arriba en la página.";
    if (msg.includes('ubicacion') || msg.includes('donde') || msg.includes('queda')) return "Calle 9, en la Colonia Miguel Hidalgo 4a Sección, Alcaldía de Tlalpan. Te comparto la ubicación exacta, puedes checarla en el mapa de abajo si gustas :)";
    if (msg.includes('amueblado') || msg.includes('mueble')) return "Si es posible, pero esto te incrementará necesariamente la renta y el deposito en consecuencia. Podemos tratar ese tema en una cita personalizada. ¿Gustas agendar un recorrido?";
    if (msg.includes('estacionamiento')) return "No tiene estacionamiento en el edificio, la buena noticia es que existen pensiones alrededor y cuestan entre $500 y $800 mensuales. ¿Te gustaría que agendáramos una cita?";
    if (msg.includes('cuartos') || msg.includes('habitacion')) return "Solo un cuarto, es el espacio ideal para una pareja joven o personas que trabajan de forma remota.";
    if (msg.includes('jardin') || msg.includes('compartido')) return "No, la terraza jardín es completamente privada, es muy bella y silenciosa.";
    if (msg.includes('mascota') || msg.includes('perro') || msg.includes('gato')) return "Si, aceptamos mascotas pequeñas. No obstante estamos abiertos a la negociación amistosa de cualquier situación, ¿quieres agendar una cita para platicar de las particularidades de tu caso y de paso ver el depa?";
    if (msg.includes('tamaño') || msg.includes('medida') || msg.includes('metros')) return "El tamaño es de aproximadamente 80m2, de estos alrededor de 30m2 son de jardín.";
    if (msg.includes('meses') || msg.includes('tiempo') || msg.includes('año')) return "Si claro, pero se mantiene el requisito del deposito como si fuera por un año, además la póliza es el único requisito que no podemos realizar por un tiempo menor a un año. ¿Gustas agendar una cita presencial?";
    if (msg.includes('incluye') || msg.includes('dotacion')) return "La renta incluye: base de cama de madera sólida y separaciones de espacios, estufa con campana, rack artesanal, chimenea eléctrica, boiler programable, regulador para todo el departamento, y un no break que mantiene el internet y luces exteriores en apagón hasta por 2 horas. Muebles en azotea.";
    if (msg.includes('renta') || msg.includes('precio') || msg.includes('cuesta')) return "La renta mensual es de $8,400 MXN con el mantenimiento ya incluido. 😊";
    if (msg.includes('requisito') || msg.includes('piden')) return "Se requiere comprobante de ingresos (3 veces la renta), póliza jurídica, un obligado solidario o fiador, y el pago de 2 meses de depósito junto con la 1ra renta por adelantado.";

    return "Puedo ayudarte con la renta, los requisitos, o agendar una visita directamente 😊. Si necesitas algo específico puedes pedir hablar con un 'humano'.";
}
