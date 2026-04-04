document.addEventListener('DOMContentLoaded', () => {
    // Advanced Navbar Transparent-to-Solid Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                // Adjust for sticky header
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Reveal Animations (Corporate smooth reveals)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine if it has a delay preset in HTML
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Neural Network Animation for Hero Canvas
    initNeuronAnimation();
});

// --- Función para solicitar llamada (N8N Webhook) ---
async function pedirLlamada() {
    let input = document.getElementById('telefono').value.trim();

    // 1. LIMPIEZA
    let numero = input.replace(/[^\d+]/g, '');
    if (numero !== "" && !numero.startsWith("+")) {
        numero = "+34" + numero;
    }

    const urlN8n = "https://n8n.ruedia.space/webhook/call_retell";
    let respuesta;
    let textoRespuesta;

    // ==========================================
    // FASE 1: CONEXIÓN CON N8N (Red / CORS)
    // ==========================================
    try {
        console.log("📡 Enviando  el número:", numero);
        respuesta = await fetch(urlN8n, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefono_cliente: numero })
        });

        textoRespuesta = await respuesta.text();
        console.log("📦  ha devuelto TODA esta respuesta cruda:", textoRespuesta);

    } catch (error) {
        // Si entra aquí, sí es un error real de red o CORS
        console.error("❌ Error real de red o CORS:", error);
        alert("⚠️ No se pudo conectar con el servidor.");
        return; // Detenemos la función
    }

    // ==========================================
    // FASE 2: LECTURA DE DATOS (Lógica)
    // ==========================================
    try {
        const datosRaw = JSON.parse(textoRespuesta);
        // Si n8n lo mete en un array lo sacamos, si no, lo dejamos igual
        const datos = Array.isArray(datosRaw) ? datosRaw[0] : datosRaw;

        // CASO A: n8n devuelve éxito
        if (datos && datos.mensaje === "exito") {
            console.log("✅ Éxito total detectado por el sistema.");
            alert("✅ ¡Llamada en camino! Nuestro agente IA te llamará en unos segundos.");
            return;
        }

        // CASO B: n8n devuelve un error de Retell (ej. número falso)
        if (datos && datos.error) {
            console.log("⚠️  hubo un error :", datos.error);
            let mensajeAmigable = "Error al conectar con el agente. Revisa el número.";

            // Leemos el mensaje original de forma segura
            const mensajeOriginal = datos.error.message || JSON.stringify(datos.error) || "";

            if (mensajeOriginal.includes("not a valid number")) {
                mensajeAmigable = "El número de teléfono no es válido o está mal escrito.";
            }

            alert("⚠️ " + mensajeAmigable);
            return;
        }

        // CASO C: Respuesta desconocida pero sin error
        console.log("✅ Petición procesada (formato desconocido):", datos);
        alert("✅ Petición enviada correctamente.");

    } catch (error) {
        console.error("❌ La conexión funcionó, pero hubo un error leyendo la respuesta:", error);
    }
}
function initNeuronAnimation() {
    const canvas = document.getElementById('neuronCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Mouse tracking
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.baseX = x;
            this.baseY = y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.8)'; // accent color cyan
            ctx.fill();
        }

        update() {
            // Mouse interaction (repel)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;

                if (distance < mouse.radius) {
                    this.x -= forceDirectionX * force * this.density;
                    this.y -= forceDirectionY * force * this.density;
                } else {
                    if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 10; }
                    if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 10; }
                }
            } else {
                if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 10; }
                if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 10; }
            }

            // Normal drifting
            this.baseX += this.dx;
            this.baseY += this.dy;

            // Bounce off edges
            if (this.baseX > width || this.baseX < 0) this.dx = -this.dx;
            if (this.baseY > height || this.baseY < 0) this.dy = -this.dy;

            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        let numberOfParticles = (width * height) / 8000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = Math.random() * width;
            let y = Math.random() * height;
            let dx = (Math.random() - 0.5) * 1;
            let dy = (Math.random() - 0.5) * 1;
            particles.push(new Particle(x, y, dx, dy, size));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                    + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (width / 7) * (height / 7)) {
                    opacityValue = 1 - (distance / 15000);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }

    resize();
    initParticles();
    animate();
}
