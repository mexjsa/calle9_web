document.addEventListener("DOMContentLoaded", () => {
    const formDateSelect = document.getElementById("form-date");
    const contactForm = document.getElementById("direct-contact-form");
    const feedbackEl = document.getElementById("form-feedback");
    const submitBtn = document.getElementById("form-submit-btn");

    // Populate dates using the same logic as the chatbot
    if (typeof getNextFourWednesdays === 'function' && formDateSelect) {
        const wednesdays = getNextFourWednesdays();
        wednesdays.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = date;
            formDateSelect.appendChild(option);
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            feedbackEl.textContent = "";
            feedbackEl.className = "form-feedback";

            const name = document.getElementById("form-name").value.trim();
            const email = document.getElementById("form-email").value.trim();
            const phoneRaw = document.getElementById("form-phone").value.replace(/\s+/g, '');
            const date = document.getElementById("form-date").value;
            const message = document.getElementById("form-message").value.trim();

            // Validate Phone
            const phoneRegex = /^\+?\d{10,15}$/;
            if (!phoneRegex.test(phoneRaw)) {
                feedbackEl.textContent = "El número telefónico no es válido (al menos 10 dígitos).";
                feedbackEl.classList.add("error");
                return;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,10}$/;
            if (!emailRegex.test(email)) {
                feedbackEl.textContent = "El correo electrónico no es válido (verifica el @ y el dominio).";
                feedbackEl.classList.add("error");
                return;
            }

            if (!date) {
                feedbackEl.textContent = "Por favor selecciona una fecha para la visita.";
                feedbackEl.classList.add("error");
                return;
            }

            // Submit
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Enviando... ⏳";

            const leadData = {
                name: name,
                email: email,
                phone: phoneRaw,
                date: date,
                message: message,
                score: 100 // High score because they explicitly filled the form to book an appointment
            };

            const result = await window.submitConversationalLead(leadData);

            if (result && result.success) {
                feedbackEl.textContent = "✅ ¡Tus datos han sido enviados exitosamente! Nos contactaremos pronto.";
                feedbackEl.classList.add("success");
                contactForm.reset();
            } else {
                feedbackEl.textContent = "⚠️ Hubo un error al enviar tus datos. Por favor intenta más tarde.";
                feedbackEl.classList.add("error");
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = "Enviar ✉️";
        });
    }
});
