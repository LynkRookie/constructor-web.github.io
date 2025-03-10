// Initialize Lucide icons
let lucide // Declare lucide variable
document.addEventListener("DOMContentLoaded", () => {
  lucide = window.lucide // Assign lucide from window object
  lucide.createIcons()
  initApp()
  initThemeToggle() // Inicializar el toggle de tema
})

// Main app initialization
function initApp() {
  initTabs()
  initSecondaryTabs()
  initEditorTabs()
  initPropertyTabs()
  initCodeTabs()
  initDeviceButtons()
  initZoomControls()
  initTreeView()
  initViewToggle()
  initColorPickers()
  initImportButtons()
  initSampleHTML()
  initDropZones() // Inicializar las zonas de arrastre
}

// ===== Theme Toggle =====
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle")
  if (!themeToggle) return

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  const storedTheme = localStorage.getItem("theme")

  // Función para aplicar el tema
  function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark)
    themeToggle.innerHTML = isDark ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>'
    localStorage.setItem("theme", isDark ? "dark" : "light")
    if (window.lucide) window.lucide.createIcons()
  }

  // Aplicar tema inicial
  if (storedTheme === "dark" || (storedTheme === null && prefersDarkScheme.matches)) {
    applyTheme(true)
  } else {
    applyTheme(false)
  }

  // Evento de clic en el botón de cambio de tema
  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark")
    applyTheme(isDark)
  })

  // Escuchar cambios en la preferencia del sistema
  prefersDarkScheme.addListener((e) => {
    if (localStorage.getItem("theme") === null) {
      applyTheme(e.matches)
    }
  })
}

// Mejorar la función showToast para hacerla más atractiva
function showToast(title, description, duration = 3000) {
  const toastContainer = document.getElementById("toast-container")
  const toast = document.getElementById("toast")
  const toastTitle = document.getElementById("toast-title")
  const toastDescription = document.getElementById("toast-description")

  if (!toastContainer || !toast || !toastTitle || !toastDescription) {
    console.error("Toast elements not found")
    return
  }

  // Detener cualquier animación anterior
  clearTimeout(toast.timeoutId)
  toastContainer.classList.remove("fade-in")

  // Establecer contenido del toast
  toastTitle.innerHTML = title
  toastDescription.innerHTML = description

  // Mostrar toast con animación
  toastContainer.classList.remove("hidden")
  setTimeout(() => {
    toastContainer.classList.add("fade-in")
  }, 10)

  // Ocultar toast después de la duración
  toast.timeoutId = setTimeout(() => {
    toastContainer.classList.remove("fade-in")
    setTimeout(() => {
      toastContainer.classList.add("hidden")
    }, 300)
  }, duration)

  // Agregar botón de cerrar si no existe
  if (!toast.querySelector(".toast-close")) {
    const closeBtn = document.createElement("button")
    closeBtn.className = "toast-close"
    closeBtn.innerHTML = '<i data-lucide="x"></i>'
    closeBtn.addEventListener("click", () => {
      clearTimeout(toast.timeoutId)
      toastContainer.classList.remove("fade-in")
      setTimeout(() => {
        toastContainer.classList.add("hidden")
      }, 300)
    })
    toast.appendChild(closeBtn)
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }
}

// Inicializar el tema al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar el toggle de tema
  initThemeToggle()

  // Exponer la función showToast globalmente
  window.showToast = showToast
})

// ===== Tab Functionality =====
function initTabs() {
  const tabTriggers = document.querySelectorAll(".tab-triggers")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const tabName = trigger.getAttribute("data-tab")

      // Deactivate all tabs and content
      document.querySelectorAll(".tab-triggers").forEach((t) => t.classList.remove("active"))
      document.querySelectorAll(".tab-contents").forEach((c) => c.classList.remove("active"))

      // Activate selected tab and content
      trigger.classList.add("active")
      const tabContent = document.getElementById(`${tabName}-tab`)
      if (tabContent) {
        tabContent.classList.add("active")
      }
    })
  })
}

