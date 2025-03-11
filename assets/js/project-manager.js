/**
 * project-manager.js
 * Gestiona los proyectos, miniaturas y almacenamiento local
 */

class ProjectManager {
    constructor() {
      this.projects = [];
      this.currentProject = null;
      this.eventListeners = {};
      this.maxRecentProjects = 8;
    }
  
    /**
     * Inicializa el gestor de proyectos
     */
    init() {
      this.loadProjects();
      this.setupEventListeners();
      this.renderRecentProjects();
      console.log('ProjectManager inicializado');
    }
  
    /**
     * Configura los listeners de eventos
     */
    setupEventListeners() {
      // Escuchar eventos del importador
      document.addEventListener('importHandler:projectImported', (e) => {
        this.handleProjectImported(e.detail.projectData);
      });
  
      // Escuchar eventos del editor
      document.addEventListener('editorController:projectSaved', (e) => {
        this.handleProjectSaved(e.detail.projectData);
      });
  
      // Escuchar eventos del exportador
      document.addEventListener('exportHandler:projectExported', (e) => {
        this.handleProjectExported(e.detail.projectData, e.detail.exportType);
      });
    }
  
    /**
     * Carga los proyectos desde el almacenamiento local
     */
    loadProjects() {
      try {
        const savedProjects = localStorage.getItem('savedProjects');
        if (savedProjects) {
          this.projects = JSON.parse(savedProjects);
        }
  
        const currentProject = localStorage.getItem('currentProject');
        if (currentProject) {
          this.currentProject = JSON.parse(currentProject);
        }
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        this.projects = [];
        this.currentProject = null;
      }
    }
  
    /**
     * Guarda los proyectos en el almacenamiento local
     */
    saveProjects() {
      try {
        localStorage.setItem('savedProjects', JSON.stringify(this.projects));
        if (this.currentProject) {
          localStorage.setItem('currentProject', JSON.stringify(this.currentProject));
        }
      } catch (error) {
        console.error('Error al guardar proyectos:', error);
        this.showToast('Error', 'No se pudieron guardar los proyectos', 'destructive');
      }
    }
  
    /**
     * Maneja un proyecto importado
     */
    handleProjectImported(projectData) {
      // Generar un ID único para el proyecto
      projectData.id = this.generateProjectId();
      
      // Añadir fecha de creación
      projectData.createdAt = new Date().toISOString();
      projectData.updatedAt = new Date().toISOString();
      
      // Generar un nombre para el proyecto si no tiene
      if (!projectData.name) {
        projectData.name = this.generateProjectName(projectData);
      }
      
      // Generar una miniatura para el proyecto
      projectData.thumbnail = this.generateThumbnail(projectData);
      
      // Establecer como proyecto actual
      this.currentProject = projectData;
      
      // Añadir a la lista de proyectos recientes
      this.addToRecentProjects(projectData);
      
      // Guardar proyectos
      this.saveProjects();
      
      // Disparar evento
      this.triggerEvent('projectLoaded', { projectData });
    }
  
    /**
     * Maneja un proyecto guardado
     */
    handleProjectSaved(projectData) {
      // Actualizar fecha de modificación
      projectData.updatedAt = new Date().toISOString();
      
      // Actualizar miniatura
      projectData.thumbnail = this.generateThumbnail(projectData);
      
      // Actualizar proyecto actual
      this.currentProject = projectData;
      
      // Actualizar en la lista de proyectos recientes
      this.updateRecentProject(projectData);
      
      // Guardar proyectos
      this.saveProjects();
      
      // Disparar evento
      this.triggerEvent('projectUpdated', { projectData });
    }
  
    /**
     * Maneja un proyecto exportado
     */
    handleProjectExported(projectData, exportType) {
      // Registrar la exportación en el historial del proyecto
      if (!projectData.exportHistory) {
        projectData.exportHistory = [];
      }
      
      projectData.exportHistory.push({
        type: exportType,
        timestamp: new Date().toISOString()
      });
      
      // Actualizar proyecto actual
      this.currentProject = projectData;
      
      // Actualizar en la lista de proyectos recientes
      this.updateRecentProject(projectData);
      
      // Guardar proyectos
      this.saveProjects();
    }
  
