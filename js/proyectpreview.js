// ===== Visualización de Proyectos y Miniaturas =====
document.addEventListener('DOMContentLoaded', function() {
  initProjectPreview();
  initRecentProjects();
});

// Reemplazar la función initProjectPreview completa con esta versión mejorada
function initProjectPreview() {
  // Configurar el botón de importar proyecto
  const importProjectBtn = document.getElementById('import-project-btn');
  
  if (!importProjectBtn) return;
  
  importProjectBtn.addEventListener('click', () => {
    const importedProject = JSON.parse(localStorage.getItem('importedProject') || '{}');
    const sections = importedProject.sections || {};
    const importedSections = Object.keys(sections).filter(key => sections[key].imported);
    
    if (importedSections.length === 0) {
      if (window.showToast) {
        window.showToast(
          'Advertencia',
          'Debes importar al menos una sección antes de continuar.',
          5000
        );
      }
      return;
    }
    
    // Deshabilitar botón durante la importación
    importProjectBtn.disabled = true;
    importProjectBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Importando Proyecto...';
    if (window.lucide) window.lucide.createIcons();
    
    // Simular proceso de importación
    setTimeout(() => {
      // Re-habilitar botón
      importProjectBtn.disabled = false;
      importProjectBtn.innerHTML = '<i data-lucide="check"></i> Proyecto Importado';
      importProjectBtn.classList.remove('pulse-animation');
      if (window.lucide) window.lucide.createIcons();
      
      // Generar vista previa del proyecto
      generateProjectPreview(importedProject);
      
      // Guardar en proyectos recientes
      saveToRecentProjects(importedProject);
      
      // Mostrar toast de éxito
      if (window.showToast) {
        window.showToast(
          'Proyecto importado',
          'Tu proyecto ha sido importado correctamente y está listo para editar.'
        );
      }
      
      // Cambiar a la pestaña de Vista Completa inmediatamente
      const fullViewTab = document.querySelector('[data-tab="fullview"]');
      if (fullViewTab) {
        fullViewTab.click();
      }
    }, 1500);
  });
}