function initSecondaryTabs() {
  const tabTriggers = document.querySelectorAll(".tab-trigger-secondary")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const tabName = trigger.getAttribute("data-tab")

      // Deactivate all tabs and content
      document.querySelectorAll(".tab-trigger-secondary").forEach((t) => t.classList.remove("active"))
      document.querySelectorAll(".tab-content-secondary").forEach((c) => c.classList.remove("active"))

      // Activate selected tab and content
      trigger.classList.add("active")
      const tabContent = document.getElementById(`${tabName}-tab`)
      if (tabContent) {
        tabContent.classList.add("active")
      }
    })
  })
}

function initEditorTabs() {
  const tabTriggers = document.querySelectorAll(".editor-tab")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      document.querySelectorAll(".editor-tab").forEach((t) => t.classList.remove("active"))
      trigger.classList.add("active")
    })
  })
}

function initPropertyTabs() {
  const tabTriggers = document.querySelectorAll(".property-tab")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const tabName = trigger.getAttribute("data-property-tab")

      // Deactivate all tabs and content
      document.querySelectorAll(".property-tab").forEach((t) => t.classList.remove("active"))
      document.querySelectorAll(".property-tab-content").forEach((c) => c.classList.remove("active"))

      // Activate selected tab and content
      trigger.classList.add("active")
      document.getElementById(`${tabName}-tab`).classList.add("active")
    })
  })
}

function initCodeTabs() {
  const tabTriggers = document.querySelectorAll(".code-tab")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const codeType = trigger.getAttribute("data-code-tab")

      // Deactivate all tabs
      document.querySelectorAll(".code-tab").forEach((t) => t.classList.remove("active"))

      // Activate selected tab
      trigger.classList.add("active")

      // Update code display
      updateCodeDisplay(codeType)
    })
  })
}

// ===== Device Preview Controls =====
function initDeviceButtons() {
  const deviceButtons = document.querySelectorAll("[data-device]")

  deviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const device = button.getAttribute("data-device")
      const previewContainer = button
        .closest(".preview-toolbar, .fullview-toolbar")
        .nextElementSibling.querySelector(".preview-container")

      // Remove active class from all buttons in the same group
      button.parentElement.querySelectorAll(".button").forEach((btn) => {
        btn.classList.remove("active")
      })

      // Add active class to clicked button
      button.classList.add("active")

      // Update preview container class
      previewContainer.classList.remove("desktop", "tablet", "mobile")
      previewContainer.classList.add(device)
    })
  })
}

// ===== Zoom Controls =====
function initZoomControls() {
  // Preview panel zoom
  initZoomControl("zoom-out", "zoom-in", "zoom-level", "preview-container")

  // Full view zoom
  initZoomControl("fullview-zoom-out", "fullview-zoom-in", "fullview-zoom-level", "fullview-preview-container")
}

function initZoomControl(zoomOutId, zoomInId, zoomLevelId, containerId) {
  const zoomOutBtn = document.getElementById(zoomOutId)
  const zoomInBtn = document.getElementById(zoomInId)
  const zoomLevelSelect = document.getElementById(zoomLevelId)
  const container = document.getElementById(containerId)

  if (!zoomOutBtn || !zoomInBtn || !zoomLevelSelect || !container) return

  zoomOutBtn.addEventListener("click", () => {
    const currentZoom = Number.parseInt(zoomLevelSelect.value)
    const newZoom = Math.max(50, currentZoom - 10)
    zoomLevelSelect.value = newZoom
    applyZoom(container, newZoom)
  })

  zoomInBtn.addEventListener("click", () => {
    const currentZoom = Number.parseInt(zoomLevelSelect.value)
    const newZoom = Math.min(200, currentZoom + 10)
    zoomLevelSelect.value = newZoom
    applyZoom(container, newZoom)
  })

  zoomLevelSelect.addEventListener("change", () => {
    const zoom = Number.parseInt(zoomLevelSelect.value)
    applyZoom(container, zoom)
  })
}

function applyZoom(container, zoom) {
  container.style.transform = `scale(${zoom / 100})`
  container.style.transformOrigin = "top center"
}

