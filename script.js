form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = q.value.trim();
  if (!text) return;
  add("Du: " + text, "me");
  q.value = "";

  const ph = add("AI skriver…", "ai");
  ph.classList.add("typing");

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await r.json();
    ph.textContent = data.reply || "Inget svar";
    ph.classList.remove("typing");
  } catch (err) {
    ph.textContent = "Fel: " + err.message;
    ph.classList.remove("typing");
  }
});