// Generar vista previa del proyecto importado
function generateProjectPreview(project) {
  const technology = project.technology || 'html';
  const timestamp = project.timestamp || new Date().toISOString();
  const sections = project.sections || {};
  
  // Generar HTML para la vista previa según la tecnología
  let previewHTML = '';
  
  switch (technology) {
    case 'react':
      previewHTML = generateReactPreview();
      break;
    case 'php':
      previewHTML = generatePHPPreview();
      break;
    case 'python':
      previewHTML = generatePythonPreview();
      break;
    default: // html
      previewHTML = generateHTMLPreview();
  }
  
  // Actualizar contenedores de vista previa inmediatamente
  updatePreviewContainers(previewHTML);
  
  // Generar captura de pantalla para miniatura
  generateThumbnail(previewHTML, technology, timestamp);
  
  // Función para generar vista previa de HTML/CSS/JS
  function generateHTMLPreview() {
    return `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h1 style="margin: 0; color: #333; font-size: 28px; background: linear-gradient(to right, #0070f3, #00a2ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mi Proyecto HTML</h1>
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
            <h2 style="color: #333; font-size: 24px; margin-bottom: 15px;">Bienvenido a Mi Proyecto HTML</h2>
            <p style="line-height: 1.7; color: #555; margin-bottom: 20px;">
              Este es un proyecto HTML/CSS/JS que ahora puedes editar completamente. Selecciona cualquier elemento
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
          <p>&copy; 2025 Mi Proyecto HTML. Todos los derechos reservados.</p>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
            <a href="#" style="color: #0070f3; text-decoration: none;">Términos</a>
            <a href="#" style="color: #0070f3; text-decoration: none;">Privacidad</a>
            <a href="#" style="color: #0070f3; text-decoration: none;">Contacto</a>
          </div>
        </footer>
      </div>
    `;
  }
  
  // Función para generar vista previa de React
  function generateReactPreview() {
    return `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h1 style="margin: 0; color: #333; font-size: 28px; background: linear-gradient(to right, #61dafb, #764abc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mi Aplicación React</h1>
          <nav>
            <ul style="display: flex; list-style: none; gap: 20px; margin: 0; padding: 0;">
              <li><a href="#" style="text-decoration: none; color: #61dafb; font-weight: 500; transition: all 0.2s;">Inicio</a></li>
              <li><a href="#" style="text-decoration: none; color: #61dafb; font-weight: 500; transition: all 0.2s;">Acerca de</a></li>
              <li><a href="#" style="text-decoration: none; color: #61dafb; font-weight: 500; transition: all 0.2s;">Servicios</a></li>
              <li><a href="#" style="text-decoration: none; color: #61dafb; font-weight: 500; transition: all 0.2s;">Contacto</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <section style="margin-bottom: 40px; background-color: #f6f8ff; padding: 30px; border-radius: 12px; border: 1px solid #e1e7ef;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 15px;">Bienvenido a Mi Aplicación React</h2>
            <p style="line-height: 1.7; color: #555; margin-bottom: 20px;">
              Esta es una aplicación React que ahora puedes editar completamente. Utiliza componentes reutilizables
              y estado para crear una experiencia de usuario dinámica y moderna.
            </p>
            <div style="display: flex; gap: 10px;">
              <button style="background-color: #61dafb; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; box-shadow: 0 4px 14px rgba(97, 218, 251, 0.39);">
                Comenzar Ahora
              </button>
              <button style="background-color: transparent; color: #61dafb; border: 1px solid #61dafb; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s;">
                Documentación
              </button>
            </div>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">Componentes React</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e3f2fd; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">⚛️</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Componentes Funcionales</h3>
                <p style="color: #666; line-height: 1.6;">Utiliza hooks y componentes funcionales para un código más limpio y mantenible.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e8eaf6; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">🔄</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Estado Global</h3>
                <p style="color: #666; line-height: 1.6;">Gestiona el estado de tu aplicación con Context API o Redux para aplicaciones complejas.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e0f7fa; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">🎨</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Styled Components</h3>
                <p style="color: #666; line-height: 1.6;">Crea componentes con estilos encapsulados para una mejor organización del código.</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer style="text-align: center; padding: 30px 0; border-top: 1px solid #eaeaea; color: #666; background-color: #f8f9fa; border-radius: 8px; margin-top: 40px;">
          <p>&copy; 2025 Mi Aplicación React. Todos los derechos reservados.</p>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
            <a href="#" style="color: #61dafb; text-decoration: none;">Términos</a>
            <a href="#" style="color: #61dafb; text-decoration: none;">Privacidad</a>
            <a href="#" style="color: #61dafb; text-decoration: none;">Contacto</a>
          </div>
        </footer>
      </div>
    `;
  }
  
  // Función para generar vista previa de PHP
  function generatePHPPreview() {
    return `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h1 style="margin: 0; color: #333; font-size: 28px; background: linear-gradient(to right, #777bb3, #4F5B93); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mi Aplicación PHP</h1>
          <nav>
            <ul style="display: flex; list-style: none; gap: 20px; margin: 0; padding: 0;">
              <li><a href="#" style="text-decoration: none; color: #4F5B93; font-weight: 500; transition: all 0.2s;">Inicio</a></li>
              <li><a href="#" style="text-decoration: none; color: #4F5B93; font-weight: 500; transition: all 0.2s;">Acerca de</a></li>
              <li><a href="#" style="text-decoration: none; color: #4F5B93; font-weight: 500; transition: all 0.2s;">Servicios</a></li>
              <li><a href="#" style="text-decoration: none; color: #4F5B93; font-weight: 500; transition: all 0.2s;">Contacto</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <section style="margin-bottom: 40px; background-color: #f5f5fa; padding: 30px; border-radius: 12px; border: 1px solid #e1e1ef;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 15px;">Bienvenido a Mi Aplicación PHP</h2>
            <p style="line-height: 1.7; color: #555; margin-bottom: 20px;">
              Esta es una aplicación PHP que combina backend y frontend. Utiliza PHP para la lógica del servidor
              y HTML/CSS/JS para la interfaz de usuario.
            </p>
            <div style="display: flex; gap: 10px;">
              <button style="background-color: #4F5B93; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; box-shadow: 0 4px 14px rgba(79, 91, 147, 0.39);">
                Comenzar Ahora
              </button>
              <button style="background-color: transparent; color: #4F5B93; border: 1px solid #4F5B93; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s;">
                Documentación
              </button>
            </div>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">Características PHP</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #ede7f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">🐘</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Backend Robusto</h3>
                <p style="color: #666; line-height: 1.6;">Utiliza PHP para crear un backend potente con acceso a bases de datos y APIs.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e8eaf6; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">🔐</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Autenticación</h3>
                <p style="color: #666; line-height: 1.6;">Implementa sistemas de login, registro y gestión de usuarios con sesiones PHP.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e0f2f1; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">📊</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Base de Datos</h3>
                <p style="color: #666; line-height: 1.6;">Conecta con MySQL, PostgreSQL u otras bases de datos para almacenar y recuperar información.</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer style="text-align: center; padding: 30px 0; border-top: 1px solid #eaeaea; color: #666; background-color: #f8f9fa; border-radius: 8px; margin-top: 40px;">
          <p>&copy; 2025 Mi Aplicación PHP. Todos los derechos reservados.</p>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
            <a href="#" style="color: #4F5B93; text-decoration: none;">Términos</a>
            <a href="#" style="color: #4F5B93; text-decoration: none;">Privacidad</a>
            <a href="#" style="color: #4F5B93; text-decoration: none;">Contacto</a>
          </div>
        </footer>
      </div>
    `;
  }
  
  // Función para generar vista previa de Python
  function generatePythonPreview() {
    return `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h1 style="margin: 0; color: #333; font-size: 28px; background: linear-gradient(to right, #306998, #FFD43B); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mi Aplicación Python</h1>
          <nav>
            <ul style="display: flex; list-style: none; gap: 20px; margin: 0; padding: 0;">
              <li><a href="#" style="text-decoration: none; color: #306998; font-weight: 500; transition: all 0.2s;">Inicio</a></li>
              <li><a href="#" style="text-decoration: none; color: #306998; font-weight: 500; transition: all 0.2s;">Acerca de</a></li>
              <li><a href="#" style="text-decoration: none; color: #306998; font-weight: 500; transition: all 0.2s;">Servicios</a></li>
              <li><a href="#" style="text-decoration: none; color: #306998; font-weight: 500; transition: all 0.2s;">Contacto</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <section style="margin-bottom: 40px; background-color: #f5faff; padding: 30px; border-radius: 12px; border: 1px solid #e1e7ef;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 15px;">Bienvenido a Mi Aplicación Python</h2>
            <p style="line-height: 1.7; color: #555; margin-bottom: 20px;">
              Esta es una aplicación web desarrollada con Python utilizando frameworks como Flask o Django.
              Combina la potencia de Python en el backend con una interfaz de usuario moderna.
            </p>
            <div style="display: flex; gap: 10px;">
              <button style="background-color: #306998; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; box-shadow: 0 4px 14px rgba(48, 105, 152, 0.39);">
                Comenzar Ahora
              </button>
              <button style="background-color: transparent; color: #306998; border: 1px solid #306998; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s;">
                Documentación
              </button>
            </div>
          </section>
          
          <section style="margin-bottom: 40px;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">Características Python</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e3f2fd; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">🐍</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Framework Web</h3>
                <p style="color: #666; line-height: 1.6;">Utiliza Flask o Django para crear aplicaciones web robustas y escalables.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #e8f5e9; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">📊</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Análisis de Datos</h3>
                <p style="color: #666; line-height: 1.6;">Integra bibliotecas como Pandas y NumPy para análisis y visualización de datos.</p>
              </div>
              <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s;">
                <div style="width: 50px; height: 50px; background-color: #fff8e1; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 24px;">🤖</span>
                </div>
                <h3 style="color: #333; margin-bottom: 10px;">Machine Learning</h3>
                <p style="color: #666; line-height: 1.6;">Implementa modelos de aprendizaje automático con scikit-learn o TensorFlow.</p>
              </div>
            </div>
          </section>
        </main>
        
        <footer style="text-align: center; padding: 30px 0; border-top: 1px solid #eaeaea; color: #666; background-color: #f8f9fa; border-radius: 8px; margin-top: 40px;">
          <p>&copy; 2025 Mi Aplicación Python. Todos los derechos reservados.</p>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
            <a href="#" style="color: #306998; text-decoration: none;">Términos</a>
            <a href="#" style="color: #306998; text-decoration: none;">Privacidad</a>
            <a href="#" style="color: #306998; text-decoration: none;">Contacto</a>
          </div>
        </footer>
      </div>
    `;
  }
}

