// ===== Funcionalidad de Pestañas de Importación =====
document.addEventListener("DOMContentLoaded", () => {
  initImportTabs()
})

function initImportTabs() {
  // Inicializar la funcionalidad de las pestañas de importación
  setupFileImport()
  setupUrlImport()
  setupCodeImport()
  setupImageImport()

  // Configurar los botones de las pestañas secundarias
  setupTabButtons()
}

// Configurar los botones de las pestañas secundarias
function setupTabButtons() {
  const tabButtons = document.querySelectorAll(".tab-trigger-secondary")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Desactivar todas las pestañas y contenidos
      document.querySelectorAll(".tab-trigger-secondary").forEach((btn) => {
        btn.classList.remove("active")
      })

      document.querySelectorAll(".tab-content-secondary").forEach((content) => {
        content.classList.remove("active")
      })

      // Activar la pestaña seleccionada
      this.classList.add("active")
      document.getElementById(`${tabName}-tab`).classList.add("active")
    })
  })
}

// Reemplazar la función setupFileImport completa con esta versión mejorada
function setupFileImport() {
  const fileTab = document.getElementById("file-tab")
  const exploreBtn = fileTab?.querySelector("button")

  if (!fileTab) return

  // Crear un input de archivo oculto
  const fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.multiple = true
  fileInput.accept = ".html,.css,.js,.jsx,.php,.py,.json"
  fileInput.style.display = "none"
  fileTab.appendChild(fileInput)

  // Configurar el botón de explorar archivos
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      fileInput.click()
    })
  }

  // Manejar la selección de archivos
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files)

      // Mostrar mensaje de éxito
      const dropzoneText = fileTab.querySelector(".dropzone-text-large")
      if (dropzoneText) {
        dropzoneText.textContent = `${e.target.files.length} archivo(s) seleccionado(s)`
        dropzoneText.style.color = "var(--primary)"
      }

      // Cambiar el texto del botón
      if (exploreBtn) {
        exploreBtn.textContent = "Cambiar archivos"
      }
    }
  })

  // Configurar eventos de arrastrar y soltar
  const dropzone = fileTab.querySelector(".dropzone")
  if (dropzone) {
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, preventDefaults, false)
    })
    ;["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, highlight, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, unhighlight, false)
    })

    dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer
      const files = dt.files

      if (files.length > 0) {
        handleFileSelection(files)

        // Mostrar mensaje de éxito
        const dropzoneText = fileTab.querySelector(".dropzone-text-large")
        if (dropzoneText) {
          dropzoneText.textContent = `${files.length} archivo(s) seleccionado(s)`
          dropzoneText.style.color = "var(--primary)"
        }
      }
    })
  }

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function highlight() {
    this.classList.add("highlight")
  }

  function unhighlight() {
    this.classList.remove("highlight")
  }
}

