// ===== Element Selection and Drag Functionality =====
let selectedElement = null
let isDragging = false
let startX, startY, startLeft, startTop

// Function to make elements selectable and draggable
function makeElementsDraggable(container) {
  // Get all elements inside the container
  const elements = container.querySelectorAll("*")

  elements.forEach((element) => {
    // Skip body and container elements
    if (element === document.body || element === container) return

    // Make element selectable
    element.addEventListener("click", function (e) {
      e.stopPropagation()

      // Deselect previous element
      if (selectedElement) {
        selectedElement.style.outline = ""
      }

      // Select this element
      selectedElement = this
      selectedElement.style.outline = "2px solid #0070f3"

      // Update properties panel
      updatePropertiesPanel(selectedElement)

      // Show toast with element info
      const tagName = selectedElement.tagName.toLowerCase()
      const id = selectedElement.id ? `#${selectedElement.id}` : ""
      const className = selectedElement.className ? `.${selectedElement.className.replace(/\s+/g, ".")}` : ""
      showToast("Elemento seleccionado", `${tagName}${id}${className}`)
    })

    // Make element draggable
    element.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return // Only left button
      if (this !== selectedElement) return // Only drag selected element

      isDragging = true

      // Get initial position
      startX = e.clientX
      startY = e.clientY

      // Set position to relative if it's not already
      const computedStyle = window.getComputedStyle(this)
      if (computedStyle.position !== "absolute" && computedStyle.position !== "relative") {
        this.style.position = "relative"
      }

      startLeft = Number.parseInt(computedStyle.left) || 0
      startTop = Number.parseInt(computedStyle.top) || 0

      e.preventDefault()
      e.stopPropagation()
    })
  })

  // Add mousemove event to window to handle dragging
  window.addEventListener("mousemove", (e) => {
    if (!isDragging || !selectedElement) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    selectedElement.style.left = startLeft + deltaX + "px"
    selectedElement.style.top = startTop + deltaY + "px"
  })

  // Add mouseup event to window to stop dragging
  window.addEventListener("mouseup", () => {
    isDragging = false
  })

  // Deselect on container click
  container.addEventListener("click", (e) => {
    if (e.target === container) {
      if (selectedElement) {
        selectedElement.style.outline = ""
        selectedElement = null
      }
    }
  })
}

// ===== Properties Panel Update =====
function updatePropertiesPanel(element) {
  // Get form inputs
  const elementTypeSelect = document.getElementById("element-type")
  const elementIdInput = document.getElementById("element-id")
  const elementClassInput = document.getElementById("element-class")
  const elementContentInput = document.getElementById("element-content")
  const widthInput = document.getElementById("width")
  const heightInput = document.getElementById("height")
  const bgColorPreview = document.getElementById("bg-color-preview")
  const bgColorInput = document.getElementById("bg-color-input")
  const textColorPreview = document.getElementById("text-color-preview")
  const textColorInput = document.getElementById("text-color-input")
  const borderRadiusRange = document.querySelector(".range")

  if (!element) return

  // Get computed style
  const style = window.getComputedStyle(element)

  // Set element type
  if (elementTypeSelect) {
    elementTypeSelect.value = element.tagName.toLowerCase()
  }

  // Set ID and class
  if (elementIdInput) {
    elementIdInput.value = element.id || ""
  }

  if (elementClassInput) {
    elementClassInput.value = element.className || ""
  }

  // Set content (if applicable)
  if (elementContentInput) {
    // Check if element has text content
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      elementContentInput.value = element.textContent || ""
    } else {
      elementContentInput.value = ""
    }
  }

  // Set dimension values
  if (widthInput) {
    widthInput.value = style.width
  }

  if (heightInput) {
    heightInput.value = style.height
  }

  // Set color values
  if (bgColorPreview && bgColorInput) {
    const bgColor = style.backgroundColor
    bgColorPreview.style.backgroundColor = bgColor
    bgColorInput.value = rgbToHex(bgColor)
  }

  if (textColorPreview && textColorInput) {
    const textColor = style.color
    textColorPreview.style.backgroundColor = textColor
    textColorInput.value = rgbToHex(textColor)
  }

  // Set border radius
  if (borderRadiusRange) {
    const borderRadius = Number.parseInt(style.borderRadius) || 0
    borderRadiusRange.value = borderRadius
  }

  // Add event listeners to update element properties
  setupPropertyUpdateListeners(element)
}