// Actualizar la función updatePreviewContainers para mejorar la visualización
function updatePreviewContainers(html) {
  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) {
    // Añadir animación de carga
    previewContainer.innerHTML = '<div class="loading-container"><i data-lucide="loader" class="animate-spin"></i><p>Cargando vista previa...</p></div>';
    if (window.lucide) window.lucide.createIcons();
    
    // Simular tiempo de carga más corto
    setTimeout(() => {
      previewContainer.innerHTML = html;
      if (window.addSelectionListeners) {
        window.addSelectionListeners(previewContainer);
      }
      
      // Añadir animación de entrada
      previewContainer.classList.add('fade-in');
    }, 500);
  }
  
  const fullviewPreviewContainer = document.getElementById('fullview-preview-container');
  if (fullviewPreviewContainer) {
    // Añadir animación de carga
    fullviewPreviewContainer.innerHTML = '<div class="loading-container"><i data-lucide="loader" class="animate-spin"></i><p>Cargando vista previa...</p></div>';
    if (window.lucide) window.lucide.createIcons();
    
    // Simular tiempo de carga más corto
    setTimeout(() => {
      fullviewPreviewContainer.innerHTML = html;
      if (window.addSelectionListeners) {
        window.addSelectionListeners(fullviewPreviewContainer);
      }
      
      // Añadir animación de entrada
      fullviewPreviewContainer.classList.add('fade-in');
    }, 500);
  }
}