// Actualizar la función setupUrlImport para mejorar la retroalimentación visual
function setupUrlImport() {
  const urlTab = document.getElementById("url-tab")
  const urlInput = urlTab?.querySelector("input")
  const importUrlBtn = document.getElementById("import-url-btn")

  if (!urlTab || !urlInput || !importUrlBtn) return

  // Añadir evento de entrada para habilitar/deshabilitar el botón
  urlInput.addEventListener("input", () => {
    importUrlBtn.disabled = urlInput.value.trim() === ""
  })

  // Inicializar estado del botón
  importUrlBtn.disabled = true

  importUrlBtn.addEventListener("click", () => {
    const url = urlInput.value.trim()

    if (!url) {
      if (window.showToast) {
        window.showToast("Error", "Por favor, introduce una URL válida.")
      }
      return
    }

    // Validar URL
    try {
      new URL(url)
    } catch (e) {
      if (window.showToast) {
        window.showToast("Error", "La URL introducida no es válida.")
      }
      return
    }

    // Deshabilitar botón durante la importación
    importUrlBtn.disabled = true
    importUrlBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Importando...'
    if (window.lucide) window.lucide.createIcons()

    // Simular proceso de importación
    setTimeout(() => {
      // Determinar tecnología basada en la URL
      let technology = "html"
      if (url.includes("react") || url.includes("jsx")) {
        technology = "react"
      } else if (url.includes("php")) {
        technology = "php"
      } else if (url.includes("python") || url.includes("flask") || url.includes("django")) {
        technology = "python"
      }

      // Actualizar el selector de tecnología
      const techSelect = document.getElementById("project-language")
      if (techSelect) {
        techSelect.value = technology
        // Disparar el evento change para actualizar las secciones
        const event = new Event("change")
        techSelect.dispatchEvent(event)
      }

      // Marcar todas las secciones como importadas
      simulateImportClick("structure")
      simulateImportClick("design")
      simulateImportClick("functionality")

      // Guardar la URL en localStorage
      saveImportedUrl(url, technology)

      // Re-habilitar botón
      importUrlBtn.disabled = false
      importUrlBtn.innerHTML = '<i data-lucide="download"></i> Importar desde URL'
      if (window.lucide) window.lucide.createIcons()

      // Mostrar toast de éxito
      if (window.showToast) {
        window.showToast("URL importada", `Se ha importado correctamente el sitio web desde ${url}`)
      }

      // Habilitar el botón de importar proyecto
      const importProjectBtn = document.getElementById("import-project-btn")
      if (importProjectBtn) {
        importProjectBtn.disabled = false
        importProjectBtn.classList.add("pulse-animation")
      }
    }, 1500)
  })
}

// Actualizar la función setupCodeImport para mejorar la retroalimentación visual
function setupCodeImport() {
  const codeTab = document.getElementById("code-tab")
  const codeTextarea = codeTab?.querySelector("textarea")
  const importCodeBtn = document.getElementById("import-code-btn")

  if (!codeTab || !codeTextarea || !importCodeBtn) return

  // Añadir evento de entrada para habilitar/deshabilitar el botón
  codeTextarea.addEventListener("input", () => {
    importCodeBtn.disabled = codeTextarea.value.trim() === ""
  })

  // Inicializar estado del botón
  importCodeBtn.disabled = true

  importCodeBtn.addEventListener("click", () => {
    const code = codeTextarea.value.trim()

    if (!code) {
      if (window.showToast) {
        window.showToast("Error", "Por favor, introduce algún código para importar.")
      }
      return
    }

    // Deshabilitar botón durante la importación
    importCodeBtn.disabled = true
    importCodeBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Importando...'
    if (window.lucide) window.lucide.createIcons()

    // Simular proceso de importación
    setTimeout(() => {
      // Determinar tecnología basada en el código
      let technology = "html"
      if (code.includes("import React") || code.includes('from "react"') || code.includes("from 'react'")) {
        technology = "react"
      } else if (code.includes("<?php")) {
        technology = "php"
      } else if (code.includes("import flask") || code.includes("from flask import") || code.includes("def __init__")) {
        technology = "python"
      }

      // Actualizar el selector de tecnología
      const techSelect = document.getElementById("project-language")
      if (techSelect) {
        techSelect.value = technology
        // Disparar el evento change para actualizar las secciones
        const event = new Event("change")
        techSelect.dispatchEvent(event)
      }

      // Determinar qué secciones importar basado en el contenido del código
      let importedSections = 0

      if (
        code.includes("<html>") ||
        code.includes("<div>") ||
        code.includes("<body>") ||
        code.includes("class=") ||
        code.includes("className=")
      ) {
        simulateImportClick("structure")
        importedSections++
      }

      if (
        code.includes("style=") ||
        code.includes("css") ||
        code.includes("background") ||
        code.includes("color:") ||
        code.includes("margin") ||
        code.includes("padding")
      ) {
        simulateImportClick("design")
        importedSections++
      }

      if (
        code.includes("function") ||
        code.includes("=>") ||
        code.includes("addEventListener") ||
        code.includes("onClick") ||
        code.includes("def ") ||
        code.includes("class ")
      ) {
        simulateImportClick("functionality")
        importedSections++
      }

      // Guardar el código en localStorage
      saveImportedCode(code, technology)

      // Re-habilitar botón
      importCodeBtn.disabled = false
      importCodeBtn.innerHTML = '<i data-lucide="code"></i> Importar Código'
      if (window.lucide) window.lucide.createIcons()

      // Mostrar toast de éxito
      if (window.showToast) {
        window.showToast("Código importado", `Se ha importado correctamente el código (${code.length} caracteres)`)
      }

      // Habilitar el botón de importar proyecto
      const importProjectBtn = document.getElementById("import-project-btn")
      if (importProjectBtn) {
        importProjectBtn.disabled = false
        importProjectBtn.textContent = `Importar Proyecto (${importedSections}/${importedSections})`
        importProjectBtn.classList.add("pulse-animation")
      }

      // Cambiar a la pestaña de Vista Completa después de un breve retraso
      setTimeout(() => {
        const fullViewTab = document.querySelector('[data-tab="fullview"]')
        if (fullViewTab) {
          fullViewTab.click()
        }
      }, 1000)
    }, 1500)
  })
}

