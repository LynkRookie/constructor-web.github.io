/**
 * Editor Controller - Maneja las funcionalidades avanzadas del editor
 * - Importación de archivos
 * - Visualización de archivos importados
 * - Edición en tiempo real
 * - Exportación a diferentes lenguajes
 */

class EditorController {
    constructor() {
      // Estado del editor
      this.state = {
        currentLanguage: 'html', // html, react, php, python
        importedFiles: [],
        currentFile: null,
        editHistory: [],
        historyIndex: -1,
        isModified: false,
        recentProjects: []
      };
  
      // Referencias a elementos DOM
      this.elements = {
        // Contenedores principales
        editorContainer: document.getElementById('editor-content'),
        previewFrame: document.getElementById('preview-frame'),
        fullviewFrame: document.getElementById('fullview-frame'),
        codeDisplay: document.getElementById('code-display'),
        fullviewCodeDisplay: document.getElementById('fullview-code-display'),
        
        // Botones e inputs de importación
        fileInput: document.createElement('input'),
        importProjectBtn: document.getElementById('import-project-btn'),
        
        // Selectores
        languageSelect: document.getElementById('language-select'),
        
        // Contenedores de proyectos recientes
        recentProjectsContainer: document.querySelector('.projects-grid'),
        
        // Botones de exportación
        exportBtn: null // Se creará dinámicamente
      };
  
      // Configurar input de archivo oculto
      this.elements.fileInput.type = 'file';
      this.elements.fileInput.multiple = true;
      this.elements.fileInput.accept = '.html,.css,.js,.jsx,.php,.py';
      this.elements.fileInput.style.display = 'none';
      document.body.appendChild(this.elements.fileInput);
  
      // Inicializar
      this.init();
    }
  
    /**
     * Inicializa el controlador del editor
     */
    init() {
      this.loadRecentProjects();
      this.setupEventListeners();
      this.setupDropZones();
      this.createExportDialog();
    }
  
