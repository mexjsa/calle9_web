// --- NAVBAR SCRIPT ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- CAROUSEL SCRIPT ---
const images = [
    'assets/photos/Fachada.JPG',
    'assets/photos/Entrada.jpg',
    'assets/photos/Sala 1.jpg',
    'assets/photos/Sala 2.jpg',
    'assets/photos/Sala 3.jpg',
    'assets/photos/Sala 4.jpg',
    'assets/photos/Cocina 1.jpg',
    'assets/photos/Cocina 2.jpg',
    'assets/photos/Cocina 3.jpg',
    'assets/photos/Cocina 4.jpg',
    'assets/photos/Dormitorio 1.jpg',
    'assets/photos/Dormitorio 2.jpg',
    'assets/photos/Dormitorio 3.jpg',
    'assets/photos/Baño 1.jpg',
    'assets/photos/Baño 2.jpg',
    'assets/photos/Patio 1.jpg',
    'assets/photos/Patio 2.jpg',
    'assets/photos/Patio 3.jpg',
    'assets/photos/Patio 4.jpg',
    'assets/photos/Patio 5.jpg',
    'assets/photos/Bodega.jpg',
    'assets/photos/Lavadora.jpg'
];

const track = document.getElementById('main-carousel');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

let currentIndex = 0;