// Actualizar la función setupImageImport para mejorar la retroalimentación visual
function setupImageImport() {
  const imageTab = document.getElementById("image-tab")
  const imageDropzone = imageTab?.querySelector(".dropzone")
  const uploadBtn = imageDropzone?.querySelector("button")

  if (!imageTab || !imageDropzone || !uploadBtn) return

  // Crear un input de archivo oculto
  const fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.accept = "image/*"
  fileInput.style.display = "none"
  imageDropzone.appendChild(fileInput)

  // Configurar el botón de subir imagen
  uploadBtn.addEventListener("click", () => {
    fileInput.click()
  })

  // Manejar la selección de imágenes
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleImageSelection(e.target.files)
    }
  })

  // Configurar eventos de arrastrar y soltar
  ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    imageDropzone.addEventListener(eventName, preventDefaults, false)
  })

  // Resaltar la zona de soltar cuando se arrastra una imagen
  ;["dragenter", "dragover"].forEach((eventName) => {
    imageDropzone.addEventListener(eventName, highlight, false)
  })
  ;["dragleave", "drop"].forEach((eventName) => {
    imageDropzone.addEventListener(eventName, unhighlight, false)
  })

  // Manejar imágenes soltadas
  imageDropzone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer
    const files = dt.files
    if (files.length > 0) {
      handleImageSelection(files)
    }
  })

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function highlight() {
    imageDropzone.classList.add("highlight")
  }

  function unhighlight() {
    imageDropzone.classList.remove("highlight")
  }
}

// Procesar las imágenes seleccionadas
function handleImageSelection(files) {
  if (files.length === 0) return

  const file = files[0] // Tomar solo la primera imagen
  const imageTab = document.getElementById("image-tab")
  const imageDropzone = imageTab?.querySelector(".dropzone")
  const uploadBtn = imageDropzone?.querySelector("button")

  // Verificar que sea una imagen
  if (!file.type.startsWith("image/")) {
    if (window.showToast) {
      window.showToast("Error", "El archivo seleccionado no es una imagen válida.")
    }
    return
  }

  // Mostrar toast con información
  if (window.showToast) {
    window.showToast("Imagen seleccionada", `Se ha seleccionado la imagen: ${file.name} (${formatFileSize(file.size)})`)
  }

  // Crear una vista previa de la imagen
  const reader = new FileReader()
  reader.onload = (e) => {
    // Crear una imagen temporal para mostrar la vista previa
    const img = document.createElement("img")
    img.src = e.target.result
    img.style.maxWidth = "100%"
    img.style.maxHeight = "200px"
    img.style.margin = "10px 0"
    img.style.borderRadius = "8px"

    // Limpiar vista previa anterior
    const prevPreview = imageDropzone.querySelector(".image-preview")
    if (prevPreview) {
      prevPreview.remove()
    }

    // Crear contenedor para la vista previa
    const previewContainer = document.createElement("div")
    previewContainer.className = "image-preview"
    previewContainer.appendChild(img)

    // Agregar texto de procesamiento
    const processingText = document.createElement("p")
    processingText.textContent = "Procesando imagen para generar código..."
    processingText.style.marginTop = "10px"
    processingText.style.fontSize = "14px"
    processingText.style.color = "var(--muted-foreground)"
    previewContainer.appendChild(processingText)

    // Insertar antes del botón
    imageDropzone.insertBefore(previewContainer, uploadBtn.parentNode)

    // Simular procesamiento de la imagen
    setTimeout(() => {
      // Actualizar texto de procesamiento
      processingText.textContent = "Código generado correctamente a partir de la imagen"

      // Marcar todas las secciones como importadas
      simulateImportClick("structure")
      simulateImportClick("design")
      simulateImportClick("functionality")

      // Guardar la imagen en localStorage (solo la referencia)
      saveImportedImage(file.name, e.target.result)

      // Mostrar toast de éxito
      if (window.showToast) {
        window.showToast("Imagen procesada", "Se ha generado código HTML, CSS y JavaScript a partir de la imagen.")
      }

      // Cambiar a la pestaña de Vista Completa después de un breve retraso
      setTimeout(() => {
        const fullViewTab = document.querySelector('[data-tab="fullview"]')
        if (fullViewTab) {
          fullViewTab.click()
        }
      }, 1000)
    }, 2000)
  }

  reader.readAsDataURL(file)
}