// ===== Tree View =====
function initTreeView() {
  const toggleButtons = document.querySelectorAll(".tree-toggle")

  toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()

      const treeItem = button.closest(".tree-item")
      const children = treeItem.querySelector(".tree-item-children")

      if (children) {
        const isHidden = children.classList.contains("hidden")

        // Toggle children visibility
        if (isHidden) {
          children.classList.remove("hidden")
          button.setAttribute("data-lucide", "chevron-down")
        } else {
          children.classList.add("hidden")
          button.setAttribute("data-lucide", "chevron-right")
        }

        // Re-render the icon
        lucide.replace()
      }
    })
  })
}

// ===== View Toggle =====
function initViewToggle() {
  // Editor view toggle
  const toggleViewModeBtn = document.getElementById("toggle-view-mode-btn")
  if (toggleViewModeBtn) {
    toggleViewModeBtn.addEventListener("click", () => {
      const previewPanel = document.getElementById("preview-panel")
      const codePanel = document.getElementById("code-panel")

      const isVisualMode = !previewPanel.classList.contains("hidden")

      if (isVisualMode) {
        // Switch to code view
        previewPanel.classList.add("hidden")
        codePanel.classList.remove("hidden")
        toggleViewModeBtn.innerHTML = '<i data-lucide="layout"></i> Vista Visual'
        updateCodeDisplay("html")
      } else {
        // Switch to visual view
        codePanel.classList.add("hidden")
        previewPanel.classList.remove("hidden")
        toggleViewModeBtn.innerHTML = '<i data-lucide="code"></i> Vista de Código'
      }

      lucide.createIcons()
    })
  }

  // Full view toggle
  const fullviewToggleBtn = document.getElementById("fullview-toggle-btn")
  if (fullviewToggleBtn) {
    fullviewToggleBtn.addEventListener("click", () => {
      const previewView = document.getElementById("fullview-preview")
      const codeView = document.getElementById("fullview-code")

      const isVisualMode = !previewView.classList.contains("hidden")

      if (isVisualMode) {
        // Switch to code view
        previewView.classList.add("hidden")
        codeView.classList.remove("hidden")
        fullviewToggleBtn.innerHTML = '<i data-lucide="eye"></i> Ver Visual'
        updateFullViewCodeDisplay()
      } else {
        // Switch to visual view
        codeView.classList.add("hidden")
        previewView.classList.remove("hidden")
        fullviewToggleBtn.innerHTML = '<i data-lucide="code"></i> Ver Código'
      }

      lucide.createIcons()
    })
  }

  // Toggle preview
  const togglePreviewBtn = document.getElementById("toggle-preview-btn")
  if (togglePreviewBtn) {
    togglePreviewBtn.addEventListener("click", () => {
      const showPreview = togglePreviewBtn.textContent.includes("Ocultar")

      if (showPreview) {
        togglePreviewBtn.innerHTML = '<i data-lucide="eye"></i> Mostrar Vista Previa'
      } else {
        togglePreviewBtn.innerHTML = '<i data-lucide="eye-off"></i> Ocultar Vista Previa'
      }

      lucide.createIcons()
    })
  }
}

// ===== Color Pickers =====
function initColorPickers() {
  const colorPreviews = document.querySelectorAll(".color-preview")
  const popover = document.getElementById("color-picker-popover")
  const gradient = document.querySelector(".color-gradient")
  const presets = document.querySelectorAll(".color-preset")
  const popoverInput = document.getElementById("popover-color-input")

  let activeInput = null
  let activePreview = null

  // Initialize color previews
  colorPreviews.forEach((preview) => {
    const input = preview.nextElementSibling
    preview.style.backgroundColor = input.value

    preview.addEventListener("click", (e) => {
      e.stopPropagation()

      // Position popover
      const rect = preview.getBoundingClientRect()
      popover.style.top = `${rect.bottom + 5}px`
      popover.style.left = `${rect.left}px`

      // Show popover
      popover.style.display = "block"

      // Set active elements
      activeInput = input
      activePreview = preview
      popoverInput.value = input.value
    })
  })

  // Handle gradient clicks
  if (gradient) {
    gradient.addEventListener("click", (e) => {
      const rect = gradient.getBoundingClientRect()
      const x = e.clientX - rect.left
      const ratio = x / rect.width
      const hue = Math.floor(ratio * 360)
      const color = `hsl(${hue}, 100%, 50%)`

      updateColorSelection(color)
    })
  }

  // Handle preset clicks
  presets.forEach((preset) => {
    const color = preset.getAttribute("data-color")
    preset.style.backgroundColor = color

    preset.addEventListener("click", () => {
      updateColorSelection(color)
    })
  })

  // Handle input change
  if (popoverInput) {
    popoverInput.addEventListener("input", () => {
      updateColorSelection(popoverInput.value)
    })
  }

  // Close popover on click outside
  document.addEventListener("click", () => {
    popover.style.display = "none"
  })

  popover.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Update color selection
  function updateColorSelection(color) {
    if (activeInput && activePreview) {
      activeInput.value = color
      activePreview.style.backgroundColor = color
      popoverInput.value = color
    }
  }
}