// Generar miniatura para proyectos recientes
function generateThumbnail(html, technology, timestamp) {
  // Crear un elemento para renderizar la miniatura
  const thumbnailContainer = document.createElement('div');
  thumbnailContainer.style.position = 'absolute';
  thumbnailContainer.style.left = '-9999px';
  thumbnailContainer.style.width = '600px';
  thumbnailContainer.style.height = '400px';
  thumbnailContainer.style.overflow = 'hidden';
  thumbnailContainer.innerHTML = html;
  document.body.appendChild(thumbnailContainer);
  
  // Usar html2canvas para capturar la miniatura (simulado)
  setTimeout(() => {
    // Crear un objeto de proyecto reciente
    const projectName = getProjectName(technology);
    const projectDate = new Date(timestamp);
    
    const recentProject = {
      id: Date.now().toString(),
      name: projectName,
      technology: technology,
      date: projectDate.toISOString(),
      thumbnail: 'generated', // En una implementación real, esto sería una URL o data URL
      html: html.substring(0, 1000) // Guardar solo una parte del HTML para no sobrecargar localStorage
    };
    
    // Guardar en localStorage
    saveRecentProject(recentProject);
    
    // Actualizar la UI de proyectos recientes
    updateRecentProjectsUI();
    
    // Limpiar el contenedor temporal
    document.body.removeChild(thumbnailContainer);
  }, 300);
  
  // Obtener nombre de proyecto según tecnología
  function getProjectName(tech) {
    switch (tech) {
      case 'react':
        return 'Aplicación React';
      case 'php':
        return 'Aplicación PHP';
      case 'python':
        return 'Aplicación Python';
      default:
        return 'Sitio Web';
    }
  }
}

// Guardar proyecto en proyectos recientes
function saveToRecentProjects(project) {
  const technology = project.technology || 'html';
  const timestamp = project.timestamp || new Date().toISOString();
  
  // Crear un objeto de proyecto reciente
  const projectName = getProjectName(technology);
  
  const recentProject = {
    id: Date.now().toString(),
    name: projectName,
    technology: technology,
    date: timestamp,
    sections: project.sections || {}
  };
  
  // Guardar en localStorage
  saveRecentProject(recentProject);
  
  // Obtener nombre de proyecto según tecnología
  function getProjectName(tech) {
    switch (tech) {
      case 'react':
        return 'Aplicación React';
      case 'php':
        return 'Aplicación PHP';
      case 'python':
        return 'Aplicación Python';
      default:
        return 'Sitio Web';
    }
  }
}

// Guardar proyecto reciente en localStorage
function saveRecentProject(project) {
  let recentProjects = JSON.parse(localStorage.getItem('recentProjects') || '[]');
  
  // Limitar a 10 proyectos recientes
  recentProjects = recentProjects.slice(0, 9);
  
  // Añadir el nuevo proyecto al principio
  recentProjects.unshift(project);
  
  localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
}