// Simular clic en el botón de importar sección
function simulateImportClick(section) {
  const importBtn = document.querySelector(`#${section}-section .import-btn`)
  if (importBtn && !importBtn.disabled) {
    importBtn.click()
  }
}

// Guardar imagen importada en localStorage
function saveImportedImage(filename, dataUrl) {
  let importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")

  importedProject = {
    technology: "html", // Por defecto, generamos HTML/CSS/JS desde imágenes
    timestamp: new Date().toISOString(),
    image: {
      name: filename,
      preview: dataUrl.substring(0, 100) + "...", // Guardar solo una parte de la URL para no sobrecargar localStorage
    },
    sections: {
      structure: { imported: true },
      design: { imported: true },
      functionality: { imported: true },
    },
  }

  localStorage.setItem("importedProject", JSON.stringify(importedProject))

  // Actualizar el botón de importar proyecto
  updateImportProjectButton()
}

// Reemplazar la función updateImportProjectButton con esta versión mejorada
function updateImportProjectButton() {
  const importProjectBtn = document.getElementById("import-project-btn")
  if (!importProjectBtn) return

  const importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")
  const sections = importedProject.sections || {}
  const importedSections = Object.keys(sections).filter((key) => sections[key].imported)
  const totalFiles = importedSections.reduce((total, section) => total + (sections[section].files?.length || 0), 0)

  importProjectBtn.disabled = totalFiles === 0
  importProjectBtn.textContent = `Importar Proyecto (${totalFiles} archivo${totalFiles !== 1 ? "s" : ""})`

  if (totalFiles > 0) {
    importProjectBtn.classList.add("pulse-animation")
  } else {
    importProjectBtn.classList.remove("pulse-animation")
  }
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Manejar la selección de archivos
function handleFileSelection(files) {
  if (files.length === 0) return

  // Determinar tecnología basada en los archivos
  let technology = "html"

  // Verificar si hay archivos de React
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i].name.toLowerCase()
    if (fileName.endsWith(".jsx") || fileName.includes("react")) {
      technology = "react"
      break
    } else if (fileName.endsWith(".php")) {
      technology = "php"
      break
    } else if (fileName.endsWith(".py") || fileName.includes("flask") || fileName.includes("django")) {
      technology = "python"
      break
    }
  }

  // Actualizar el selector de tecnología
  const techSelect = document.getElementById("project-language")
  if (techSelect) {
    techSelect.value = technology
    // Disparar el evento change para actualizar las secciones
    const event = new Event("change")
    techSelect.dispatchEvent(event)
  }

  // Clasificar archivos por tipo
  const structureFiles = []
  const designFiles = []
  const functionalityFiles = []

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i].name.toLowerCase()

    if (
      fileName.endsWith(".html") ||
      fileName.endsWith(".jsx") ||
      fileName.endsWith(".php") ||
      fileName.endsWith(".py")
    ) {
      structureFiles.push(files[i])
    } else if (fileName.endsWith(".css") || fileName.endsWith(".scss") || fileName.endsWith(".less")) {
      designFiles.push(files[i])
    } else if (fileName.endsWith(".js") || fileName.endsWith(".ts")) {
      functionalityFiles.push(files[i])
    }
  }

  // Contar cuántas secciones se importaron
  let importedSections = 0

  // Importar archivos por sección si hay archivos disponibles
  if (structureFiles.length > 0) {
    importSectionFiles("structure", structureFiles)
    importedSections++
  }

  if (designFiles.length > 0) {
    importSectionFiles("design", designFiles)
    importedSections++
  }

  if (functionalityFiles.length > 0) {
    importSectionFiles("functionality", functionalityFiles)
    importedSections++
  }

  // Actualizar el botón de importar proyecto con el número correcto de secciones
  const importProjectBtn = document.getElementById("import-project-btn")
  if (importProjectBtn) {
    importProjectBtn.disabled = importedSections === 0
    importProjectBtn.textContent = `Importar Proyecto (${importedSections}/${importedSections})`

    if (importedSections > 0) {
      importProjectBtn.classList.add("pulse-animation")
    } else {
      importProjectBtn.classList.remove("pulse-animation")
    }
  }

  // Actualizar el botón de importar proyecto con el número correcto de archivos
  updateImportProjectButton()

  // Mostrar toast de éxito
  if (window.showToast) {
    window.showToast("Archivos importados", `Se han importado ${files.length} archivo(s) correctamente.`)
  }

  // Cambiar a la pestaña de Vista Completa después de un breve retraso
  setTimeout(() => {
    const fullViewTab = document.querySelector('[data-tab="fullview"]')
    if (fullViewTab) {
      fullViewTab.click()
    }
  }, 1500)
}