// ===== Toast Functionality =====
window.showToast = showToast

// ===== Drag and Drop Functionality =====
function initDropZones() {
  const dropzones = document.querySelectorAll(".dropzone")

  dropzones.forEach((dropzone) => {
    // Prevent default behavior to allow drop
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, preventDefaults, false)
    })

    // Highlight drop area when item is dragged over it
    ;["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, highlight, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, unhighlight, false)
    })

    // Handle dropped files
    dropzone.addEventListener("drop", handleDrop, false)
  })

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function highlight(e) {
    this.classList.add("highlight")
  }

  function unhighlight(e) {
    this.classList.remove("highlight")
  }

  function handleDrop(e) {
    const dt = e.dataTransfer
    const files = dt.files

    if (files.length > 0) {
      // Simulate file upload
      const section = this.closest(".import-section")
      if (section) {
        const sectionId = section.id
        const sectionType = sectionId.replace("-section", "")
        const importBtn = section.querySelector(".import-btn")

        if (importBtn) {
          importBtn.click() // Trigger the import button click
        }
      } else {
        // Handle general file drop
        showToast("Archivos recibidos", `Se han recibido ${files.length} archivo(s)`)
      }
    }
  }
}

// ===== Import Functionality =====
function initImportButtons() {
  // Import sections
  const importBtns = document.querySelectorAll(".import-btn")

  importBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section")
      const sectionElement = document.getElementById(`${section}-section`)
      const checkElement = document.getElementById(`${section}-check`)

      if (!sectionElement || !checkElement) {
        console.error(`Section elements not found for ${section}`)
        return
      }

      // Disable button during import
      btn.disabled = true
      btn.textContent = "Importando..."

      // Simulate import process
      setTimeout(() => {
        // Mark as imported
        sectionElement.classList.add("success")
        checkElement.classList.remove("hidden")
        checkElement.innerHTML = '<i data-lucide="check-circle"></i>'
        lucide.createIcons()

        // Re-enable button
        btn.disabled = false
        btn.textContent = `Importar ${section === "structure" ? "Estructura" : section === "design" ? "Diseño" : "Funcionalidad"}`

        // Show success toast
        showToast(
          "Importación exitosa",
          `La sección de ${section === "structure" ? "estructura" : section === "design" ? "diseño" : "funcionalidad"} ha sido importada correctamente.`,
        )
      }, 1500)
    })
  })

  // Import project
  const importProjectBtn = document.getElementById("import-project-btn")

  if (importProjectBtn) {
    importProjectBtn.addEventListener("click", () => {
      const importedSections = document.querySelectorAll(
        "#structure-check:not(.hidden), #design-check:not(.hidden), #functionality-check:not(.hidden)",
      )

      if (importedSections.length === 0) {
        showToast("Advertencia", "Debes importar al menos una sección antes de continuar.", 5000)
        return
      }

      // Disable button during import
      importProjectBtn.disabled = true
      importProjectBtn.textContent = "Importando Proyecto..."

      // Simulate import process
      setTimeout(() => {
        // Re-enable button
        importProjectBtn.disabled = false
        importProjectBtn.textContent = "Importar Proyecto"

        // Show success toast
        showToast("Proyecto importado", "Tu proyecto ha sido importado correctamente y está listo para editar.")

        // Switch to Full View tab
        const fullViewTab = document.querySelector('[data-tab="fullview"]')
        if (fullViewTab) {
          fullViewTab.click()
        }
      }, 2000)
    })
  }

  // Import from URL
  const importUrlBtn = document.getElementById("import-url-btn")

  if (importUrlBtn) {
    importUrlBtn.addEventListener("click", () => {
      const urlInput = document.querySelector("#url-tab input")
      if (!urlInput || !urlInput.value.trim()) {
        showToast("Error", "Por favor, introduce una URL válida.")
        return
      }

      // Disable button during import
      importUrlBtn.disabled = true
      importUrlBtn.textContent = "Importando..."

      // Simulate import process
      setTimeout(() => {
        // Marcar todas las secciones como importadas
        const structureCheck = document.getElementById("structure-check")
        const designCheck = document.getElementById("design-check")
        const functionalityCheck = document.getElementById("functionality-check")

        if (structureCheck) {
          structureCheck.classList.remove("hidden")
          structureCheck.innerHTML = '<i data-lucide="check-circle"></i>'
          document.getElementById("structure-section").classList.add("success")
        }

        if (designCheck) {
          designCheck.classList.remove("hidden")
          designCheck.innerHTML = '<i data-lucide="check-circle"></i>'
          document.getElementById("design-section").classList.add("success")
        }

        if (functionalityCheck) {
          functionalityCheck.classList.remove("hidden")
          functionalityCheck.innerHTML = '<i data-lucide="check-circle"></i>'
          document.getElementById("functionality-section").classList.add("success")
        }

        lucide.createIcons()

        // Re-enable button
        importUrlBtn.disabled = false
        importUrlBtn.textContent = "Importar desde URL"

        // Show success toast
        showToast("URL importada", `El sitio web ha sido importado correctamente desde ${urlInput.value}`)

        // Habilitar el botón de importar proyecto
        const importProjectBtn = document.getElementById("import-project-btn")
        if (importProjectBtn) {
          importProjectBtn.disabled = false
        }
      }, 2000)
    })
  }

  // Import from code
  const importCodeBtn = document.getElementById("import-code-btn")

  if (importCodeBtn) {
    importCodeBtn.addEventListener("click", () => {
      const codeTextarea = document.querySelector("#code-tab textarea")
      if (!codeTextarea || !codeTextarea.value.trim()) {
        showToast("Error", "Por favor, introduce algún código para importar.")
        return
      }

      // Disable button during import
      importCodeBtn.disabled = true
      importCodeBtn.textContent = "Importando..."

      // Simulate import process
      setTimeout(() => {
        // Marcar todas las secciones como importadas
        const structureCheck = document.getElementById("structure-check")
        const designCheck = document.getElementById("design-check")
        const functionalityCheck = document.getElementById("functionality-check")

        if (structureCheck) {
          structureCheck.classList.remove("hidden")
          structureCheck.innerHTML = '<i data-lucide="check-circle"></i>'
          document.getElementById("structure-section").classList.add("success")
        }

        if (designCheck) {
          designCheck.classList.remove("hidden")
          designCheck.innerHTML = '<i data-lucide="check-circle"></i>'
          document.getElementById("design-section").classList.add("success")
        }

        if (functionalityCheck) {
          functionalityCheck.classList.remove("hidden")
          functionalityCheck.innerHTML = '<i data-lucide="check-circle"></i>'
          document.getElementById("functionality-section").classList.add("success")
        }

        lucide.createIcons()

        // Re-enable button
        importCodeBtn.disabled = false
        importCodeBtn.textContent = "Importar Código"

        // Show success toast
        showToast("Código importado", "El código ha sido importado correctamente.")

        // Habilitar el botón de importar proyecto
        const importProjectBtn = document.getElementById("import-project-btn")
        if (importProjectBtn) {
          importProjectBtn.disabled = false
        }
      }, 2000)
    })
  }
}

