document.addEventListener("DOMContentLoaded", () => {
    // Variables globales
    const isImporting = false
    const importProgress = {
      structure: false,
      design: false,
      functionality: false,
    }
    let selectedLanguage = "html"
    let viewMode = "visual"
    let device = "desktop"
    let zoom = 100
    let isDragging = false
    let selectedElement = null
  
    // Contenido de muestra para el panel de vista previa
    const sampleHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h1 style="margin: 0; color: #333;">Mi Sitio Web</h1>
          <nav>
            <ul style="display: flex; list-style: none; gap: 20px; margin: 0; padding: 0;">
              <li><a href="#" style="text-decoration: none; color: #0070f3;">Inicio</a></li>
              <li><a href="#" style="text-decoration: none; color: #0070f3;">Acerca de</a></li>
              <li><a href="#" style="text-decoration: none; color: #0070f3;">Servicios</a></li>
              <li><a href="#" style="text-decoration: none; color: #0070f3;">Contacto</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <section style="margin-bottom: 40px;">
            <h2 style="color: #333;">Bienvenido a Mi Sitio Web</h2>
            <p style="line-height: 1.6; color: #666;">
              Este es un sitio web de muestra creado con el constructor de arrastrar y soltar. Puedes editar este contenido
              seleccionando elementos y modificando sus propiedades en el panel de la derecha.
            </p>
            <button style="background-color: #0070f3; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
              Saber Más
            </button>
          </section>
          
          <section style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333;">Característica 1</h3>
              <p style="color: #666;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333;">Característica 2</h3>
              <p style="color: #666;">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333;">Característica 3</h3>
              <p style="color: #666;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            </div>
          </section>
        </main>
        
        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; color: #666;">
          <p>&copy; 2025 Mi Sitio Web. Todos los derechos reservados.</p>
        </footer>
      </div>
    `
  
    // Contenido de muestra para el panel de vista completa
    const fullViewHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h1 style="margin: 0; color: #333; font-size: 28px; background: linear-gradient(to right, #0070f3, #00a2ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mi Proyecto Importado</h1>
          <nav>
            <ul style="display: flex; list-style: none; gap: 20px; margin: 0; padding: 0;">
              <li><a href="#" style="text-decoration: none; color: #0070f3; font-weight: 500; transition: all 0.2s;">Inicio</a></li>
              <li><a href="#" style="text-decoration: none; color: #0070f3; font-weight: 500; transition: all 0.2s;">Acerca de</a></li>
              <li><a href="#" style="text-decoration: none; color: #0070f3; font-weight: 500; transition: all 0.2s;">Servicios</a></li>
              <li><a href="#" style="text-decoration: none; color: #0070f3; font-weight: 500; transition: all 0.2s;">Contacto</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <section style="margin-bottom: 40px; background-color: #f0f7ff; padding: 30px; border-radius: 12px; border: 1px solid #e1e7ef;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 15px;">Bienvenido a Mi Proyecto Importado</h2>
            <p style="line-height: 1.7; color: #555; margin-bottom: 20px;">
              Este es un proyecto importado que ahora puedes editar completamente. Selecciona cualquier elemento
              para modificarlo, arrastra componentes para reorganizarlos, y personaliza todo el diseño según tus necesidades.
            </p>
            <div style="display: flex; gap: 10px;">
              <button style="background-color: #0070f3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0, 118, 255, 0.39);">
                Comenzar Ahora
              </button>
              <button style="background-color: transparent; color: #0070f3; border: 1px solid #0070f3; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s;">
                Saber Más
              </button>
            </div>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">Nuestros Servicios</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e1f5fe; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">🚀</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Desarrollo Web</h3>
                <p style="color: #666; line-height: 1.6;">Creamos sitios web modernos y responsivos utilizando las últimas tecnologías.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e8f5e9; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">📱</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Aplicaciones Móviles</h3>
                <p style="color: #666; line-height: 1.6;">Desarrollamos aplicaciones nativas y multiplataforma para iOS y Android.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #fff8e1; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">⚙️</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Consultoría Técnica</h3>
                <p style="color: #666; line-height: 1.6;">Ofrecemos asesoramiento experto para optimizar tus proyectos tecnológicos.</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer style="text-align: center; padding: 30px 0; border-top: 1px solid #eaeaea; color: #666; background-color: #f8f9fa; border-radius: 8px; margin-top: 40px;">
          <p>&copy; 2025 Mi Proyecto Importado. Todos los derechos reservados.</p>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
            <a href="#" style="color: #0070f3; text-decoration: none;">Términos</a>
            <a href="#" style="color: #0070f3; text-decoration: none;">Privacidad</a>
            <a href="#" style="color: #0070f3; text-decoration: none;">Contacto</a>
          </div>
        </footer>
      </div>
    `
  
    // Código HTML de muestra para el panel de código
    const htmlCode = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto Importado</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Mi Proyecto Importado</h1>
        <nav>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Acerca de</a></li>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section class="hero">
          <h2>Bienvenido a Mi Proyecto Importado</h2>
          <p>
            Este es un proyecto importado que ahora puedes editar completamente. Selecciona cualquier elemento
            para modificarlo, arrastra componentes para reorganizarlos, y personaliza todo el diseño según tus necesidades.
          </p>
          <div class="button-group">
            <button class="btn-primary">Comenzar Ahora</button>
            <button class="btn-secondary">Saber Más</button>
          </div>
        </section>
        
        <section class="services">
          <h2>Nuestros Servicios</h2>
          <div class="service-cards">
            <div class="service-card">
              <div class="service-icon">🚀</div>
              <h3>Desarrollo Web</h3>
              <p>Creamos sitios web modernos y responsivos utilizando las últimas tecnologías.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">📱</div>
              <h3>Aplicaciones Móviles</h3>
              <p>Desarrollamos aplicaciones nativas y multiplataforma para iOS y Android.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">⚙️</div>
              <h3>Consultoría Técnica</h3>
              <p>Ofrecemos asesoramiento experto para optimizar tus proyectos tecnológicos.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer>
        <p>&copy; 2025 Mi Proyecto Importado. Todos los derechos reservados.</p>
        <div class="footer-links">
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Contacto</a>
        </div>
      </footer>
    </div>
    
    <script src="script.js"></script>
  </body>
  </html>`
  
    // Código CSS de muestra
    const cssCode = `/* Estilos Globales */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* Cabecera */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  header h1 {
    margin: 0;
    color: #333;
    font-size: 28px;
    background: linear-gradient(to right, #0070f3, #00a2ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  nav ul {
    display: flex;
    list-style: none;
    gap: 20px;
  }
  
  nav a {
    text-decoration: none;
    color: #0070f3;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  nav a:hover {
    color: #0050a3;
  }
  
  /* Sección Hero */
  .hero {
    margin-bottom: 40px;
    background-color: #f0f7ff;
    padding: 30px;
    border-radius: 12px;
    border: 1px solid #e1e7ef;
  }
  
  .hero h2 {
    color: #333;
    font-size: 24px;
    margin-bottom: 15px;
  }
  
  .hero p {
    line-height: 1.7;
    color: #555;
    margin-bottom: 20px;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
  }
  
  .btn-primary {
    background-color: #0070f3;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(0, 118, 255, 0.39);
  }
  
  .btn-primary:hover {
    background-color: #0050a3;
  }
  
  .btn-secondary {
    background-color: transparent;
    color: #0070f3;
    border: 1px solid #0070f3;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-secondary:hover {
    background-color: rgba(0, 112, 243, 0.05);
  }
  
  /* Servicios */
  .services h2 {
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .service-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .service-card {
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: all 0.3s;
  }
  
  .service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
  
  .service-icon {
    width: 50px;
    height: 50px;
    background-color: #e1f5fe;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    font-size: 24px;
  }
  
  .service-card:nth-child(2) .service-icon {
    background-color: #e8f5e9;
  }
  
  .service-card:nth-child(3) .service-icon {
    background-color: #fff8e1;
  }
  
  .service-card h3 {
    color: #333;
    margin-bottom: 10px;
  }
  
  .service-card p {
    color: #666;
    line-height: 1.6;
  }
  
  /* Pie de página */
  footer {
    text-align: center;
    padding: 30px 0;
    border-top: 1px solid #eaeaea;
    color: #666;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-top: 40px;
  }
  
  .footer-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
  }
  
  .footer-links a {
    color: #0070f3;
    text-decoration: none;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    nav ul {
      margin-top: 10px;
      flex-wrap: wrap;
    }
    
    .service-cards {
      grid-template-columns: 1fr;
    }
    
    .button-group {
      flex-direction: column;
    }
  }`
  
    // Código JavaScript de muestra
    const jsCode = `// Archivo JavaScript principal
  document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón CTA
    const ctaButton = document.querySelector('.btn-primary');
    
    // Añadir evento de clic
    if (ctaButton) {
      ctaButton.addEventListener('click', function() {
        alert('¡Gracias por tu interés! Esta es una demostración de la funcionalidad interactiva.');
      });
    }
    
    // Añadir efectos hover a las tarjetas de servicios
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        this.style.transition = 'all 0.3s ease';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      });
    });
    
    // Ejemplo simple de validación de formulario
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && !validateEmail(emailInput.value)) {
          e.preventDefault();
          alert('Por favor, introduce una dirección de correo electrónico válida');
        }
      });
    }
    
    // Función auxiliar de validación de correo electrónico
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    // Inicializar elementos interactivos
    initInteractiveElements();
  });
  
  // Función para inicializar elementos interactivos
  function initInteractiveElements() {
    // Aquí puedes añadir código para inicializar componentes, 
    // cargar datos dinámicos, configurar animaciones, etc.
    console.log('Elementos interactivos inicializados');
  }`
  
    // Función para mostrar notificaciones toast
    function showToast(title, description, variant = "default") {
      const toastContainer = document.getElementById("toast-container")
      const toast = document.createElement("div")
      toast.className = "toast"
      if (variant === "destructive") {
        toast.style.borderLeft = "4px solid #ef4444"
      } else if (variant === "success") {
        toast.style.borderLeft = "4px solid #22c55e"
      }
  
      toast.innerHTML = `
        <div class="toast-header">
          <h4 class="toast-title">${title}</h4>
          <button class="toast-close">&times;</button>
        </div>
        <div class="toast-description">${description}</div>
      `
  
      toastContainer.appendChild(toast)
  
      // Añadir evento para cerrar el toast
      toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.remove()
      })
  
      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        toast.style.opacity = "0"
        toast.style.transform = "translateX(100%)"
        setTimeout(() => {
          toast.remove()
        }, 300)
      }, 5000)
    }
  
    // Inicializar los paneles de vista previa
    function initPreviewPanels() {
      const previewFrame = document.getElementById("preview-frame")
      const fullviewFrame = document.getElementById("fullview-frame")
  
      if (previewFrame) {
        previewFrame.innerHTML = sampleHTML
        setupElementSelection(previewFrame)
      }
  
      if (fullviewFrame) {
        fullviewFrame.innerHTML = fullViewHTML
        setupElementSelection(fullviewFrame)
      }
    }
  
    // Configurar la selección de elementos
    function setupElementSelection(container) {
      if (!container) return
  
      const elements = container.querySelectorAll("*")
      elements.forEach((element) => {
        element.addEventListener("click", (e) => {
          e.stopPropagation()
  
          // Eliminar selección del elemento previamente seleccionado
          if (selectedElement) {
            selectedElement.style.outline = ""
          }
  
          // Seleccionar el nuevo elemento
          const target = e.target
          target.style.outline = "2px solid #0070f3"
          selectedElement = target
  
          showToast(
            "Elemento seleccionado",
            `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ""}${target.className ? `.${target.className}` : ""}`,
          )
        })
      })
  
      // Configurar eventos de arrastre
      container.addEventListener("mousedown", (e) => {
        if (selectedElement && e.button === 0) {
          isDragging = true
        }
      })
  
      container.addEventListener("mousemove", (e) => {
        if (isDragging && selectedElement) {
          selectedElement.style.position = "relative"
          selectedElement.style.left = `${Number.parseInt(selectedElement.style.left || "0") + e.movementX}px`
          selectedElement.style.top = `${Number.parseInt(selectedElement.style.top || "0") + e.movementY}px`
        }
      })
  
      container.addEventListener("mouseup", () => {
        isDragging = false
      })
  
      container.addEventListener("mouseleave", () => {
        isDragging = false
      })
    }
  
    // Inicializar el panel de código
    function initCodePanel() {
      const codeDisplay = document.getElementById("code-display")
      const fullviewCodeDisplay = document.getElementById("fullview-code-display")
  
      if (codeDisplay) {
        codeDisplay.textContent = htmlCode
      }
  
      if (fullviewCodeDisplay) {
        fullviewCodeDisplay.textContent = htmlCode
      }
  
      // Configurar pestañas de código
      const codeTabs = document.querySelectorAll(".code-tab")
      codeTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          const language = this.getAttribute("data-code-tab")
  
          // Actualizar pestaña activa
          codeTabs.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
  
          // Actualizar contenido del código
          let codeContent = ""
          switch (language) {
            case "html":
              codeContent = htmlCode
              break
            case "css":
              codeContent = cssCode
              break
            case "js":
              codeContent = jsCode
              break
          }
  
          if (codeDisplay) {
            codeDisplay.textContent = codeContent
          }
        })
      })
    }
  
    // Configurar las pestañas principales
    function setupMainTabs() {
      const tabTriggers = document.querySelectorAll(".tab-trigger")
      const tabContents = document.querySelectorAll(".tab-content")
  
      tabTriggers.forEach((trigger) => {
        trigger.addEventListener("click", function () {
          const tabId = this.getAttribute("data-tab")
  
          // Actualizar pestaña activa
          tabTriggers.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
  
          // Mostrar contenido de la pestaña
          tabContents.forEach((content) => {
            content.classList.remove("active")
            if (content.id === `${tabId}-content`) {
              content.classList.add("active")
            }
          })
        })
      })
    }
  
    // Configurar las pestañas de importación
    function setupImportTabs() {
      const importTabTriggers = document.querySelectorAll(".import-tab-trigger")
      const importTabContents = document.querySelectorAll(".import-tab-content")
  
      importTabTriggers.forEach((trigger) => {
        trigger.addEventListener("click", function () {
          const tabId = this.getAttribute("data-import-tab")
  
          // Actualizar pestaña activa
          importTabTriggers.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
  
          // Mostrar contenido de la pestaña
          importTabContents.forEach((content) => {
            content.classList.remove("active")
            if (content.id === `${tabId}-content`) {
              content.classList.add("active")
            }
          })
        })
      })
    }
  
    // Configurar las pestañas del editor
    function setupEditorTabs() {
      const editorTabs = document.querySelectorAll(".editor-tab")
  
      editorTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          const tabId = this.getAttribute("data-editor-tab")
  
          // Actualizar pestaña activa
          editorTabs.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
        })
      })
    }
  
    // Configurar las pestañas de propiedades
    function setupPropertyTabs() {
      const propertyTabs = document.querySelectorAll(".property-tab")
      const propertyTabContents = document.querySelectorAll(".property-tab-content")
  
      propertyTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          const tabId = this.getAttribute("data-property-tab")
  
          // Actualizar pestaña activa
          propertyTabs.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
  
          // Mostrar contenido de la pestaña
          propertyTabContents.forEach((content) => {
            content.classList.remove("active")
            if (content.id === `${tabId}-properties`) {
              content.classList.add("active")
            }
          })
        })
      })
    }
  
    // Configurar los botones de dispositivo
    function setupDeviceButtons() {
      const deviceButtons = document.querySelectorAll(".device-button")
  
      deviceButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const deviceType = this.getAttribute("data-device")
  
          // Actualizar botón activo
          deviceButtons.forEach((b) => b.classList.remove("active"))
          this.classList.add("active")
  
          // Actualizar vista previa
          const previewFrame = document.getElementById("preview-frame")
          const fullviewFrame = document.getElementById("fullview-frame")
  
          if (previewFrame) {
            previewFrame.className = `preview-frame ${deviceType}`
          }
  
          if (fullviewFrame) {
            fullviewFrame.className = `preview-frame ${deviceType}`
          }
  
          device = deviceType
        })
      })
    }
  
    // Configurar los controles de zoom
    function setupZoomControls() {
      const zoomOutBtn = document.getElementById("zoom-out")
      const zoomInBtn = document.getElementById("zoom-in")
      const zoomSelect = document.getElementById("zoom-level")
  
      const fullviewZoomOutBtn = document.getElementById("fullview-zoom-out")
      const fullviewZoomInBtn = document.getElementById("fullview-zoom-in")
      const fullviewZoomSelect = document.getElementById("fullview-zoom-level")
  
      function updateZoom(newZoom) {
        zoom = Math.max(50, Math.min(200, newZoom))
  
        // Actualizar selects
        if (zoomSelect) zoomSelect.value = zoom.toString()
        if (fullviewZoomSelect) fullviewZoomSelect.value = zoom.toString()
  
        // Actualizar escala de los frames
        const previewFrame = document.getElementById("preview-frame")
        const fullviewFrame = document.getElementById("fullview-frame")
  
        if (previewFrame) {
          previewFrame.style.transform = `scale(${zoom / 100})`
          previewFrame.style.transformOrigin = "top center"
        }
  
        if (fullviewFrame) {
          fullviewFrame.style.transform = `scale(${zoom / 100})`
          fullviewFrame.style.transformOrigin = "top center"
        }
      }
  
      if (zoomOutBtn) {
        zoomOutBtn.addEventListener("click", () => {
          updateZoom(zoom - 10)
        })
      }
  
      if (zoomInBtn) {
        zoomInBtn.addEventListener("click", () => {
          updateZoom(zoom + 10)
        })
      }
  
      if (zoomSelect) {
        zoomSelect.addEventListener("change", function () {
          updateZoom(Number.parseInt(this.value))
        })
      }
  
      if (fullviewZoomOutBtn) {
        fullviewZoomOutBtn.addEventListener("click", () => {
          updateZoom(zoom - 10)
        })
      }
  
      if (fullviewZoomInBtn) {
        fullviewZoomInBtn.addEventListener("click", () => {
          updateZoom(zoom + 10)
        })
      }
  
      if (fullviewZoomSelect) {
        fullviewZoomSelect.addEventListener("change", function () {
          updateZoom(Number.parseInt(this.value))
        })
      }
    }
  
    // Configurar los botones de cambio de vista
    function setupViewToggleButtons() {
      const toggleViewBtn = document.getElementById("toggle-view-btn")
      const previewPanel = document.getElementById("preview-panel")
      const codePanel = document.getElementById("code-panel")
  
      const fullviewToggleBtn = document.getElementById("fullview-toggle-view")
      const fullviewVisual = document.getElementById("fullview-visual")
      const fullviewCode = document.getElementById("fullview-code")
  
      if (toggleViewBtn && previewPanel && codePanel) {
        toggleViewBtn.addEventListener("click", function () {
          if (viewMode === "visual") {
            viewMode = "code"
            this.innerHTML = '<i class="fas fa-eye"></i> Vista Visual'
            previewPanel.classList.remove("active")
            codePanel.classList.add("active")
          } else {
            viewMode = "visual"
            this.innerHTML = '<i class="fas fa-code"></i> Vista de Código'
            previewPanel.classList.add("active")
            codePanel.classList.remove("active")
          }
        })
      }
  
      if (fullviewToggleBtn && fullviewVisual && fullviewCode) {
        fullviewToggleBtn.addEventListener("click", function () {
          if (fullviewVisual.classList.contains("active")) {
            fullviewVisual.classList.remove("active")
            fullviewCode.classList.add("active")
            this.innerHTML = '<i class="fas fa-eye"></i> Ver Visual'
          } else {
            fullviewVisual.classList.add("active")
            fullviewCode.classList.remove("active")
            this.innerHTML = '<i class="fas fa-code"></i> Ver Código'
          }
        })
      }
    }
  
    // Configurar el botón de toggle de vista previa
    function setupPreviewToggleButton() {
      const togglePreviewBtn = document.getElementById("toggle-preview-btn")
      const previewPanel = document.getElementById("preview-panel")
  
      if (togglePreviewBtn && previewPanel) {
        togglePreviewBtn.addEventListener("click", function () {
          if (previewPanel.style.display === "none") {
            previewPanel.style.display = "flex"
            this.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Vista Previa'
          } else {
            previewPanel.style.display = "none"
            this.innerHTML = '<i class="fas fa-eye"></i> Mostrar Vista Previa'
          }
        })
      }
    }
  
    // Configurar los botones de importación
    function setupImportButtons() {
      // Ahora los botones de importación están manejados por import-handler.js
      // Solo configuramos los botones que no están manejados por ese archivo
  
      const exploreFilesBtn = document.getElementById("explore-files-btn")
      if (exploreFilesBtn) {
        exploreFilesBtn.addEventListener("click", () => {
          // Delegar al import-handler
          if (window.importHandler) {
            const projectInput = document.getElementById("project-file-input")
            if (projectInput) {
              projectInput.click()
            }
          } else {
            showToast("Error", "El controlador de importación no está disponible", "destructive")
          }
        })
      }
  
      // Configurar botón de importación de proyecto
      const importProjectBtn = document.getElementById("import-project-btn")
      if (importProjectBtn) {
        importProjectBtn.addEventListener("click", () => {
          if (window.importHandler) {
            window.importHandler.importProject()
          } else {
            showToast("Error", "El controlador de importación no está disponible", "destructive")
          }
        })
      }
  
      // Configurar botones de importación por URL y código
      const importUrlBtn = document.getElementById("import-url-btn")
      if (importUrlBtn) {
        importUrlBtn.addEventListener("click", () => {
          if (window.importHandler) {
            window.importHandler.importFromUrl()
          } else {
            showToast("Error", "El controlador de importación no está disponible", "destructive")
          }
        })
      }
  
      const importCodeBtn = document.getElementById("import-code-btn")
      if (importCodeBtn) {
        importCodeBtn.addEventListener("click", () => {
          if (window.importHandler) {
            window.importHandler.importFromCode()
          } else {
            showToast("Error", "El controlador de importación no está disponible", "destructive")
          }
        })
      }
    }
  
    // Configurar el selector de lenguaje
    function setupLanguageSelect() {
      const languageSelect = document.getElementById("language-select")
  
      if (languageSelect) {
        languageSelect.addEventListener("change", function () {
          selectedLanguage = this.value
  
          // Actualizar descripciones según el lenguaje seleccionado
          const structureDesc = document.getElementById("structure-description")
          const designDesc = document.getElementById("design-description")
          const functionalityDesc = document.getElementById("functionality-description")
  
          if (structureDesc) {
            switch (selectedLanguage) {
              case "html":
                structureDesc.textContent = "Estructura HTML y elementos DOM"
                break
              case "react":
                structureDesc.textContent = "Jerarquía de componentes React y estructura JSX"
                break
              case "php":
                structureDesc.textContent = "Plantillas PHP y estructura HTML"
                break
              case "python":
                structureDesc.textContent = "Plantillas Python y estructura HTML"
                break
            }
          }
  
          if (designDesc) {
            switch (selectedLanguage) {
              case "html":
                designDesc.textContent = "Estilos CSS y apariencia visual"
                break
              case "react":
                designDesc.textContent = "CSS/SCSS/Styled Components"
                break
              case "php":
                designDesc.textContent = "Estilos CSS y archivos de tema"
                break
              case "python":
                designDesc.textContent = "Estilos CSS y archivos de tema"
                break
            }
          }
  
          if (functionalityDesc) {
            switch (selectedLanguage) {
              case "html":
                functionalityDesc.textContent = "Código JavaScript e interacciones"
                break
              case "react":
                functionalityDesc.textContent = "Hooks de React, estado y efectos"
                break
              case "php":
                functionalityDesc.textContent = "Lógica PHP y funcionalidad backend"
                break
              case "python":
                functionalityDesc.textContent = "Lógica Python y funcionalidad backend"
                break
            }
          }
        })
      }
    }
  
    // Configurar el árbol de elementos
    function setupElementTree() {
      const treeItems = document.querySelectorAll(".tree-item-content")
  
      treeItems.forEach((item) => {
        item.addEventListener("click", function (e) {
          e.stopPropagation()
  
          const chevron = this.querySelector(".fa-chevron-right, .fa-chevron-down")
          const parent = this.parentElement
          const children = parent.querySelector(".tree-children")
  
          if (chevron && children) {
            if (chevron.classList.contains("fa-chevron-right")) {
              chevron.classList.remove("fa-chevron-right")
              chevron.classList.add("fa-chevron-down")
              children.style.display = "block"
            } else {
              chevron.classList.remove("fa-chevron-down")
              chevron.classList.add("fa-chevron-right")
              children.style.display = "none"
            }
          }
        })
      })
    }
  
    // Configurar el selector de color
    function setupColorPickers() {
      const colorPreviews = document.querySelectorAll(".color-preview")
      const colorInputs = document.querySelectorAll(".color-input")
  
      // Sincronizar color preview con input
      colorInputs.forEach((input, index) => {
        input.addEventListener("input", function () {
          const preview = colorPreviews[index]
          if (preview) {
            preview.style.backgroundColor = this.value
          }
        })
      })
  
      // Abrir selector de color al hacer clic en el preview
      colorPreviews.forEach((preview, index) => {
        preview.addEventListener("click", () => {
          const input = colorInputs[index]
          if (input) {
            // Crear un input de tipo color temporal
            const colorPicker = document.createElement("input")
            colorPicker.type = "color"
            colorPicker.value = input.value
            colorPicker.style.position = "absolute"
            colorPicker.style.visibility = "hidden"
  
            // Añadir al DOM y hacer clic
            document.body.appendChild(colorPicker)
            colorPicker.addEventListener("input", function () {
              preview.style.backgroundColor = this.value
              input.value = this.value
            })
  
            colorPicker.addEventListener("change", function () {
              document.body.removeChild(this)
            })
  
            colorPicker.click()
          }
        })
      })
    }
  
    // Inicializar todo
    function init() {
      initPreviewPanels()
      initCodePanel()
      setupMainTabs()
      setupImportTabs()
      setupEditorTabs()
      setupPropertyTabs()
      setupDeviceButtons()
      setupZoomControls()
      setupViewToggleButtons()
      setupPreviewToggleButton()
      setupImportButtons()
      setupLanguageSelect()
      setupElementTree()
      setupColorPickers()
  
      // Mostrar toast de bienvenida
      setTimeout(() => {
        showToast(
          "Bienvenido a Constructor Web Studio",
          "Importa un proyecto existente o comienza uno nuevo arrastrando elementos al lienzo.",
        )
      }, 1000)
  
      // Escuchar eventos del importHandler
      if (window.importHandler) {
        document.addEventListener("importHandler:showToast", (e) => {
          const { title, description, variant } = e.detail
          showToast(title, description, variant)
        })
  
        document.addEventListener("importHandler:projectImported", () => {
          // Cambiar a la pestaña del editor
          const editorTab = document.querySelector('.tab-trigger[data-tab="editor"]')
          if (editorTab) {
            editorTab.click()
          }
        })
      }
    }
  
    // Iniciar la aplicación
    init()
  })
  
  