// Setup listeners for property updates
function setupPropertyUpdateListeners(element) {
  // Element type
  const elementTypeSelect = document.getElementById("element-type")
  if (elementTypeSelect) {
    elementTypeSelect.onchange = () => {
      // Cannot change element type directly, show toast
      showToast("Información", "El cambio de tipo de elemento requiere recrear el elemento.")
    }
  }

  // Element ID
  const elementIdInput = document.getElementById("element-id")
  if (elementIdInput) {
    elementIdInput.oninput = function () {
      element.id = this.value
    }
  }

  // Element class
  const elementClassInput = document.getElementById("element-class")
  if (elementClassInput) {
    elementClassInput.oninput = function () {
      element.className = this.value
    }
  }

  // Element content
  const elementContentInput = document.getElementById("element-content")
  if (elementContentInput) {
    elementContentInput.oninput = function () {
      // Only update if element has text content
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
        element.textContent = this.value
      } else {
        showToast("Información", "Este elemento tiene elementos anidados. No se puede cambiar el texto directamente.")
      }
    }
  }

  // Width
  const widthInput = document.getElementById("width")
  if (widthInput) {
    widthInput.oninput = function () {
      element.style.width = this.value
    }
  }

  // Height
  const heightInput = document.getElementById("height")
  if (heightInput) {
    heightInput.oninput = function () {
      element.style.height = this.value
    }
  }

  // Background color
  const bgColorInput = document.getElementById("bg-color-input")
  if (bgColorInput) {
    bgColorInput.oninput = function () {
      element.style.backgroundColor = this.value
      const bgColorPreview = document.getElementById("bg-color-preview")
      if (bgColorPreview) {
        bgColorPreview.style.backgroundColor = this.value
      }
    }
  }

  // Text color
  const textColorInput = document.getElementById("text-color-input")
  if (textColorInput) {
    textColorInput.oninput = function () {
      element.style.color = this.value
      const textColorPreview = document.getElementById("text-color-preview")
      if (textColorPreview) {
        textColorPreview.style.backgroundColor = this.value
      }
    }
  }

  // Border radius
  const borderRadiusRange = document.querySelector(".range")
  if (borderRadiusRange) {
    borderRadiusRange.oninput = function () {
      element.style.borderRadius = this.value + "px"
    }
  }

  // Event handlers
  const onclickInput = document.getElementById("onclick")
  if (onclickInput) {
    onclickInput.oninput = function () {
      const code = this.value
      element.onclick = code ? new Function(code) : null
    }
  }

  const onhoverInput = document.getElementById("onhover")
  if (onhoverInput) {
    onhoverInput.oninput = function () {
      const code = this.value
      element.onmouseover = code ? new Function(code) : null
    }
  }

  const onchangeInput = document.getElementById("onchange")
  if (onchangeInput) {
    onchangeInput.oninput = function () {
      if (element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA") {
        const code = this.value
        element.onchange = code ? new Function(code) : null
      } else {
        showToast("Error", "El evento onChange solo es aplicable a elementos de formulario.")
      }
    }
  }
}

// ===== Helper Functions =====

// Convert RGB to HEX
function rgbToHex(rgb) {
  // Default to black if empty
  if (!rgb || rgb === "rgba(0, 0, 0, 0)" || rgb === "transparent") {
    return "#000000"
  }

  // Check if it's already a hex color
  if (rgb.charAt(0) === "#") {
    return rgb
  }

  // Parse RGB values
  const rgbMatch = rgb.match(/rgba?$$(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?$$/i)
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1])
    const g = Number.parseInt(rgbMatch[2])
    const b = Number.parseInt(rgbMatch[3])
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Return default if parsing fails
  return "#000000"
}

// Initialize draggable elements for preview containers
document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.getElementById("preview-container")
  if (previewContainer) {
    makeElementsDraggable(previewContainer)
  }

  const fullviewPreviewContainer = document.getElementById("fullview-preview-container")
  if (fullviewPreviewContainer) {
    makeElementsDraggable(fullviewPreviewContainer)
  }
})

// Toast function for showing notifications
function showToast(title, message, duration = 3000) {
  const toastContainer = document.getElementById("toast-container")
  const toast = document.getElementById("toast")
  const toastTitle = document.getElementById("toast-title")
  const toastDescription = document.getElementById("toast-description")

  if (!toastContainer || !toast || !toastTitle || !toastDescription) {
    console.log(`Toast: ${title} - ${message}`)
    return
  }

  // Set toast content
  toastTitle.textContent = title
  toastDescription.textContent = message

  // Show toast
  toastContainer.classList.remove("hidden")

  // Hide toast after duration
  setTimeout(() => {
    toastContainer.classList.add("hidden")
  }, duration)
}