// ===== Sample HTML and Code Display =====
function initSampleHTML() {
  const sampleHTML = `
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

  const previewContainer = document.getElementById("preview-container")
  if (previewContainer) {
    previewContainer.innerHTML = sampleHTML
    addSelectionListeners(previewContainer)
  }

  const fullviewPreviewContainer = document.getElementById("fullview-preview-container")
  if (fullviewPreviewContainer) {
    fullviewPreviewContainer.innerHTML = sampleHTML
    addSelectionListeners(fullviewPreviewContainer)
  }
}

function addSelectionListeners(container) {
  let selectedElement = null
  let isDragging = false

  // Add click listeners to all elements
  const elements = container.querySelectorAll("*")
  elements.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation()

      // Deselect previous element
      if (selectedElement) {
        selectedElement.style.outline = ""
      }

      // Select new element
      selectedElement = e.target
      selectedElement.style.outline = "2px solid #0070f3"

      // Show toast with element info
      showToast(
        "Elemento seleccionado",
        `${selectedElement.tagName.toLowerCase()}${selectedElement.id ? `#${selectedElement.id}` : ""}${selectedElement.className ? `.${selectedElement.className}` : ""}`,
      )
    })
  })

  // Add drag functionality
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

function updateCodeDisplay(codeType) {
  const codeDisplay = document.getElementById("code-display")
  if (!codeDisplay) return

  let code = ""

  switch (codeType) {
    case "html":
      code = getHTMLCode()
      break
    case "css":
      code = getCSSCode()
      break
    case "js":
      code = getJSCode()
      break
  }

  codeDisplay.textContent = code
}

function updateFullViewCodeDisplay() {
  const codeDisplay = document.getElementById("fullview-code-display")
  if (!codeDisplay) return

  codeDisplay.textContent = getHTMLCode()
}

function getHTMLCode() {
  return `<!DOCTYPE html>
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
}