// Initialize Carousel
function initCarousel() {
    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Galería Calle 9 - Imagen ${index + 1}`;

        slide.appendChild(img);
        track.appendChild(slide);
    });
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;

    // Calculate width of one slide plus margin
    const slideWidth = slides[0].getBoundingClientRect().width;
    const margin = parseInt(window.getComputedStyle(slides[0]).marginRight);

    // Move track
    track.style.transform = `translateX(-${currentIndex * (slideWidth + margin)}px)`;

    // Update active class
    slides.forEach((slide, index) => {
        if (index === currentIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

btnNext.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateCarousel();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

// Recompute on resize
window.addEventListener('resize', updateCarousel);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initTranslation();
});

// --- I18N TRANSLATION SCRIPT ---
const translations = {
    es: {
        'btn-agenda': 'Agendar Visita',
        'hero-sub': 'LOFT AL SUR DE LA CIUDAD',
        'hero-title': 'Tu Loft Minimalista.',
        'hero-text': 'Un departamento diseñado para encontrar la calma, donde la naturaleza del Ajusco abraza tu espacio privado.',
        'hero-scroll': 'Descubrir',
        'intro-title': 'Tu loft privado.',
        'intro-desc-1': 'Calle 9 no es solo un departamento, es una experiencia de vida. Con 80m² de diseño inteligente, donde 30m² están dedicados a una terraza jardín completamente privada, sentirás que el interior y el exterior son uno solo.',
        'intro-desc-2': 'Ideal para parejas jóvenes o profesionales remotos que buscan un escape silencioso y exclusivo sin alejarse de la ciudad.',
        'gallery-overline': 'ESPACIOS',
        'gallery-title': 'Luz natural y madera sólida.',
        'am-garden': 'Jardín Privado',
        'am-garden-desc': '30m² de terraza exclusiva y silenciosa.',
        'am-furniture': 'Semi-Equipado',
        'am-furniture-desc': 'Base de madera, estufa, rack de cocina y chimenea eléctrica.',
        'am-pets': 'Pet Friendly',
        'am-pets-desc': 'Aceptamos mascotas pequeñas con gusto.',
        'am-energy': 'Alta Tecnología',
        'am-energy-desc': 'Boiler inteligente, regulador general y No-Break para internet.',
        'loc-title': 'El balance perfecto.',
        'loc-desc': 'Ubicado en la Col. Miguel Hidalgo 4a Sección, Tlalpan. Un punto estratégico a las faldas del bosque, ofreciendo aire limpio y tranquilidad, pero a minutos de los principales servicios del sur.',
        'footer-title': 'Inicia tu nueva historia.',
        'footer-desc': 'Déjanos tus datos a través del asistente virtual de la esquina y agendaremos un recorrido presencial los días miércoles.',
        // Chatbot UI translations
        'bot-title': 'Asistente Virtual',
        'bot-status': 'En línea',
        'bot-welcome': '¡Hola! Soy el asistente de Juan. Conozco todos los detalles de Calle 9. ¿Tienes alguna duda sobre mascotas, estacionamiento o la ubicación?',
        'bot-placeholder': 'Pregunta algo...',
        'form-title': 'Por favor, déjame tus datos y Juan te contactará directamente.',
        'form-submit': 'Enviar Mis Datos'
    },
    en: {
        'btn-agenda': 'Schedule Tour',
        'hero-sub': 'LOFT SOUTH OF THE CITY',
        'hero-title': 'Your Minimalist Loft.',
        'hero-text': 'An apartment designed to find calm, where the nature of the Ajusco forest embraces your private space.',
        'hero-scroll': 'Discover',
        'intro-title': 'Your private loft.',
        'intro-desc-1': 'Calle 9 is not just an apartment, it is a living experience. With 80m² of smart design, 30m² dedicated to a completely private garden terrace, you will feel interior and exterior become one.',
        'intro-desc-2': 'Ideal for young couples or remote professionals seeking an exclusive and quiet escape without leaving the city.',
        'gallery-overline': 'SPACES',
        'gallery-title': 'Natural light and solid wood.',
        'am-garden': 'Private Garden',
        'am-garden-desc': '30m² of exclusive and quiet terrace.',
        'am-furniture': 'Semi-Furnished',
        'am-furniture-desc': 'Wood bed base, stove, kitchen rack, electric fireplace.',
        'am-pets': 'Pet Friendly',
        'am-pets-desc': 'We gladly accept small pets.',
        'am-energy': 'High Tech',
        'am-energy-desc': 'Smart boiler, main regulator and internet No-Break.',
        'loc-title': 'The perfect balance.',
        'loc-desc': 'Located in Col. Miguel Hidalgo 4a Sección, Tlalpan. A strategic point at the foothills of the forest, offering clean air, minutes from major southern services.',
        'footer-title': 'Start your new story.',
        'footer-desc': 'Leave your contact info with our virtual assistant in the corner and we will schedule a physical tour on Wednesdays.',
        'bot-title': 'Virtual Assistant',
        'bot-status': 'Online',
        'bot-welcome': 'Hello! I am Juan\'s assistant. I know all the details of Calle 9. Do you have any questions about pets, parking, or location?',
        'bot-placeholder': 'Ask something...',
        'form-title': 'Please leave your details and Juan will contact you directly.',
        'form-submit': 'Submit My Details'
    },
    fr: {
        'btn-agenda': 'Planifier Visite',
        'hero-sub': 'LOFT AU SUD DE LA VILLE',
        'hero-title': 'Votre Loft Minimaliste.',
        'hero-text': 'Un appartement conçu pour trouver le calme, où la nature de la forêt embrasse votre espace privé.',
        'hero-scroll': 'Découvrir',
        'intro-title': 'Votre loft privé.',
        'intro-desc-1': 'Calle 9 n\'est pas seulement un appartement, c\'est une expérience de vie. Avec 80m² de conception intelligente, dont 30m² d\'une terrasse de jardin privée.',
        'intro-desc-2': 'Idéal pour les jeunes couples ou les professionnels cherchant une évasion exclusive et calme sans quitter la ville.',
        'gallery-overline': 'ESPACES',
        'gallery-title': 'Lumière naturelle et bois massif.',
        'am-garden': 'Jardin Privé',
        'am-garden-desc': '30m² de terrasse exclusive.',
        'am-furniture': 'Semi-meublé',
        'am-furniture-desc': 'Base de lit en bois, cuisinière, cheminée électrique.',
        'am-pets': 'Animaux Acceptés',
        'am-pets-desc': 'Nous acceptons volontiers les petits animaux.',
        'am-energy': 'Haute Technologie',
        'am-energy-desc': 'Chauffe-eau intelligent, No-Break pour internet.',
        'loc-title': 'L\'équilibre parfait.',
        'loc-desc': 'Situé à Col. Miguel Hidalgo 4a Sección, Tlalpan. Air pur et tranquillité, à quelques minutes des principaux services.',
        'footer-title': 'Commencez votre nouvelle histoire.',
        'footer-desc': 'Laissez vos coordonées à notre assistant virtuel et nous planifierons une visite les mercredis.',
        'bot-title': 'Assistant Virtuel',
        'bot-status': 'En Ligne',
        'bot-welcome': 'Bonjour! Je suis l\'assistant de Juan. J\'ai tous les détails de Calle 9. Avez-vous des questions sur les animaux, le parking ou l\'emplacement?',
        'bot-placeholder': 'Posez une question...',
        'form-title': 'Veuillez laisser vos coordonnées et Juan vous contactera directement.',
        'form-submit': 'Envoyer mes données'
    }
};

let currentLang = 'es';

function initTranslation() {
    const langBtns = document.querySelectorAll('.lang-option');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active styling
            langBtns.forEach(b => b.classList.remove('active'));
            const target = e.target;
            target.classList.add('active');

            // Set lang
            currentLang = target.getAttribute('data-lang');

            // Re-render UI
            updateUIStrings();

            // Notify Chat.js if available that language changed
            if (window.changeChatLanguage) {
                window.changeChatLanguage(currentLang);
            }
        });
    });
}

function updateUIStrings() {
    const dict = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });
}
