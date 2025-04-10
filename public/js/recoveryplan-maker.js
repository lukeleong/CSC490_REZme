function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload.UserId || payload.user_id;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

async function loadInjuryDetails(injuryId) {
  try {
    const res = await fetch(`/api/injuries/${injuryId}`);
    const injury = await res.json();
    document.getElementById("InjuryId").value = injuryId;
    document.getElementById("injuryInfo").innerText = `Injury: ${injury.InjuryType} (${injury.InjuryLocation})`;
  } catch (err) {
    console.error("Error loading injury:", err);
    document.getElementById("injuryInfo").innerText = "Failed to load injury.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const injuryId = urlParams.get("injury_id");
  const userId = getUserIdFromToken();

  if (!injuryId || !userId) {
    document.getElementById("injuryInfo").innerText = "Missing required data.";
    return;
  }

  document.getElementById("UserId").value = userId;
  loadInjuryDetails(injuryId);
});

document.getElementById("planMakerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const checkedEquipment = Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(el => el.value);
  checkedEquipment.push("body weight"); // Always include body weight

  const data = {
    user_id: formData.get("UserId"),
    injury_id: formData.get("injury_id"),
    difficulty: parseInt(formData.get("difficulty")),
    equipment: checkedEquipment
  };

  const messageEl = document.getElementById("message");
  messageEl.style.display = "block";
  messageEl.textContent = "Submitting your recovery plan...";
  messageEl.className = "feedback";

  try {
    const res = await fetch("/api/recovery-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok && result.recoveryPlan?.PlanId) {
      messageEl.textContent = "Recovery plan created successfully!";
      messageEl.classList.add("success");
      // Optionally redirect after a short delay:
      setTimeout(() => {
        window.location.href = `/recovery-plan.html?planId=${result.recoveryPlan.PlanId}`;
      }, 1500);
    } else {
      messageEl.textContent = result.error || "Failed to create plan.";
      messageEl.classList.add("error");
    }
  } catch (err) {
    console.error("Error creating plan:", err);
    messageEl.textContent = "Something went wrong.";
    messageEl.classList.add("error");
  }
});