// Inicializar la sección de proyectos recientes
function initRecentProjects() {
  // Cargar proyectos recientes al iniciar
  updateRecentProjectsUI();
  
  // Configurar eventos de clic en proyectos recientes
  const recentProjectsContainer = document.querySelector('.recent-projects');
  if (recentProjectsContainer) {
    recentProjectsContainer.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        const projectId = projectCard.getAttribute('data-id');
        if (projectId) {
          loadRecentProject(projectId);
        }
      }
    });
  }
}
/*--------------------------------------------------------------------------proyectos recientes div------------------------------ */
// Actualizar la función updateRecentProjectsUI para mejorar la visualización
/*
function updateRecentProjectsUI() {
  const recentProjectsContainer = document.querySelector('.recent-projects');
  if (!recentProjectsContainer) return;
  
  const recentProjects = JSON.parse(localStorage.getItem('recentProjects') || '[]');
  
  if (recentProjects.length === 0) {
    // Mostrar mensaje si no hay proyectos recientes
    recentProjectsContainer.innerHTML = `
      <div class="empty-projects">
        <i data-lucide="folder" style="width: 48px; height: 48px; color: var(--muted-foreground);"></i>
        <p>No hay proyectos recientes</p>
        <p class="empty-description">Tus proyectos importados aparecerán aquí</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  
  // Limpiar contenedor
  recentProjectsContainer.innerHTML = '';
  
  // Añadir proyectos recientes
  recentProjects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.setAttribute('data-id', project.id);
    
    const date = new Date(project.date);
    const timeAgo = getTimeAgo(date);
    
    const techIcon = getTechIcon(project.technology);
    
    projectCard.innerHTML = `
      <div class="project-image">
        ${techIcon}
      </div>
      <h3 class="project-name">${project.name}</h3>
      <div class="project-meta">
        <span class="project-tag">${getTechName(project.technology)}</span>
        <p class="project-date">${timeAgo}</p>
      </div>
      <div class="project-actions">
        <button class="button button-icon" title="Editar proyecto">
          <i data-lucide="edit"></i>
        </button>
        <button class="button button-icon" title="Eliminar proyecto">
          <i data-lucide="trash"></i>
        </button>
      </div>
    `;
    
    recentProjectsContainer.appendChild(projectCard);
    
    // Añadir animación de entrada
    setTimeout(() => {
      projectCard.classList.add('fade-in');
    }, 100);
  });
  
  // Actualizar iconos
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
*/

// Cargar un proyecto reciente
function loadRecentProject(projectId) {
  const recentProjects = JSON.parse(localStorage.getItem('recentProjects') || '[]');
  const project = recentProjects.find(p => p.id === projectId);
  
  if (!project) {
    if (window.showToast) {
      window.showToast('Error', 'No se pudo encontrar el proyecto seleccionado.');
    }
    return;
  }
  
  // Guardar como proyecto actual
  localStorage.setItem('importedProject', JSON.stringify({
    technology: project.technology,
    timestamp: project.date,
    sections: project.sections || {
      structure: { imported: true },
      design: { imported: true },
      functionality: { imported: true }
    },
    html: project.html
  }));
  
  // Mostrar toast de éxito
  if (window.showToast) {
    window.showToast(
      'Proyecto cargado',
      `Se ha cargado el proyecto "${project.name}" correctamente.`
    );
  }
  
  // Cambiar a la pestaña de Vista Completa inmediatamente
  const fullViewTab = document.querySelector('[data-tab="fullview"]');
  if (fullViewTab) {
    fullViewTab.click();
  }
  
  // Generar vista previa del proyecto
  if (project.html) {
    // Si tenemos HTML guardado, usarlo directamente
    updatePreviewContainers(project.html);
  } else {
    // Si no, generar una vista previa según la tecnología
    generateProjectPreview({
      technology: project.technology,
      timestamp: project.date,
      sections: project.sections
    });
  }
}

// Helper functions for formatting dates and getting tech icons
function getTimeAgo(date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `hace ${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else {
    return 'hace unos segundos';
  }
}

function getTechIcon(technology) {
  switch (technology) {
    case 'react':
      return '<i data-lucide="atom" style="width: 24px; height: 24px;"></i>';
    case 'php':
      return '<i data-lucide="code-2" style="width: 24px; height: 24px;"></i>';
    case 'python':
      return '<i data-lucide="python" style="width: 24px; height: 24px;"></i>';
    default:
      return '<i data-lucide="globe" style="width: 24px; height: 24px;"></i>';
  }
}

function getTechName(technology) {
    switch (technology) {
        case 'react':
            return 'React';
        case 'php':
            return 'PHP';
        case 'python':
            return 'Python';
        default:
            return 'HTML';
    }
}