    /**
     * Configura los event listeners
     */
    setupEventListeners() {
      // Cambio de lenguaje
      if (this.elements.languageSelect) {
        this.elements.languageSelect.addEventListener('change', (e) => {
          this.state.currentLanguage = e.target.value;
          this.updateImportOptions();
        });
      }
  
      // Importación de proyecto
      if (this.elements.importProjectBtn) {
        this.elements.importProjectBtn.addEventListener('click', () => {
          this.importProject();
        });
      }
  
      // Input de archivo
      this.elements.fileInput.addEventListener('change', (e) => {
        this.handleFileImport(e.target.files);
      });
  
      // Botones de importación de secciones
      const sectionButtons = [
        document.getElementById('import-structure-btn'),
        document.getElementById('import-design-btn'),
        document.getElementById('import-functionality-btn')
      ];
  
      sectionButtons.forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => {
            this.elements.fileInput.click();
          });
        }
      });
  
      // Botón de explorar archivos
      const exploreFileBtn = document.querySelector('.file-dropzone .btn-outline-sm');
      if (exploreFileBtn) {
        exploreFileBtn.addEventListener('click', () => {
          this.elements.fileInput.click();
        });
      }
  
      // Botón de guardar en el editor
      const saveBtn = document.querySelector('.editor-toolbar .btn-primary-sm');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          this.saveProject();
        });
      }
    }
  
    /**
     * Configura las zonas de arrastrar y soltar
     */
    setupDropZones() {
      const dropZones = document.querySelectorAll('.import-dropzone, .file-dropzone, .image-dropzone');
      
      dropZones.forEach(zone => {
        // Prevenir comportamiento por defecto
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          zone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
          }, false);
        });
  
        // Resaltar al arrastrar sobre la zona
        ['dragenter', 'dragover'].forEach(eventName => {
          zone.addEventListener(eventName, () => {
            zone.classList.add('drag-active');
          }, false);
        });
  
        // Quitar resaltado al salir
        ['dragleave', 'drop'].forEach(eventName => {
          zone.addEventListener(eventName, () => {
            zone.classList.remove('drag-active');
          }, false);
        });
  
        // Manejar soltar archivos
        zone.addEventListener('drop', (e) => {
          const files = e.dataTransfer.files;
          this.handleFileImport(files);
        }, false);
      });
    }
  
    /**
     * Maneja la importación de archivos
     * @param {FileList} files - Lista de archivos a importar
     */
    handleFileImport(files) {
      if (!files || files.length === 0) return;
      
      const importedFiles = [];
      let filesProcessed = 0;
      
      // Mostrar toast de inicio de importación
      this.showToast('Importando archivos', 'Procesando archivos, por favor espere...', 'info');
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const fileType = this.getFileType(file.name);
          const fileContent = e.target.result;
          
          importedFiles.push({
            name: file.name,
            type: fileType,
            content: fileContent,
            lastModified: file.lastModified
          });
          
          filesProcessed++;
          
          // Cuando todos los archivos se han procesado
          if (filesProcessed === files.length) {
            this.state.importedFiles = [...this.state.importedFiles, ...importedFiles];
            this.updateImportProgress(importedFiles);
            this.showToast('Importación completada', `Se han importado ${files.length} archivos correctamente.`, 'success');
          }
        };
        
        reader.onerror = () => {
          filesProcessed++;
          this.showToast('Error de importación', `No se pudo leer el archivo ${file.name}.`, 'destructive');
        };
        
        reader.readAsText(file);
      });
    }
  
    /**
     * Determina el tipo de archivo basado en su extensión
     * @param {string} fileName - Nombre del archivo
     * @returns {string} - Tipo de archivo (html, css, js, etc.)
     */
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      
      const typeMap = {
        'html': 'structure',
        'htm': 'structure',
        'jsx': 'structure',
        'php': 'structure',
        'py': 'structure',
        'css': 'design',
        'scss': 'design',
        'sass': 'design',
        'less': 'design',
        'js': 'functionality',
        'ts': 'functionality',
        'json': 'functionality'
      };
      
      return typeMap[extension] || 'other';
    }
  
    /**
     * Actualiza el progreso de importación en la UI
     * @param {Array} files - Archivos importados
     */
    updateImportProgress(files) {
      const types = {
        structure: false,
        design: false,
        functionality: false
      };
      
      // Marcar qué tipos de archivos se han importado
      files.forEach(file => {
        if (file.type in types) {
          types[file.type] = true;
        }
      });
      
      // Actualizar UI para cada tipo
      Object.keys(types).forEach(type => {
        if (types[type]) {
          const checkIcon = document.getElementById(`${type}-check`);
          const card = document.getElementById(`${type}-card`);
          
          if (checkIcon) {
            checkIcon.classList.remove('hidden');
          }
          
          if (card) {
            card.classList.add('success');
          }
        }
      });
    }
  
    /**
     * Actualiza las opciones de importación según el lenguaje seleccionado
     */
    updateImportOptions() {
      const language = this.state.currentLanguage;
      
      // Actualizar descripciones según el lenguaje
      const structureDesc = document.getElementById('structure-description');
      const designDesc = document.getElementById('design-description');
      const functionalityDesc = document.getElementById('functionality-description');
      
      if (structureDesc) {
        switch (language) {
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
        }
      }
      
      if (designDesc) {
        switch (language) {
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
        }
      }
      
      if (functionalityDesc) {
        switch (language) {
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
        }
      }
      
      // Actualizar extensiones aceptadas
      switch (language) {
        case 'html':
          this.elements.fileInput.accept = '.html,.htm,.css,.js';
          break;
        case 'react':
          this.elements.fileInput.accept = '.jsx,.js,.tsx,.ts,.css,.scss';
          break;
        case 'php':
          this.elements.fileInput.accept = '.php,.html,.css,.js';
          break;
        case 'python':
          this.elements.fileInput.accept = '.py,.html,.css,.js';
          break;
      }
    }
  
    /**
     * Importa el proyecto completo y navega al editor
     */
    importProject() {
      // Verificar si hay archivos importados
      if (this.state.importedFiles.length === 0) {
        this.showToast('Error', 'No hay archivos para importar. Por favor, importa al menos un archivo.', 'destructive');
        return;
      }
      
      // Mostrar toast de inicio de importación
      this.showToast('Importando proyecto', 'Procesando archivos y preparando el editor...', 'info');
      
      // Simular tiempo de procesamiento
      setTimeout(() => {
        // Crear un nuevo proyecto
        const project = {
          id: 'project_' + Date.now(),
          name: 'Proyecto Importado',
          language: this.state.currentLanguage,
          files: this.state.importedFiles,
          dateCreated: new Date(),
          lastModified: new Date()
        };
        
        // Guardar en proyectos recientes
        this.addToRecentProjects(project);
        
        // Preparar el editor
        this.prepareEditor(project);
        
        // Navegar al editor
        const editorTab = document.querySelector('.tab-trigger[data-tab="editor"]');
        if (editorTab) {
          editorTab.click();
        }
        
        this.showToast('Proyecto importado', 'El proyecto ha sido importado correctamente y está listo para editar.', 'success');
      }, 1500);
    }
  
    /**
     * Prepara el editor con el proyecto importado
     * @param {Object} project - Proyecto a editar
     */
    prepareEditor(project) {
      // Guardar proyecto actual
      this.state.currentProject = project;
      
      // Actualizar título del editor
      const editorTitle = document.querySelector('.editor-toolbar .toolbar-left');
      if (editorTitle) {
        const titleSpan = document.createElement('span');
        titleSpan.className = 'editor-project-title';
        titleSpan.textContent = project.name;
        
        // Reemplazar o añadir el título
        const existingTitle = editorTitle.querySelector('.editor-project-title');
        if (existingTitle) {
          editorTitle.replaceChild(titleSpan, existingTitle);
        } else {
          editorTitle.appendChild(titleSpan);
        }
      }
      
      // Actualizar selector de archivos
      const fileSelect = document.getElementById('file-select');
      if (fileSelect) {
        // Limpiar opciones existentes
        fileSelect.innerHTML = '';
        
        // Añadir nuevas opciones
        project.files.forEach(file => {
          const option = document.createElement('option');
          option.value = file.name;
          option.textContent = file.name;
          fileSelect.appendChild(option);
        });
        
        // Seleccionar el primer archivo
        if (project.files.length > 0) {
          this.loadFileInEditor(project.files[0]);
        }
      }
      
      // Actualizar árbol de elementos
      this.updateElementTree(project);
      
      // Cargar vista previa
      this.updatePreview(project);
    }
  
    /**
     * Carga un archivo en el editor
     * @param {Object} file - Archivo a cargar
     */
    loadFileInEditor(file) {
      this.state.currentFile = file;
      
      // Actualizar panel de código
      const codeDisplay = document.getElementById('code-display');
      if (codeDisplay) {
        codeDisplay.textContent = file.content;
      }
      
      // Actualizar panel de propiedades según el tipo de archivo
      this.updatePropertyPanel(file);
      
      // Actualizar vista previa si es un archivo HTML
      if (file.type === 'structure') {
        this.updatePreview();
      }
    }
  
    /**
     * Actualiza el árbol de elementos con los archivos del proyecto
     * @param {Object} project - Proyecto actual
     */
    updateElementTree(project) {
      const elementTree = document.querySelector('.element-tree');
      if (!elementTree) return;
      
      // Limpiar árbol existente
      elementTree.innerHTML = '';
      
      // Organizar archivos por tipo
      const filesByType = {
        structure: [],
        design: [],
        functionality: [],
        other: []
      };
      
      project.files.forEach(file => {
        if (file.type in filesByType) {
          filesByType[file.type].push(file);
        } else {
          filesByType.other.push(file);
        }
      });
      
      // Crear estructura de carpetas
      const folderStructure = {
        'Estructura': filesByType.structure,
        'Diseño': filesByType.design,
        'Funcionalidad': filesByType.functionality,
        'Otros': filesByType.other
      };
      
      // Crear elementos del árbol
      Object.keys(folderStructure).forEach(folderName => {
        const files = folderStructure[folderName];
        if (files.length === 0) return;
        
        // Crear carpeta
        const folderItem = document.createElement('div');
        folderItem.className = 'tree-item';
        folderItem.innerHTML = `
          <div class="tree-item-content">
            <i class="fas fa-chevron-down text-muted"></i>
            <i class="fas fa-folder text-blue"></i>
            <span class="tree-item-text">${folderName}</span>
          </div>
          <div class="tree-children"></div>
        `;
        
        // Añadir archivos a la carpeta
        const treeChildren = folderItem.querySelector('.tree-children');
        files.forEach(file => {
          const fileItem = document.createElement('div');
          fileItem.className = 'tree-item';
          fileItem.innerHTML = `
            <div class="tree-item-content" data-file="${file.name}">
              <span class="tree-item-spacer"></span>
              <i class="fas fa-file text-gray"></i>
              <span class="tree-item-text">${file.name}</span>
            </div>
          `;
          
          // Añadir evento para cargar el archivo
          fileItem.querySelector('.tree-item-content').addEventListener('click', () => {
            this.loadFileInEditor(file);
          });
          
          treeChildren.appendChild(fileItem);
        });
        
        // Añadir carpeta al árbol
        elementTree.appendChild(folderItem);
      });
      
      // Configurar eventos de expansión/colapso
      const folderHeaders = elementTree.querySelectorAll('.tree-item > .tree-item-content');
      folderHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
          if (!e.target.closest('[data-file]')) {
            const chevron = header.querySelector('.fa-chevron-down, .fa-chevron-right');
            const children = header.nextElementSibling;
            
            if (chevron && children) {
              if (chevron.classList.contains('fa-chevron-down')) {
                chevron.classList.remove('fa-chevron-down');
                chevron.classList.add('fa-chevron-right');
                children.style.display = 'none';
              } else {
                chevron.classList.remove('fa-chevron-right');
                chevron.classList.add('fa-chevron-down');
                children.style.display = 'block';
              }
            }
          }
        });
      });
    }
  
    /**
     * Actualiza el panel de propiedades según el tipo de archivo
     * @param {Object} file - Archivo actual
     */
    updatePropertyPanel(file) {
      // Seleccionar la pestaña adecuada según el tipo de archivo
      const propertyTabs = document.querySelectorAll('.property-tab');
      
      if (file.type === 'structure') {
        // Para archivos HTML, mostrar pestaña de elemento
        propertyTabs.forEach(tab => {
          if (tab.getAttribute('data-property-tab') === 'element') {
            tab.click();
          }
        });
      } else if (file.type === 'design') {
        // Para archivos CSS, mostrar pestaña de estilo
        propertyTabs.forEach(tab => {
          if (tab.getAttribute('data-property-tab') === 'style') {
            tab.click();
          }
        });
      } else if (file.type === 'functionality') {
        // Para archivos JS, mostrar pestaña de eventos
        propertyTabs.forEach(tab => {
          if (tab.getAttribute('data-property-tab') === 'events') {
            tab.click();
          }
        });
      }
    }
  
    /**
     * Actualiza la vista previa con el proyecto actual
     */
    updatePreview() {
      const project = this.state.currentProject;
      if (!project) return;
      
      // Buscar archivo HTML principal
      const htmlFile = project.files.find(file => 
        file.type === 'structure' && 
        (file.name.endsWith('.html') || file.name.endsWith('.htm'))
      );
      
      if (!htmlFile) return;
      
      // Buscar archivos CSS
      const cssFiles = project.files.filter(file => 
        file.type === 'design' && 
        file.name.endsWith('.css')
      );
      
      // Buscar archivos JS
      const jsFiles = project.files.filter(file => 
        file.type === 'functionality' && 
        file.name.endsWith('.js')
      );
      
      // Crear contenido HTML con CSS y JS incrustados
      let previewContent = htmlFile.content;
      
      // Insertar CSS
      if (cssFiles.length > 0) {
        let cssContent = '';
        cssFiles.forEach(cssFile => {
          cssContent += `/* ${cssFile.name} */\n${cssFile.content}\n\n`;
        });
        
        // Insertar antes de </head>
        previewContent = previewContent.replace('</head>', `<style>${cssContent}</style></head>`);
      }
      
      // Insertar JS
      if (jsFiles.length > 0) {
        let jsContent = '';
        jsFiles.forEach(jsFile => {
          jsContent += `/* ${jsFile.name} */\n${jsFile.content}\n\n`;
        });
        
        // Insertar antes de </body>
        previewContent = previewContent.replace('</body>', `<script>${jsContent}</script></body>`);
      }
      
      // Actualizar frames de vista previa
      const previewFrame = document.getElementById('preview-frame');
      const fullviewFrame = document.getElementById('fullview-frame');
      
      if (previewFrame) {
        previewFrame.innerHTML = previewContent;
        this.setupElementSelection(previewFrame);
      }
      
      if (fullviewFrame) {
        fullviewFrame.innerHTML = previewContent;
        this.setupElementSelection(fullviewFrame);
      }
    }
  
    /**
     * Configura la selección de elementos en la vista previa
     * @param {HTMLElement} container - Contenedor de la vista previa
     */
    setupElementSelection(container) {
      if (!container) return;
      
      const elements = container.querySelectorAll('*');
      elements.forEach(element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Eliminar selección del elemento previamente seleccionado
          const selectedElements = container.querySelectorAll('[data-selected="true"]');
          selectedElements.forEach(el => {
            el.style.outline = '';
            el.removeAttribute('data-selected');
          });
          
          // Seleccionar el nuevo elemento
          const target = e.target;
          target.style.outline = '2px solid #0070f3';
          target.setAttribute('data-selected', 'true');
          
          // Actualizar panel de propiedades
          this.updateElementProperties(target);
          
          this.showToast('Elemento seleccionado', `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}${target.className ? `.${target.className}` : ''}`);
        });
      });
      
      // Configurar eventos de arrastre
      let isDragging = false;
      let selectedElement = null;
      
      container.addEventListener('mousedown', (e) => {
        selectedElement = e.target.closest('[data-selected="true"]');
        if (selectedElement && e.button === 0) {
          isDragging = true;
          e.preventDefault();
        }
      });
      
      container.addEventListener('mousemove', (e) => {
        if (isDragging && selectedElement) {
          selectedElement.style.position = 'relative';
          selectedElement.style.left = `${parseInt(selectedElement.style.left || '0') + e.movementX}px`;
          selectedElement.style.top = `${parseInt(selectedElement.style.top || '0') + e.movementY}px`;
          
          // Marcar proyecto como modificado
          this.state.isModified = true;
        }
      });
      
      container.addEventListener('mouseup', () => {
        isDragging = false;
      });
      
      container.addEventListener('mouseleave', () => {
        isDragging = false;
      });
    }
  
    /**
     * Actualiza el panel de propiedades con los datos del elemento seleccionado
     * @param {HTMLElement} element - Elemento seleccionado
     */
    updateElementProperties(element) {
      // Actualizar tipo de elemento
      const elementTypeSelect = document.getElementById('element-type');
      if (elementTypeSelect) {
        // Buscar o añadir la opción para este tipo de elemento
        let option = Array.from(elementTypeSelect.options).find(opt => opt.value === element.tagName.toLowerCase());
        
        if (!option) {
          option = document.createElement('option');
          option.value = element.tagName.toLowerCase();
          option.textContent = element.tagName.toLowerCase();
          elementTypeSelect.appendChild(option);
        }
        
        elementTypeSelect.value = element.tagName.toLowerCase();
      }
      
      // Actualizar ID
      const elementIdInput = document.querySelector('#element-properties input[placeholder="ID del elemento"]');
      if (elementIdInput) {
        elementIdInput.value = element.id || '';
      }
      
      // Actualizar clase
      const elementClassInput = document.querySelector('#element-properties input[placeholder="Clase del elemento"]');
      if (elementClassInput) {
        elementClassInput.value = element.className || '';
      }
      
      // Actualizar contenido
      const elementContentInput = document.querySelector('#element-properties input[placeholder="Contenido del elemento"]');
      if (elementContentInput) {
        elementContentInput.value = element.textContent || '';
        
        // Añadir evento para actualizar el contenido
        elementContentInput.onchange = () => {
          element.textContent = elementContentInput.value;
          this.state.isModified = true;
        };
      }
      
      // Actualizar propiedades de estilo
      this.updateStyleProperties(element);
    }
  
    /**
     * Actualiza las propiedades de estilo en el panel de propiedades
     * @param {HTMLElement} element - Elemento seleccionado
     */
    updateStyleProperties(element) {
      const computedStyle = window.getComputedStyle(element);
      
      // Actualizar ancho y alto
      const widthInput = document.querySelector('#style-properties input[placeholder="Ancho"]');
      const heightInput = document.querySelector('#style-properties input[placeholder="Alto"]');
      
      if (widthInput) {
        widthInput.value = element.style.width || computedStyle.width;
        widthInput.onchange = () => {
          element.style.width = widthInput.value;
          this.state.isModified = true;
        };
      }
      
      if (heightInput) {
        heightInput.value = element.style.height || computedStyle.height;
        heightInput.onchange = () => {
          element.style.height = heightInput.value;
          this.state.isModified = true;
        };
      }
      
      // Actualizar márgenes
      const marginInputs = document.querySelectorAll('#style-properties .property-grid-4 input');
      if (marginInputs.length >= 4) {
        marginInputs[0].value = element.style.marginTop || computedStyle.marginTop;
        marginInputs[1].value = element.style.marginRight || computedStyle.marginRight;
        marginInputs[2].value = element.style.marginBottom || computedStyle.marginBottom;
        marginInputs[3].value = element.style.marginLeft || computedStyle.marginLeft;
        
        marginInputs.forEach((input, index) => {
          input.onchange = () => {
            const properties = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
            element.style[properties[index]] = input.value;
            this.state.isModified = true;
          };
        });
      }
      
      // Actualizar color de fondo
      const bgColorInput = document.querySelector('#style-properties .color-input');
      const bgColorPreview = document.querySelector('#style-properties .color-preview');
      
      if (bgColorInput && bgColorPreview) {
        const bgColor = element.style.backgroundColor || computedStyle.backgroundColor;
        const rgbToHex = (rgb) => {
          if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
          
          // Convertir rgb(r, g, b) a #rrggbb
          const rgbRegex = /^rgb$$\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$$$/;
          const match = rgb.match(rgbRegex);
          
          if (match) {
            const r = parseInt(match[1]).toString(16).padStart(2, '0');
            const g = parseInt(match[2]).toString(16).padStart(2, '0');
            const b = parseInt(match[3]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
          }
          
          return rgb;
        };
        
        bgColorInput.value = rgbToHex(bgColor);
        bgColorPreview.style.backgroundColor = bgColorInput.value;
        
        bgColorInput.onchange = () => {
          element.style.backgroundColor = bgColorInput.value;
          bgColorPreview.style.backgroundColor = bgColorInput.value;
          this.state.isModified = true;
        };
      }
      
      // Actualizar color de texto
      const textColorInput = document.querySelectorAll('#style-properties .color-input')[1];
      const textColorPreview = document.querySelectorAll('#style-properties .color-preview')[1];
      
      if (textColorInput && textColorPreview) {
        const textColor = element.style.color || computedStyle.color;
        const rgbToHex = (rgb) => {
          if (!rgb || rgb === 'transparent') return '#000000';
          
          // Convertir rgb(r, g, b) a #rrggbb
          const rgbRegex = /^rgb$$\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$$$/;
          const match = rgb.match(rgbRegex);
          
          if (match) {
            const r = parseInt(match[1]).toString(16).padStart(2, '0');
            const g = parseInt(match[2]).toString(16).padStart(2, '0');
            const b = parseInt(match[3]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
          }
          
          return rgb;
        };
        
        textColorInput.value = rgbToHex(textColor);
        textColorPreview.style.backgroundColor = textColorInput.value;
        
        textColorInput.onchange = () => {
          element.style.color = textColorInput.value;
          textColorPreview.style.backgroundColor = textColorInput.value;
          this.state.isModified = true;
        };
      }
      
      // Actualizar radio de borde
      const borderRadiusSlider = document.querySelector('#style-properties .slider');
      if (borderRadiusSlider) {
        const borderRadius = parseInt(element.style.borderRadius || computedStyle.borderRadius) || 0;
        borderRadiusSlider.value = borderRadius;
        
        borderRadiusSlider.oninput = () => {
          element.style.borderRadius = `${borderRadiusSlider.value}px`;
          this.state.isModified = true;
        };
      }
    }
  
    /**
     * Guarda el proyecto actual y navega a la vista completa
     */
    saveProject() {
      if (!this.state.currentProject) {
        this.showToast('Error', 'No hay un proyecto abierto para guardar.', 'destructive');
        return;
      }
      
      // Mostrar toast de guardado
      this.showToast('Guardando proyecto', 'Procesando cambios...', 'info');
      
      // Actualizar fecha de modificación
      this.state.currentProject.lastModified = new Date();
      
      // Actualizar proyecto en proyectos recientes
      this.updateRecentProject(this.state.currentProject);
      
      // Simular tiempo de guardado
      setTimeout(() => {
        // Navegar a vista completa
        const fullviewTab = document.querySelector('.tab-trigger[data-tab="fullview"]');
        if (fullviewTab) {
          fullviewTab.click();
        }
        
        // Mostrar diálogo de exportación
        this.showExportDialog();
        
        this.showToast('Proyecto guardado', 'El proyecto ha sido guardado correctamente.', 'success');
        
        // Resetear estado de modificación
        this.state.isModified = false;
      }, 1000);
    }
  
    /**
     * Crea el diálogo de exportación
     */
    createExportDialog() {
      // Crear el diálogo si no existe
      if (!document.getElementById('export-dialog')) {
        const dialog = document.createElement('div');
        dialog.id = 'export-dialog';
        dialog.className = 'export-dialog';
        dialog.style.display = 'none';
        
        dialog.innerHTML = `
          <div class="export-dialog-content">
            <div class="export-dialog-header">
              <h3>Exportar Proyecto</h3>
              <button class="export-dialog-close">&times;</button>
            </div>
            <div class="export-dialog-body">
              <p>Selecciona el formato de exportación:</p>
              <div class="export-options">
                <div class="export-option" data-format="html">
                  <i class="fas fa-html5"></i>
                  <span>HTML/CSS/JS</span>
                </div>
                <div class="export-option" data-format="react">
                  <i class="fab fa-react"></i>
                  <span>React</span>
                </div>
                <div class="export-option" data-format="php">
                  <i class="fab fa-php"></i>
                  <span>PHP</span>
                </div>
                <div class="export-option" data-format="python">
                  <i class="fab fa-python"></i>
                  <span>Python</span>
                </div>
                <div class="export-option" data-format="vue">
                  <i class="fab fa-vuejs"></i>
                  <span>Vue.js</span>
                </div>
                <div class="export-option" data-format="angular">
                  <i class="fab fa-angular"></i>
                  <span>Angular</span>
                </div>
              </div>
            </div>
            <div class="export-dialog-footer">
              <button class="btn-outline" id="export-cancel-btn">Cancelar</button>
              <button class="btn-primary" id="export-confirm-btn">Exportar</button>
            </div>
          </div>
        `;
        
        // Añadir estilos para el diálogo
        const style = document.createElement('style');
        style.textContent = `
          .export-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .export-dialog-content {
            background-color: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
          
          .export-dialog-header {
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .export-dialog-header h3 {
            margin: 0;
            font-size: 1.25rem;
          }
          
          .export-dialog-close {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
          }
          
          .export-dialog-body {
            padding: 1.5rem;
          }
          
          .export-options {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .export-option {
            padding: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .export-option:hover {
            background-color: #f1f5f9;
          }
          
          .export-option.selected {
            border-color: #0070f3;
            background-color: rgba(0, 112, 243, 0.1);
          }
          
          .export-option i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
          }
          
          .export-dialog-footer {
            padding: 1rem;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
          }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(dialog);
        
        // Configurar eventos
        const closeBtn = dialog.querySelector('.export-dialog-close');
        const cancelBtn = dialog.querySelector('#export-cancel-btn');
        const confirmBtn = dialog.querySelector('#export-confirm-btn');
        const options = dialog.querySelectorAll('.export-option');
        
        closeBtn.addEventListener('click', () => {
          dialog.style.display = 'none';
        });
        
        cancelBtn.addEventListener('click', () => {
          dialog.style.display = 'none';
        });
        
        options.forEach(option => {
          option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
          });
        });
        
        confirmBtn.addEventListener('click', () => {
          const selectedOption = dialog.querySelector('.export-option.selected');
          if (selectedOption) {
            const format = selectedOption.getAttribute('data-format');
            this.exportProject(format);
          } else {
            this.showToast('Error', 'Por favor, selecciona un formato de exportación.', 'destructive');
          }
        });
      }
    }
  
    /**
     * Muestra el diálogo de exportación
     */
    showExportDialog() {
      const dialog = document.getElementById('export-dialog');
      if (dialog) {
        dialog.style.display = 'flex';
        
        // Seleccionar por defecto el formato actual
        const options = dialog.querySelectorAll('.export-option');
        options.forEach(option => {
          option.classList.remove('selected');
          if (option.getAttribute('data-format') === this.state.currentLanguage) {
            option.classList.add('selected');
          }
        });
      }
    }
  
    /**
     * Exporta el proyecto al formato seleccionado
     * @param {string} format - Formato de exportación
     */
    exportProject(format) {
      if (!this.state.currentProject) {
        this.showToast('Error', 'No hay un proyecto para exportar.', 'destructive');
        return;
      }
      
      // Ocultar diálogo
      const dialog = document.getElementById('export-dialog');
      if (dialog) {
        dialog.style.display = 'none';
      }
      
      // Mostrar toast de exportación
      this.showToast('Exportando proyecto', `Convirtiendo proyecto a formato ${format}...`, 'info');
      
      // Simular tiempo de exportación
      setTimeout(() => {
        // Crear un archivo ZIP para descargar
        this.showToast('Exportación completada', `El proyecto ha sido exportado a formato ${format} correctamente.`, 'success');
        
        // Simular descarga
        const downloadLink = document.createElement('a');
        downloadLink.href = '#';
        downloadLink.download = `proyecto_exportado_${format}.zip`;
        downloadLink.click();
      }, 2000);
    }
  
    /**
     * Añade un proyecto a la lista de proyectos recientes
     * @param {Object} project - Proyecto a añadir
     */
    addToRecentProjects(project) {
      // Cargar proyectos recientes
      this.loadRecentProjects();
      
      // Añadir nuevo proyecto
      this.state.recentProjects.unshift(project);
      
      // Limitar a 10 proyectos
      if (this.state.recentProjects.length > 10) {
        this.state.recentProjects = this.state.recentProjects.slice(0, 10);
      }
      
      // Guardar en localStorage
      localStorage.setItem('recentProjects', JSON.stringify(this.state.recentProjects));
      
      // Actualizar UI
      this.updateRecentProjectsUI();
    }
  
    /**
     * Actualiza un proyecto en la lista de proyectos recientes
     * @param {Object} project - Proyecto a actualizar
     */
    updateRecentProject(project) {
      // Cargar proyectos recientes
      this.loadRecentProjects();
      
      // Buscar y actualizar proyecto
      const index = this.state.recentProjects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        this.state.recentProjects[index] = project;
        
        // Guardar en localStorage
        localStorage.setItem('recentProjects', JSON.stringify(this.state.recentProjects));
        
        // Actualizar UI
        this.updateRecentProjectsUI();
      }
    }
  
    /**
     * Carga los proyectos recientes desde localStorage
     */
    loadRecentProjects() {
      const savedProjects = localStorage.getItem('recentProjects');
      this.state.recentProjects = savedProjects ? JSON.parse(savedProjects) : [];
      
      // Actualizar UI
      this.updateRecentProjectsUI();
    }
  
    /**
     * Actualiza la UI de proyectos recientes
     */
    updateRecentProjectsUI() {
      const container = this.elements.recentProjectsContainer;
      if (!container) return;
      
      // Limpiar contenedor
      container.innerHTML = '';
      
      // Si no hay proyectos recientes
      if (this.state.recentProjects.length === 0) {
        container.innerHTML = `
          <div class="no-projects">
            <p>No hay proyectos recientes.</p>
          </div>
        `;
        return;
      }
      
      // Añadir proyectos recientes
      this.state.recentProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Calcular tiempo relativo
        const timeAgo = this.getTimeAgo(new Date(project.lastModified || project.dateCreated));
        
        // Determinar icono según lenguaje
        let icon = '';
        switch (project.language) {
          case 'html':
            icon = '<i class="fas fa-code text-primary-light"></i>';
            break;
          case 'react':
            icon = '<span class="project-icon">⚛️</span>';
            break;
          case 'php':
            icon = '<span class="project-icon">🐘</span>';
            break;
          case 'python':
            icon = '<span class="project-icon">🐍</span>';
            break;
          default:
            icon = '<i class="fas fa-file-code text-primary-light"></i>';
        }
        
        projectCard.innerHTML = `
          <div class="project-thumbnail">
            ${icon}
          </div>
          <h3 class="project-title">${project.name}</h3>
          <div class="project-meta">
            <span class="project-tech">${project.language.toUpperCase()}</span>
            <p class="project-date">${timeAgo}</p>
          </div>
        `;
        
        // Añadir evento para abrir el proyecto
        projectCard.addEventListener('click', () => {
          this.openRecentProject(project);
        });
        
        container.appendChild(projectCard);
      });
    }
  
    /**
     * Abre un proyecto reciente
     * @param {Object} project - Proyecto a abrir
     */
    openRecentProject(project) {
      // Mostrar toast de apertura
      this.showToast('Abriendo proyecto', 'Cargando proyecto...', 'info');
      
      // Simular tiempo de carga
      setTimeout(() => {
        // Preparar el editor
        this.state.currentProject = project;
        this.prepareEditor(project);
        
        // Navegar al editor
        const editorTab = document.querySelector('.tab-trigger[data-tab="editor"]');
        if (editorTab) {
          editorTab.click();
        }
        
        this.showToast('Proyecto abierto', 'El proyecto ha sido cargado correctamente.', 'success');
      }, 1000);
    }
  
    /**
     * Obtiene el tiempo relativo desde una fecha
     * @param {Date} date - Fecha a comparar
     * @returns {string} - Tiempo relativo
     */
    getTimeAgo(date) {
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);
      
      if (diffSecs < 60) {
        return 'Hace unos segundos';
      } else if (diffMins < 60) {
        return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
      } else if (diffHours < 24) {
        return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
      } else if (diffDays < 7) {
        return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
      } else if (diffWeeks < 4) {
        return `Hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
      } else {
        return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
      }
    }
  
    /**
     * Muestra una notificación toast
     * @param {string} title - Título del toast
     * @param {string} description - Descripción del toast
     * @param {string} variant - Variante del toast (default, success, destructive, info)
     */
    showToast(title, description, variant = 'default') {
      const toastContainer = document.getElementById('toast-container');
      if (!toastContainer) return;
      
      const toast = document.createElement('div');
      toast.className = 'toast';
      
      // Aplicar estilo según variante
      if (variant === 'destructive') {
        toast.style.borderLeft = '4px solid #ef4444';
      } else if (variant === 'success') {
        toast.style.borderLeft = '4px solid #22c55e';
      } else if (variant === 'info') {
        toast.style.borderLeft = '4px solid #3b82f6';
      }
      
      toast.innerHTML = `
        <div class="toast-header">
          <h4 class="toast-title">${title}</h4>
          <button class="toast-close">&times;</button>
        </div>
        <div class="toast-description">${description}</div>
      `;
      
      toastContainer.appendChild(toast);
      
      // Añadir evento para cerrar el toast
      toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.remove();
      });
      
      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 5000);
    }
  }
  
  // Inicializar el controlador cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    window.editorController = new EditorController();
  });

  
  
  