    /**
     * Añade un proyecto a la lista de proyectos recientes
     */
    addToRecentProjects(projectData) {
      // Eliminar el proyecto si ya existe en la lista
      this.projects = this.projects.filter(project => project.id !== projectData.id);
      
      // Añadir el proyecto al principio de la lista
      this.projects.unshift(projectData);
      
      // Limitar el número de proyectos recientes
      if (this.projects.length > this.maxRecentProjects) {
        this.projects = this.projects.slice(0, this.maxRecentProjects);
      }
      
      // Actualizar la UI
      this.renderRecentProjects();
    }
  
    /**
     * Actualiza un proyecto en la lista de proyectos recientes
     */
    updateRecentProject(projectData) {
      // Buscar el proyecto en la lista
      const index = this.projects.findIndex(project => project.id === projectData.id);
      
      if (index !== -1) {
        // Actualizar el proyecto
        this.projects[index] = projectData;
        
        // Mover al principio de la lista
        this.projects.splice(index, 1);
        this.projects.unshift(projectData);
      } else {
        // Si no existe, añadirlo
        this.addToRecentProjects(projectData);
      }
      
      // Actualizar la UI
      this.renderRecentProjects();
    }
  
    /**
     * Renderiza la lista de proyectos recientes en la UI
     */
    renderRecentProjects() {
      const projectsGrid = document.querySelector('.projects-grid');
      if (!projectsGrid) return;
      
      // Limpiar contenido actual
      projectsGrid.innerHTML = '';
      
      // Si no hay proyectos, mostrar mensaje
      if (this.projects.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-projects-message';
        emptyMessage.textContent = 'No hay proyectos recientes. Importa un proyecto para comenzar.';
        projectsGrid.appendChild(emptyMessage);
        return;
      }
      
      // Renderizar cada proyecto
      this.projects.forEach(project => {
        const projectCard = this.createProjectCard(project);
        projectsGrid.appendChild(projectCard);
      });
    }
  
    /**
     * Crea un elemento de tarjeta de proyecto
     */
    createProjectCard(project) {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.dataset.projectId = project.id;
      
      // Crear miniatura
      const thumbnail = document.createElement('div');
      thumbnail.className = 'project-thumbnail';
      
      // Si hay una miniatura guardada, usarla
      if (project.thumbnail) {
        thumbnail.style.backgroundImage = `url(${project.thumbnail})`;
        thumbnail.style.backgroundSize = 'cover';
        thumbnail.style.backgroundPosition = 'center';
      } else {
        // Si no hay miniatura, mostrar un icono según el lenguaje
        const icon = document.createElement(project.language === 'react' ? 'span' : 'i');
        
        switch (project.language) {
          case 'html':
            icon.className = 'fas fa-code text-primary-light';
            break;
          case 'react':
            icon.className = 'project-icon';
            icon.textContent = '⚛️';
            break;
          case 'php':
            icon.className = 'project-icon';
            icon.textContent = '🐘';
            break;
          case 'python':
            icon.className = 'project-icon';
            icon.textContent = '🐍';
            break;
          case 'vue':
            icon.className = 'fas fa-vuejs text-green-light';
            break;
          case 'angular':
            icon.className = 'fas fa-angular text-red-light';
            break;
          default:
            icon.className = 'fas fa-file-code text-primary-light';
        }
        
        thumbnail.appendChild(icon);
      }
      
      // Crear título
      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.name || 'Proyecto sin nombre';
      
      // Crear metadatos
      const meta = document.createElement('div');
      meta.className = 'project-meta';
      
      // Tecnología
      const tech = document.createElement('span');
      tech.className = 'project-tech';
      tech.textContent = this.getLanguageDisplayName(project.language);
      
      // Fecha
      const date = document.createElement('p');
      date.className = 'project-date';
      date.textContent = this.formatDate(project.updatedAt || project.createdAt);
      
      // Ensamblar elementos
      meta.appendChild(tech);
      meta.appendChild(date);
      
      card.appendChild(thumbnail);
      card.appendChild(title);
      card.appendChild(meta);
      
      // Añadir evento de clic
      card.addEventListener('click', () => this.openProject(project.id));
      
      return card;
    }
  