// Importar archivos para una sección específica
function importSectionFiles(section, files) {
  // Simular clic en el botón de importar sección correspondiente
  simulateImportClick(section)

  // Guardar información sobre los archivos importados
  const importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")

  if (!importedProject.sections) {
    importedProject.sections = {}
  }

  importedProject.sections[section] = {
    files: Array.from(files).map((file) => file.name),
    imported: true,
  }

  localStorage.setItem("importedProject", JSON.stringify(importedProject))
}

// Guardar URL importada en localStorage
function saveImportedUrl(url, technology) {
  let importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")

  importedProject = {
    technology: technology,
    timestamp: new Date().toISOString(),
    url: url,
    sections: {
      structure: { imported: true },
      design: { imported: true },
      functionality: { imported: true },
    },
  }

  localStorage.setItem("importedProject", JSON.stringify(importedProject))
}

// Guardar código importado en localStorage
function saveImportedCode(code, technology) {
  let importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")

  importedProject = {
    technology: technology,
    timestamp: new Date().toISOString(),
    code: code.substring(0, 500) + "...", // Guardar solo una parte del código para no sobrecargar localStorage
    sections: {},
  }

  // Determinar qué secciones se importaron
  if (
    code.includes("<html>") ||
    code.includes("<div>") ||
    code.includes("<body>") ||
    code.includes("class=") ||
    code.includes("className=")
  ) {
    importedProject.sections.structure = { imported: true }
  }

  if (
    code.includes("style=") ||
    code.includes("css") ||
    code.includes("background") ||
    code.includes("color:") ||
    code.includes("margin") ||
    code.includes("padding")
  ) {
    importedProject.sections.design = { imported: true }
  }

  if (
    code.includes("function") ||
    code.includes("=>") ||
    code.includes("addEventListener") ||
    code.includes("onClick") ||
    code.includes("def ") ||
    code.includes("class ")
  ) {
    importedProject.sections.functionality = { imported: true }
  }

  localStorage.setItem("importedProject", JSON.stringify(importedProject))
}

