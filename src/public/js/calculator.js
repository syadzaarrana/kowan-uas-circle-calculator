// Check if user is logged in
document.addEventListener("DOMContentLoaded", async () => {
  // Get username from session (stored in localStorage as fallback)
  const username = localStorage.getItem("username")
  if (!username) {
    window.location.href = "/"
    return
  }
  document.getElementById("username").textContent = username
  loadHistory()
})

// Logout functionality
document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/passkey/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (response.ok) {
      localStorage.removeItem("username")
      window.location.href = "/"
    }
  } catch (error) {
    console.error("Logout error:", error)
    localStorage.removeItem("username")
    window.location.href = "/"
  }
})

// Calculate circle area
function calculateArea() {
  const radius = Number.parseFloat(document.getElementById("radiusArea").value)
  const resultDiv = document.getElementById("areaResult")

  if (isNaN(radius) || radius < 0) {
    resultDiv.innerHTML = '<span class="error">Please enter a valid radius</span>'
    return
  }

  const area = Math.PI * radius * radius
  const result = area.toFixed(4)
  resultDiv.innerHTML = `<span class="success">Area: <strong>${result}</strong> square units</span>`

  // Save to history
  saveCalculation("Area", radius, result)
  document.getElementById("radiusArea").value = ""
}

// Calculate circle circumference
function calculateCircumference() {
  const radius = Number.parseFloat(document.getElementById("radiusCircumference").value)
  const resultDiv = document.getElementById("circumferenceResult")

  if (isNaN(radius) || radius < 0) {
    resultDiv.innerHTML = '<span class="error">Please enter a valid radius</span>'
    return
  }

  const circumference = 2 * Math.PI * radius
  const result = circumference.toFixed(4)
  resultDiv.innerHTML = `<span class="success">Circumference: <strong>${result}</strong> units</span>`

  // Save to history
  saveCalculation("Circumference", radius, result)
  document.getElementById("radiusCircumference").value = ""
}

// Save calculation to database
async function saveCalculation(type, input, result) {
  try {
    const response = await fetch("/api/passkey/saveCalculation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calculationType: type,
        inputValue: input,
        result: result,
      }),
    })

    if (response.ok) {
      loadHistory()
    }
  } catch (error) {
    console.error("Error saving calculation:", error)
  }
}

// Load calculation history
async function loadHistory() {
  try {
    const response = await fetch("/api/passkey/history")
    if (!response.ok) throw new Error("Failed to load history")

    const history = await response.json()
    const historyList = document.getElementById("historyList")

    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-message">No calculations yet</p>'
      return
    }

    historyList.innerHTML = history
      .map(
        (item) => `
            <div class="history-item">
                <div class="history-info">
                    <span class="history-type">${item.calculation_type}</span>
                    <span class="history-input">Radius: ${Number.parseFloat(item.input_value).toFixed(2)}</span>
                    <span class="history-result">Result: ${Number.parseFloat(item.result).toFixed(4)}</span>
                    <span class="history-time">${new Date(item.created_at).toLocaleString()}</span>
                </div>
                <button class="delete-btn" onclick="deleteCalculation(${item.id})">Delete</button>
            </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading history:", error)
  }
}

// Delete calculation from history
async function deleteCalculation(id) {
  try {
    const response = await fetch(`/api/passkey/history/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      loadHistory()
    }
  } catch (error) {
    console.error("Error deleting calculation:", error)
  }
}

// Allow Enter key to calculate
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (document.getElementById("radiusArea") === document.activeElement) {
      calculateArea()
    } else if (document.getElementById("radiusCircumference") === document.activeElement) {
      calculateCircumference()
    }
  }
})