function getCSSCode() {
  return `/* Estilos Globales */
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
  font-size: 28px;
  background: linear-gradient(to right, #0070f3, #00a2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  color: #0051aa;
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
  background-color: #0051aa;
  transform: translateY(-2px);
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
  background-color: rgba(0, 112, 243, 0.1);
}

/* Servicios */
.services {
  margin-bottom: 40px;
}

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

.footer-links a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  nav ul {
    margin-top: 15px;
    flex-wrap: wrap;
  }
  
  .service-cards {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
  }
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0f172a;
    color: #f8fafc;
  }
  
  header, footer {
    background-color: #1e293b;
  }
  
  .hero {
    background-color: #1e293b;
    border-color: #334155;
  }
  
  .service-card {
    background-color: #1e293b;
  }
  
  .service-card h3, .hero h2, .services h2 {
    color: #f8fafc;
  }
  
  .service-card p, .hero p {
    color: #94a3b8;
  }
}`
}

function getJSCode() {
  return `// Archivo JavaScript principal
document.addEventListener('DOMContentLoaded', function() {
  // Obtener botones
  const primaryButton = document.querySelector('.btn-primary');
  const secondaryButton = document.querySelector('.btn-secondary');
  
  // Añadir eventos a los botones
  if (primaryButton) {
    primaryButton.addEventListener('click', function() {
      alert('¡Gracias por comenzar! Esta es una demostración de la funcionalidad interactiva.');
    });
  }
  
  if (secondaryButton) {
    secondaryButton.addEventListener('click', function() {
      const infoSection = document.createElement('section');
      infoSection.className = 'info-section';
      infoSection.innerHTML = \`
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <h3>Más información</h3>
          <p>Este es un ejemplo de contenido dinámico añadido mediante JavaScript.</p>
          <button id="close-info" style="background-color: #0070f3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Cerrar</button>
        </div>
      \`;
      
      // Insertar después de la sección hero
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        heroSection.parentNode.insertBefore(infoSection, heroSection.nextSibling);
        
        // Añadir evento al botón cerrar
        document.getElementById('close-info').addEventListener('click', function() {
          infoSection.remove();
        });
      }
    });
  }
  
  // Añadir efectos hover a las tarjetas de servicios
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
  
  // Función para validar formularios
  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
      
      // Validar email
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          input.classList.add('error');
        }
      }
    });
    
    return isValid;
  }
  
  // Buscar formularios y añadir validación
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
        alert('Por favor, completa correctamente todos los campos requeridos.');
      }
    });
  });
  
  // Detectar preferencia de tema oscuro
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  if (prefersDarkScheme.matches) {
    document.body.classList.add('dark');
  }
  
  // Botón para cambiar entre modo claro y oscuro
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }
});`
}

