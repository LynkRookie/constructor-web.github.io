/**
 * import-handler.js
 * Maneja la importación de archivos y proyectos en diferentes lenguajes
 */

class ImportHandler {
    constructor() {
      this.supportedLanguages = ['html', 'react', 'php', 'python', 'vue', 'angular'];
      this.currentLanguage = 'html';
      this.importedFiles = {
        structure: null,
        design: null,
        functionality: null
      };
      this.projectData = null;
      this.eventListeners = {};
    }
  
    /**
     * Inicializa el manejador de importación
     */
    init() {
      this.setupEventListeners();
      this.setupDropZones();
      console.log('ImportHandler inicializado');
    }
  
    /**
     * Configura los listeners de eventos
     */
    setupEventListeners() {
      // Escuchar cambios en el selector de lenguaje
      const languageSelect = document.getElementById('language-select');
      if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
          this.currentLanguage = e.target.value;
          this.updateImportDescriptions();
        });
      }
  
      // Botones de importación de secciones
      const importStructureBtn = document.getElementById('import-structure-btn');
      const importDesignBtn = document.getElementById('import-design-btn');
      const importFunctionalityBtn = document.getElementById('import-functionality-btn');
  
      if (importStructureBtn) {
        importStructureBtn.addEventListener('click', () => this.openFileDialog('structure'));
      }
      if (importDesignBtn) {
        importDesignBtn.addEventListener('click', () => this.openFileDialog('design'));
      }
      if (importFunctionalityBtn) {
        importFunctionalityBtn.addEventListener('click', () => this.openFileDialog('functionality'));
      }
  
      // Botón de importación de proyecto completo
      const importProjectBtn = document.getElementById('import-project-btn');
      if (importProjectBtn) {
        importProjectBtn.addEventListener('click', () => this.importProject());
      }
  
      // Importación por URL
      const importUrlBtn = document.getElementById('import-url-btn');
      if (importUrlBtn) {
        importUrlBtn.addEventListener('click', () => this.importFromUrl());
      }
  
      // Importación por código
      const importCodeBtn = document.getElementById('import-code-btn');
      if (importCodeBtn) {
        importCodeBtn.addEventListener('click', () => this.importFromCode());
      }
  
      // Crear inputs de archivo ocultos para cada tipo de importación
      this.createHiddenFileInputs();
    }
  
    /**
     * Crea inputs de archivo ocultos para cada tipo de importación
     */
    createHiddenFileInputs() {
      const container = document.createElement('div');
      container.style.display = 'none';
      container.id = 'hidden-file-inputs';
      document.body.appendChild(container);
  
      // Input para estructura
      const structureInput = document.createElement('input');
      structureInput.type = 'file';
      structureInput.id = 'structure-file-input';
      structureInput.accept = this.getAcceptTypes('structure');
      structureInput.addEventListener('change', (e) => this.handleFileSelect(e, 'structure'));
      container.appendChild(structureInput);
  
      // Input para diseño
      const designInput = document.createElement('input');
      designInput.type = 'file';
      designInput.id = 'design-file-input';
      designInput.accept = this.getAcceptTypes('design');
      designInput.addEventListener('change', (e) => this.handleFileSelect(e, 'design'));
      container.appendChild(designInput);
  
      // Input para funcionalidad
      const functionalityInput = document.createElement('input');
      functionalityInput.type = 'file';
      functionalityInput.id = 'functionality-file-input';
      functionalityInput.accept = this.getAcceptTypes('functionality');
      functionalityInput.addEventListener('change', (e) => this.handleFileSelect(e, 'functionality'));
      container.appendChild(functionalityInput);
  
      // Input para proyecto completo (múltiples archivos)
      const projectInput = document.createElement('input');
      projectInput.type = 'file';
      projectInput.id = 'project-file-input';
      projectInput.multiple = true;
      projectInput.accept = '.html,.css,.js,.jsx,.php,.py,.vue,.ts,.tsx';
      projectInput.addEventListener('change', (e) => this.handleProjectFileSelect(e));
      container.appendChild(projectInput);
    }
  
    /**
     * Configura las zonas de arrastre para importación
     */
    setupDropZones() {
      // Zonas de arrastre para cada sección
      const structureDropzone = document.querySelector('#structure-card .import-dropzone');
      const designDropzone = document.querySelector('#design-card .import-dropzone');
      const functionalityDropzone = document.querySelector('#functionality-card .import-dropzone');
      const fileDropzone = document.querySelector('.file-dropzone');
  
      // Configurar eventos de arrastre para cada zona
      this.setupDropZone(structureDropzone, 'structure');
      this.setupDropZone(designDropzone, 'design');
      this.setupDropZone(functionalityDropzone, 'functionality');
      
      // Zona de arrastre para archivos múltiples (proyecto completo)
      if (fileDropzone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          fileDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
          }, false);
        });
  
        fileDropzone.addEventListener('dragenter', () => {
          fileDropzone.classList.add('drag-active');
        });
  
        fileDropzone.addEventListener('dragleave', () => {
          fileDropzone.classList.remove('drag-active');
        });
  
        fileDropzone.addEventListener('drop', (e) => {
          fileDropzone.classList.remove('drag-active');
          this.handleProjectFileDrop(e);
        });
  
        fileDropzone.addEventListener('click', () => {
          document.getElementById('project-file-input').click();
        });
      }
    }
  
    /**
     * Configura una zona de arrastre específica
     */
    setupDropZone(dropzone, section) {
      if (!dropzone) return;
  
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, false);
      });
  
      dropzone.addEventListener('dragenter', () => {
        dropzone.classList.add('drag-active');
      });
  
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-active');
      });
  
      dropzone.addEventListener('drop', (e) => {
        dropzone.classList.remove('drag-active');
        this.handleFileDrop(e, section);
      });
    }
  
    /**
     * Abre el diálogo de selección de archivo
     */
    openFileDialog(section) {
      const fileInput = document.getElementById(`${section}-file-input`);
      if (fileInput) {
        fileInput.click();
      }
    }
  
    /**
     * Maneja la selección de archivos desde el diálogo
     */
    handleFileSelect(event, section) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file, section);
      }
    }
  
    /**
     * Maneja el arrastre y soltar de archivos
     */
    handleFileDrop(event, section) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.processFile(file, section);
      }
    }
  
    /**
     * Maneja la selección de múltiples archivos para un proyecto
     */
    handleProjectFileSelect(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.processProjectFiles(files);
      }
    }
  
    /**
     * Maneja el arrastre y soltar de múltiples archivos
     */
    handleProjectFileDrop(event) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.processProjectFiles(files);
      }
    }
  
    /**
     * Procesa un archivo importado
     */
    processFile(file, section) {
      // Verificar si el tipo de archivo es válido para la sección
      if (!this.isValidFileType(file, section)) {
        this.showToast('Error', `Tipo de archivo no válido para la sección de ${this.getSectionName(section)}`, 'destructive');
        return;
      }
  
      // Leer el contenido del archivo
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        
        // Guardar el archivo importado
        this.importedFiles[section] = {
          name: file.name,
          content: content,
          type: file.type || this.guessFileType(file.name)
        };
  
        // Actualizar la UI
        this.updateImportUI(section, file.name);
        
        // Disparar evento de importación
        this.triggerEvent('fileImported', { section, fileName: file.name });
      };
  
      reader.readAsText(file);
    }
  
    /**
     * Procesa múltiples archivos para un proyecto completo
     */
    processProjectFiles(files) {
      const projectFiles = [];
      let filesProcessed = 0;
  
      // Mostrar indicador de carga
      this.showLoading(true);
  
      // Procesar cada archivo
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          projectFiles.push({
            name: file.name,
            content: e.target.result,
            type: file.type || this.guessFileType(file.name)
          });
  
          filesProcessed++;
          
          // Cuando todos los archivos estén procesados
          if (filesProcessed === files.length) {
            this.projectData = {
              files: projectFiles,
              language: this.currentLanguage,
              timestamp: new Date().toISOString()
            };
  
            // Ocultar indicador de carga
            this.showLoading(false);
            
            // Categorizar archivos automáticamente
            this.categorizeProjectFiles();
            
            // Disparar evento de proyecto importado
            this.triggerEvent('projectImported', { projectData: this.projectData });
            
            // Redirigir al editor
            this.redirectToEditor();
          }
        };
  
        reader.readAsText(file);
      });
    }
  
    /**
     * Categoriza automáticamente los archivos del proyecto en estructura, diseño y funcionalidad
     */
    categorizeProjectFiles() {
      if (!this.projectData || !this.projectData.files || this.projectData.files.length === 0) {
        return;
      }
  
      // Limpiar importaciones previas
      this.importedFiles = {
        structure: null,
        design: null,
        functionality: null
      };
  
      // Categorizar archivos según su extensión
      this.projectData.files.forEach(file => {
        const extension = this.getFileExtension(file.name).toLowerCase();
        
        // Estructura (HTML, JSX, PHP, etc.)
        if (['html', 'htm', 'jsx', 'tsx', 'php', 'py', 'vue'].includes(extension)) {
          if (!this.importedFiles.structure) {
            this.importedFiles.structure = file;
            this.updateImportUI('structure', file.name);
          }
        }
        // Diseño (CSS, SCSS, etc.)
        else if (['css', 'scss', 'sass', 'less', 'styl'].includes(extension)) {
          if (!this.importedFiles.design) {
            this.importedFiles.design = file;
            this.updateImportUI('design', file.name);
          }
        }
        // Funcionalidad (JS, TS, etc.)
        else if (['js', 'ts', 'jsx', 'tsx'].includes(extension)) {
          if (!this.importedFiles.functionality) {
            this.importedFiles.functionality = file;
            this.updateImportUI('functionality', file.name);
          }
        }
      });
    }
  
    /**
     * Importa un proyecto desde una URL
     */
    importFromUrl() {
      const urlInput = document.querySelector('.url-input-container .input');
      if (!urlInput || !urlInput.value.trim()) {
        this.showToast('Error', 'Por favor, introduce una URL válida', 'destructive');
        return;
      }
  
      const url = urlInput.value.trim();
      
      // Mostrar indicador de carga
      this.showLoading(true);
      
      // Simular la importación desde URL (en un entorno real, esto usaría fetch o un proxy)
      setTimeout(() => {
        // Crear un proyecto de ejemplo basado en la URL
        this.projectData = {
          url: url,
          language: this.currentLanguage,
          timestamp: new Date().toISOString(),
          files: [
            {
              name: 'index.html',
              content: this.generateSampleHTML(url),
              type: 'text/html'
            },
            {
              name: 'styles.css',
              content: this.generateSampleCSS(),
              type: 'text/css'
            },
            {
              name: 'script.js',
              content: this.generateSampleJS(),
              type: 'text/javascript'
            }
          ]
        };
  
        // Categorizar los archivos
        this.categorizeProjectFiles();
        
        // Ocultar indicador de carga
        this.showLoading(false);
        
        // Mostrar notificación
        this.showToast('URL importada', `El sitio web ${url} ha sido importado correctamente`, 'success');
        
        // Disparar evento de proyecto importado
        this.triggerEvent('projectImported', { projectData: this.projectData });
        
        // Redirigir al editor
        this.redirectToEditor();
      }, 2000);
    }
  
    /**
     * Importa un proyecto desde código pegado
     */
    importFromCode() {
      const codeTextarea = document.querySelector('.code-textarea');
      if (!codeTextarea || !codeTextarea.value.trim()) {
        this.showToast('Error', 'Por favor, introduce algún código para importar', 'destructive');
        return;
      }
  
      const code = codeTextarea.value.trim();
      
      // Mostrar indicador de carga
      this.showLoading(true);
      
      // Determinar el tipo de código (HTML, CSS o JS)
      const codeType = this.guessCodeType(code);
      
      // Crear un archivo basado en el código
      const file = {
        name: `file.${this.getExtensionForCodeType(codeType)}`,
        content: code,
        type: `text/${codeType}`
      };
      
      // Asignar el archivo a la sección correspondiente
      if (codeType === 'html') {
        this.importedFiles.structure = file;
        this.updateImportUI('structure', file.name);
      } else if (codeType === 'css') {
        this.importedFiles.design = file;
        this.updateImportUI('design', file.name);
      } else if (codeType === 'javascript') {
        this.importedFiles.functionality = file;
        this.updateImportUI('functionality', file.name);
      }
      
      // Crear proyecto
      this.projectData = {
        language: this.currentLanguage,
        timestamp: new Date().toISOString(),
        files: [file]
      };
      
      // Ocultar indicador de carga
      this.showLoading(false);
      
      // Mostrar notificación
      this.showToast('Código importado', 'El código ha sido importado correctamente', 'success');
      
      // Disparar evento de proyecto importado
      this.triggerEvent('projectImported', { projectData: this.projectData });
      
      // Redirigir al editor
      this.redirectToEditor();
    }
  
    /**
     * Importa el proyecto completo
     */
    importProject() {
      // Verificar si hay al menos una sección importada
      if (!this.importedFiles.structure && !this.importedFiles.design && !this.importedFiles.functionality) {
        this.showToast('Advertencia', 'Debes importar al menos una sección antes de continuar', 'destructive');
        return;
      }
  
      // Mostrar indicador de carga
      this.showLoading(true);
      
      // Crear objeto de proyecto
      this.projectData = {
        language: this.currentLanguage,
        timestamp: new Date().toISOString(),
        files: []
      };
      
      // Añadir archivos importados
      Object.keys(this.importedFiles).forEach(section => {
        if (this.importedFiles[section]) {
          this.projectData.files.push(this.importedFiles[section]);
        }
      });
      
      // Simular tiempo de procesamiento
      setTimeout(() => {
        // Ocultar indicador de carga
        this.showLoading(false);
        
        // Mostrar notificación
        this.showToast('Proyecto importado', 'Tu proyecto ha sido importado correctamente y está listo para editar', 'success');
        
        // Disparar evento de proyecto importado
        this.triggerEvent('projectImported', { projectData: this.projectData });
        
        // Redirigir al editor
        this.redirectToEditor();
      }, 1500);
    }
  
    /**
     * Redirige al usuario a la pestaña del editor
     */
    redirectToEditor() {
      // Guardar el proyecto en localStorage para que el editor pueda acceder a él
      localStorage.setItem('currentProject', JSON.stringify(this.projectData));
      
      // Cambiar a la pestaña del editor
      const editorTab = document.querySelector('.tab-trigger[data-tab="editor"]');
      if (editorTab) {
        editorTab.click();
      }
    }
  
    /**
     * Actualiza la interfaz de usuario después de importar un archivo
     */
    updateImportUI(section, fileName) {
      const checkIcon = document.getElementById(`${section}-check`);
      const card = document.getElementById(`${section}-card`);
      const button = document.getElementById(`import-${section}-btn`);
      
      if (checkIcon) {
        checkIcon.classList.remove('hidden');
      }
      
      if (card) {
        card.classList.add('success');
        
        // Añadir nombre del archivo importado
        const fileNameElement = document.createElement('div');
        fileNameElement.className = 'imported-file-name';
        fileNameElement.textContent = fileName;
        
        const dropzone = card.querySelector('.import-dropzone');
        if (dropzone) {
          // Eliminar nombre de archivo anterior si existe
          const existingFileName = dropzone.querySelector('.imported-file-name');
          if (existingFileName) {
            dropzone.removeChild(existingFileName);
          }
          
          dropzone.appendChild(fileNameElement);
        }
      }
      
      if (button) {
        button.textContent = 'Cambiar archivo';
      }
    }
  
    /**
     * Actualiza las descripciones de importación según el lenguaje seleccionado
     */
    updateImportDescriptions() {
      const structureDesc = document.getElementById('structure-description');
      const designDesc = document.getElementById('design-description');
      const functionalityDesc = document.getElementById('functionality-description');
      
      if (structureDesc) {
        switch (this.currentLanguage) {
          case 'html':
            structureDesc.textContent = 'Estructura HTML y elementos DOM';
            break;
          case 'react':
            structureDesc.textContent = 'Jerarquía de componentes React y estructura JSX';
            break;
          case 'php':
            structureDesc.textContent = 'Plantillas PHP y estructura HTML';
            break;
          case 'python':
            structureDesc.textContent = 'Plantillas Python y estructura HTML';
            break;
          case 'vue':
            structureDesc.textContent = 'Componentes Vue y estructura de plantillas';
            break;
          case 'angular':
            structureDesc.textContent = 'Componentes Angular y estructura HTML';
            break;
        }
      }
      
      if (designDesc) {
        switch (this.currentLanguage) {
          case 'html':
            designDesc.textContent = 'Estilos CSS y apariencia visual';
            break;
          case 'react':
            designDesc.textContent = 'CSS/SCSS/Styled Components';
            break;
          case 'php':
            designDesc.textContent = 'Estilos CSS y archivos de tema';
            break;
          case 'python':
            designDesc.textContent = 'Estilos CSS y archivos de tema';
            break;
          case 'vue':
            designDesc.textContent = 'Estilos scoped y CSS modules';
            break;
          case 'angular':
            designDesc.textContent = 'SCSS y estilos de componentes';
            break;
        }
      }
      
      if (functionalityDesc) {
        switch (this.currentLanguage) {
          case 'html':
            functionalityDesc.textContent = 'Código JavaScript e interacciones';
            break;
          case 'react':
            functionalityDesc.textContent = 'Hooks de React, estado y efectos';
            break;
          case 'php':
            functionalityDesc.textContent = 'Lógica PHP y funcionalidad backend';
            break;
          case 'python':
            functionalityDesc.textContent = 'Lógica Python y funcionalidad backend';
            break;
          case 'vue':
            functionalityDesc.textContent = 'Métodos Vue, propiedades computadas y watchers';
            break;
          case 'angular':
            functionalityDesc.textContent = 'Servicios, directivas y pipes de Angular';
            break;
        }
      }
      
      // Actualizar los tipos de archivo aceptados en los inputs
      this.updateFileInputAcceptTypes();
    }
  
    /**
     * Actualiza los tipos de archivo aceptados en los inputs según el lenguaje
     */
    updateFileInputAcceptTypes() {
      const structureInput = document.getElementById('structure-file-input');
      const designInput = document.getElementById('design-file-input');
      const functionalityInput = document.getElementById('functionality-file-input');
      
      if (structureInput) {
        structureInput.accept = this.getAcceptTypes('structure');
      }
      
      if (designInput) {
        designInput.accept = this.getAcceptTypes('design');
      }
      
      if (functionalityInput) {
        functionalityInput.accept = this.getAcceptTypes('functionality');
      }
    }
  
    /**
     * Obtiene los tipos de archivo aceptados para cada sección según el lenguaje
     */
    getAcceptTypes(section) {
      switch (section) {
        case 'structure':
          switch (this.currentLanguage) {
            case 'html':
              return '.html,.htm';
            case 'react':
              return '.jsx,.tsx,.js,.ts';
            case 'php':
              return '.php,.phtml';
            case 'python':
              return '.py,.html';
            case 'vue':
              return '.vue';
            case 'angular':
              return '.html,.ts';
            default:
              return '.html,.htm';
          }
        case 'design':
          return '.css,.scss,.sass,.less,.styl';
        case 'functionality':
          switch (this.currentLanguage) {
            case 'html':
              return '.js';
            case 'react':
              return '.js,.jsx,.ts,.tsx';
            case 'php':
              return '.php,.js';
            case 'python':
              return '.py,.js';
            case 'vue':
              return '.js,.ts';
            case 'angular':
              return '.ts';
            default:
              return '.js';
          }
        default:
          return '*';
      }
    }
  
    /**
     * Verifica si el tipo de archivo es válido para la sección
     */
    isValidFileType(file, section) {
      const extension = this.getFileExtension(file.name).toLowerCase();
      const acceptTypes = this.getAcceptTypes(section).split(',');
      
      return acceptTypes.some(type => {
        // Eliminar el punto del tipo aceptado
        const acceptExt = type.replace('.', '').toLowerCase();
        return extension === acceptExt;
      });
    }
  
    /**
     * Obtiene la extensión de un archivo
     */
    getFileExtension(filename) {
      return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }
  
    /**
     * Adivina el tipo de archivo basado en su nombre
     */
    guessFileType(filename) {
      const extension = this.getFileExtension(filename).toLowerCase();
      
      switch (extension) {
        case 'html':
        case 'htm':
          return 'text/html';
        case 'css':
          return 'text/css';
        case 'js':
          return 'text/javascript';
        case 'jsx':
          return 'text/jsx';
        case 'ts':
          return 'text/typescript';
        case 'tsx':
          return 'text/tsx';
        case 'php':
          return 'application/x-php';
        case 'py':
          return 'text/x-python';
        case 'vue':
          return 'text/x-vue';
        default:
          return 'text/plain';
      }
    }
  
    /**
     * Adivina el tipo de código basado en su contenido
     */
    guessCodeType(code) {
      code = code.trim();
      
      // Detectar HTML
      if (code.startsWith('<!DOCTYPE') || code.startsWith('<html') || (code.includes('<') && code.includes('</') && code.includes('>'))) {
        return 'html';
      }
      
      // Detectar CSS
      if (code.includes('{') && code.includes('}') && (code.includes(':') && code.includes(';'))) {
        // Verificar si hay selectores CSS
        if (code.match(/[.#]?[\w-]+\s*{/)) {
          return 'css';
        }
      }
      
      // Por defecto, asumir JavaScript
      return 'javascript';
    }
  
    /**
     * Obtiene la extensión para un tipo de código
     */
    getExtensionForCodeType(codeType) {
      switch (codeType) {
        case 'html':
          return 'html';
        case 'css':
          return 'css';
        case 'javascript':
          return 'js';
        default:
          return 'txt';
      }
    }
  
    /**
     * Obtiene el nombre de una sección
     */
    getSectionName(section) {
      switch (section) {
        case 'structure':
          return 'estructura';
        case 'design':
          return 'diseño';
        case 'functionality':
          return 'funcionalidad';
        default:
          return section;
      }
    }
  
    /**
     * Genera HTML de muestra basado en una URL
     */
    generateSampleHTML(url) {
      return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitio importado desde ${url}</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header>
      <h1>Sitio importado desde ${url}</h1>
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
        <h2>Bienvenido al sitio importado</h2>
        <p>Este es un sitio web importado desde ${url}. Ahora puedes editarlo completamente.</p>
        <button class="btn-primary">Saber más</button>
      </section>
      
      <section class="features">
        <div class="feature">
          <h3>Característica 1</h3>
          <p>Descripción de la característica 1.</p>
        </div>
        <div class="feature">
          <h3>Característica 2</h3>
          <p>Descripción de la característica 2.</p>
        </div>
        <div class="feature">
          <h3>Característica 3</h3>
          <p>Descripción de la característica 3.</p>
        </div>
      </section>
    </main>
    
    <footer>
      <p>&copy; 2025 Sitio importado desde ${url}. Todos los derechos reservados.</p>
    </footer>
    
    <script src="script.js"></script>
  </body>
  </html>`;
    }
  
    /**
     * Genera CSS de muestra
     */
    generateSampleCSS() {
      return `/* Estilos generales */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }
  
  header {
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 1rem;
  }
  
  header h1 {
    color: #0070f3;
  }
  
  nav ul {
    display: flex;
    list-style: none;
  }
  
  nav ul li {
    margin-right: 1rem;
  }
  
  nav a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
  }
  
  nav a:hover {
    color: #0070f3;
  }
  
  .hero {
    background-color: #e6f7ff;
    padding: 3rem 1rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .btn-primary {
    background-color: #0070f3;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #005cc5;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  
  .feature {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  footer {
    text-align: center;
    padding: 2rem;
    background-color: #f1f1f1;
    margin-top: 2rem;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .features {
      grid-template-columns: 1fr;
    }
  }`;
    }
  
    /**
     * Genera JavaScript de muestra
     */
    generateSampleJS() {
      return `// Script principal
  document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos interactivos
    initializeInteractiveElements();
    
    // Añadir eventos a los botones
    setupButtonEvents();
  });
  
  function initializeInteractiveElements() {
    console.log('Inicializando elementos interactivos...');
    
    // Ejemplo: Añadir clase activa al enlace actual
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }
  
  function setupButtonEvents() {
    // Ejemplo: Configurar evento para el botón principal
    const primaryButton = document.querySelector('.btn-primary');
    
    if (primaryButton) {
      primaryButton.addEventListener('click', function() {
        alert('¡Gracias por tu interés! Este es un sitio web de muestra importado.');
      });
    }
    
    // Añadir efectos hover a las características
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
      feature.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        this.style.transition = 'all 0.3s ease';
      });
      
      feature.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
      });
    });
  }`;
    }
  
    /**
     * Muestra u oculta el indicador de carga
     */
    showLoading(show) {
      // Disparar evento de carga
      this.triggerEvent('loadingStateChanged', { isLoading: show });
      
      // Implementación básica de indicador de carga
      let loadingOverlay = document.getElementById('loading-overlay');
      
      if (show) {
        if (!loadingOverlay) {
          loadingOverlay = document.createElement('div');
          loadingOverlay.id = 'loading-overlay';
          loadingOverlay.className = 'loading-overlay';
          loadingOverlay.innerHTML = '<div class="loading-spinner"></div><p>Importando...</p>';
          document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
      } else if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
      }
    }
  
    /**
     * Muestra una notificación toast
     */
    showToast(title, description, variant = 'default') {
      // Disparar evento de toast
      this.triggerEvent('showToast', { title, description, variant });
    }
  
    /**
     * Registra un listener para un evento
     */
    on(eventName, callback) {
      if (!this.eventListeners[eventName]) {
        this.eventListeners[eventName] = [];
      }
      this.eventListeners[eventName].push(callback);
    }
  
    /**
     * Dispara un evento
     */
    triggerEvent(eventName, data) {
      if (this.eventListeners[eventName]) {
        this.eventListeners[eventName].forEach(callback => callback(data));
      }
      
      // También disparar un evento DOM personalizado
      const event = new CustomEvent(`importHandler:${eventName}`, { detail: data });
      document.dispatchEvent(event);
    }
  }
  
  // Crear instancia global
  window.importHandler = new ImportHandler();
  
  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    window.importHandler.init();
  });
  
  