    /**
     * Abre un proyecto existente
     */
    openProject(projectId) {
      // Buscar el proyecto
      const project = this.projects.find(p => p.id === projectId);
      
      if (!project) {
        this.showToast('Error', 'No se pudo encontrar el proyecto', 'destructive');
        return;
      }
      
      // Establecer como proyecto actual
      this.currentProject = project;
      localStorage.setItem('currentProject', JSON.stringify(project));
      
      // Mover al principio de la lista de recientes
      this.updateRecentProject(project);
      
      // Disparar evento
      this.triggerEvent('projectLoaded', { projectData: project });
      
      // Redirigir al editor
      const editorTab = document.querySelector('.tab-trigger[data-tab="editor"]');
      if (editorTab) {
        editorTab.click();
      }
    }
  
    /**
     * Genera un ID único para un proyecto
     */
    generateProjectId() {
      return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
  
    /**
     * Genera un nombre para un proyecto basado en sus archivos
     */
    generateProjectName(projectData) {
      // Si hay una URL, usar el dominio
      if (projectData.url) {
        try {
          const url = new URL(projectData.url);
          return `Proyecto de ${url.hostname}`;
        } catch (e) {
          // Si la URL no es válida, usar un nombre genérico
        }
      }
      
      // Si hay archivos, usar el nombre del primer archivo HTML o similar
      if (projectData.files && projectData.files.length > 0) {
        // Buscar un archivo HTML
        const htmlFile = projectData.files.find(file => 
          file.name.endsWith('.html') || 
          file.name.endsWith('.htm') || 
          file.name.endsWith('.php') || 
          file.name.endsWith('.jsx')
        );
        
        if (htmlFile) {
          return htmlFile.name.split('.')[0];
        }
        
        // Si no hay archivo HTML, usar el nombre del primer archivo
        return projectData.files[0].name.split('.')[0];
      }
      
      // Si no hay nada más, usar un nombre genérico con la fecha
      const date = new Date();
      return `Proyecto ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }
  
    /**
     * Genera una miniatura para un proyecto
     */
    generateThumbnail(projectData) {
      // En un entorno real, esto generaría una captura de pantalla del proyecto
      // Para esta implementación, usaremos una imagen de marcador de posición
      
      // Si el proyecto ya tiene una miniatura, devolverla
      if (projectData.thumbnail) {
        return projectData.thumbnail;
      }
      
      // Generar un color basado en el lenguaje
      let color;
      switch (projectData.language) {
        case 'html':
          color = '0070f3'; // Azul
          break;
        case 'react':
          color = '61dafb'; // Azul claro
          break;
        case 'php':
          color = '8892bf'; // Púrpura
          break;
        case 'python':
          color = 'ffd43b'; // Amarillo
          break;
        case 'vue':
          color = '42b883'; // Verde
          break;
        case 'angular':
          color = 'dd0031'; // Rojo
          break;
        default:
          color = '0070f3'; // Azul por defecto
      }
      
      // Devolver una URL de datos para una miniatura de color sólido
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23${color}' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' fill='%23${color}' dominant-baseline='middle'%3E${this.getLanguageDisplayName(projectData.language)}%3C/text%3E%3C/svg%3E`;
    }
  
    /**
     * Obtiene el nombre de visualización de un lenguaje
     */
    getLanguageDisplayName(language) {
      switch (language) {
        case 'html':
          return 'HTML/CSS/JS';
        case 'react':
          return 'React';
        case 'php':
          return 'PHP';
        case 'python':
          return 'Python';
        case 'vue':
          return 'Vue.js';
        case 'angular':
          return 'Angular';
        default:
          return language.charAt(0).toUpperCase() + language.slice(1);
      }
    }
  
    /**
     * Formatea una fecha ISO a un formato legible
     */
    formatDate(isoDate) {
      if (!isoDate) return 'Fecha desconocida';
      
      const date = new Date(isoDate);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Hoy';
      } else if (diffDays === 1) {
        return 'Ayer';
      } else if (diffDays < 7) {
        return `Hace ${diffDays} días`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
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
      const event = new CustomEvent(`projectManager:${eventName}`, { detail: data });
      document.dispatchEvent(event);
    }
  }
  
  // Crear instancia global
  window.projectManager = new ProjectManager();
  
  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    window.projectManager.init();
  });
  
  