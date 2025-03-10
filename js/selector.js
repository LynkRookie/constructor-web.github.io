// ===== Selector de Tecnologías y Archivos =====
document.addEventListener("DOMContentLoaded", () => {
  initProjectTechnologySelector()
})

// Reemplazar la función initProjectTechnologySelector completa con esta versión mejorada
function initProjectTechnologySelector() {
  const technologySelect = document.getElementById("project-language")
  if (!technologySelect) return

  // Definir los tipos de archivos por tecnología
  const technologyFiles = {
    html: {
      structure: ["index.html", "components.html", "layout.html"],
      design: ["styles.css", "components.css", "variables.css"],
      functionality: ["main.js", "components.js", "utils.js"],
    },
    react: {
      structure: ["App.jsx", "components/Header.jsx", "components/Footer.jsx"],
      design: ["styles/App.css", "styles/index.css", "styles/components.css"],
      functionality: ["src/index.js", "src/hooks/useData.js", "src/context/AppContext.js"],
    },
    php: {
      structure: ["index.php", "templates/header.php", "templates/footer.php"],
      design: ["assets/css/style.css", "assets/css/responsive.css"],
      functionality: ["assets/js/main.js", "includes/functions.php", "includes/database.php"],
    },
    python: {
      structure: ["app.py", "templates/base.html", "templates/index.html"],
      design: ["static/css/style.css", "static/css/components.css"],
      functionality: ["static/js/main.js", "routes.py", "models.py"],
    },
  }

  // Actualizar las secciones cuando cambia la tecnología
  technologySelect.addEventListener("change", function () {
    const selectedTech = this.value
    updateImportSections(selectedTech, technologyFiles)
  })

  // Inicializar con la tecnología seleccionada por defecto
  updateImportSections(technologySelect.value, technologyFiles)

  // Función para actualizar las secciones de importación
  function updateImportSections(technology, techFiles) {
    const files = techFiles[technology]
    if (!files) return

    // Actualizar las descripciones de las secciones
    updateSectionDescription(
      "structure",
      `Archivos de estructura para ${getTechName(technology)}: ${files.structure.join(", ")}`,
    )
    updateSectionDescription("design", `Archivos de diseño para ${getTechName(technology)}: ${files.design.join(", ")}`)
    updateSectionDescription(
      "functionality",
      `Archivos de funcionalidad para ${getTechName(technology)}: ${files.functionality.join(", ")}`,
    )

    // Actualizar los botones de importación
    setupImportButtons(technology, files)

    // Actualizar los iconos de las secciones según la tecnología
    updateSectionIcons(technology)
  }

  // Función para obtener el nombre legible de la tecnología
  function getTechName(tech) {
    const names = {
      html: "HTML/CSS/JS",
      react: "React",
      php: "PHP",
      python: "Python",
    }
    return names[tech] || tech
  }

  // Función para actualizar la descripción de una sección
  function updateSectionDescription(section, description) {
    const descElement = document.getElementById(`${section}-description`)
    if (descElement) {
      descElement.textContent = description
    }
  }

  // Función para actualizar los iconos de las secciones según la tecnología
  function updateSectionIcons(technology) {
    // Definir colores por tecnología
    const techColors = {
      html: {
        structure: "#3b82f6", // Azul
        design: "#a855f7", // Púrpura
        functionality: "#eab308", // Amarillo
      },
      react: {
        structure: "#61dafb", // Azul React
        design: "#764abc", // Púrpura Redux
        functionality: "#61dafb", // Azul React
      },
      php: {
        structure: "#777bb3", // Azul PHP
        design: "#4F5B93", // Púrpura PHP
        functionality: "#777bb3", // Azul PHP
      },
      python: {
        structure: "#306998", // Azul Python
        design: "#FFD43B", // Amarillo Python
        functionality: "#306998", // Azul Python
      },
    }

    // Actualizar colores de los iconos
    const structureIcon = document.querySelector("#structure-section .section-title i")
    const designIcon = document.querySelector("#design-section .section-title i")
    const functionalityIcon = document.querySelector("#functionality-section .section-title i")

    if (structureIcon) structureIcon.style.color = techColors[technology].structure
    if (designIcon) designIcon.style.color = techColors[technology].design
    if (functionalityIcon) functionalityIcon.style.color = techColors[technology].functionality
  }

  // Configurar los botones de importación para cada sección
  function setupImportButtons(technology, files) {
    // Actualizar los botones de importación
    const importButtons = document.querySelectorAll(".import-btn")

    importButtons.forEach((btn) => {
      const section = btn.getAttribute("data-section")

      // Actualizar el texto del botón
      btn.innerHTML = `<i data-lucide="file-input"></i> Importar ${section === "structure" ? "Estructura" : section === "design" ? "Diseño" : "Funcionalidad"}`

      // Eliminar eventos anteriores
      const newBtn = btn.cloneNode(true)
      btn.parentNode.replaceChild(newBtn, btn)

      // Agregar nuevo evento
      newBtn.addEventListener("click", () => {
        // Crear un input de archivo oculto específico para esta sección
        const fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.multiple = true

        // Configurar los tipos de archivo aceptados según la sección
        if (section === "structure") {
          fileInput.accept =
            technology === "react"
              ? ".jsx,.js,.html"
              : technology === "php"
                ? ".php,.html"
                : technology === "python"
                  ? ".py,.html"
                  : ".html"
        } else if (section === "design") {
          fileInput.accept = ".css,.scss,.less"
        } else if (section === "functionality") {
          fileInput.accept = technology === "php" ? ".php,.js" : technology === "python" ? ".py,.js" : ".js"
        }

        // Agregar evento para manejar la selección de archivos
        fileInput.addEventListener("change", (e) => {
          if (e.target.files.length > 0) {
            importSectionFiles(technology, section, files[section], e.target.files)
          }
        })

        // Simular clic en el input de archivo
        fileInput.click()
      })

      // Actualizar iconos
      if (window.lucide) {
        window.lucide.createIcons()
      }
    })
  }

  // Función para importar archivos de una sección
  function importSectionFiles(technology, section, filesList, selectedFiles) {
    const sectionElement = document.getElementById(`${section}-section`)
    const checkElement = document.getElementById(`${section}-check`)
    const importBtn = sectionElement.querySelector(".import-btn")

    if (!sectionElement || !checkElement || !importBtn) return

    // Deshabilitar botón durante la importación
    importBtn.disabled = true
    importBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Importando...'
    if (window.lucide) window.lucide.createIcons()

    // Mostrar los archivos seleccionados
    const fileNames = Array.from(selectedFiles)
      .map((file) => file.name)
      .join(", ")
    updateSectionDescription(section, `Archivos seleccionados: ${fileNames}`)

    // Simular proceso de importación
    setTimeout(() => {
      // Marcar como importado
      sectionElement.classList.add("success")
      checkElement.classList.remove("hidden")
      checkElement.innerHTML = '<i data-lucide="check-circle"></i>'

      // Guardar información de los archivos importados
      saveImportedFiles(technology, section, filesList, selectedFiles)

      // Re-habilitar botón
      importBtn.disabled = false
      importBtn.innerHTML = `<i data-lucide="check"></i> ${section === "structure" ? "Estructura" : section === "design" ? "Diseño" : "Funcionalidad"} Importada`

      // Actualizar iconos
      if (window.lucide) {
        window.lucide.createIcons()
      }

      // Mostrar toast de éxito
      if (window.showToast) {
        window.showToast(
          "Importación exitosa",
          `Se han importado ${selectedFiles.length} archivo(s) de ${section === "structure" ? "estructura" : section === "design" ? "diseño" : "funcionalidad"} para ${getTechName(technology)}.`,
        )
      }

      // Habilitar el botón de importar proyecto si hay al menos una sección importada
      const importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")
      const sections = importedProject.sections || {}
      const importedSections = Object.keys(sections).filter((key) => sections[key].imported)

      const importProjectBtn = document.getElementById("import-project-btn")
      if (importProjectBtn && importedSections.length > 0) {
        importProjectBtn.disabled = false
        importProjectBtn.classList.add("pulse-animation")
      }
    }, 1500)
  }

  // Guardar información de los archivos importados en localStorage
  function saveImportedFiles(technology, section, filesList, selectedFiles) {
    let importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")

    if (!importedProject.technology) {
      importedProject = {
        technology: technology,
        timestamp: new Date().toISOString(),
        sections: {},
      }
    }

    // Guardar información sobre los archivos seleccionados
    const fileNames = Array.from(selectedFiles).map((file) => file.name)

    importedProject.sections[section] = {
      files: filesList,
      selectedFiles: fileNames,
      imported: true,
    }

    localStorage.setItem("importedProject", JSON.stringify(importedProject))

    // Actualizar el botón de importar proyecto
    updateImportProjectButton()
  }

  // Actualizar el estado del botón de importar proyecto
  function updateImportProjectButton() {
    const importProjectBtn = document.getElementById("import-project-btn")
    if (!importProjectBtn) return

    const importedProject = JSON.parse(localStorage.getItem("importedProject") || "{}")
    const sections = importedProject.sections || {}
    const importedSections = Object.keys(sections).filter((key) => sections[key].imported)

    // Habilitar el botón si hay al menos una sección importada
    importProjectBtn.disabled = importedSections.length === 0

    // Actualizar el texto del botón
    if (importedSections.length > 0) {
      importProjectBtn.textContent = `Importar Proyecto (${importedSections.length}/3)`
      importProjectBtn.classList.add("pulse-animation")
    } else {
      importProjectBtn.textContent = "Importar Proyecto"
      importProjectBtn.classList.remove("pulse-animation")
    }
  }
}

