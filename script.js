const chat = document.getElementById("chat");
const form = document.getElementById("f");
const q = document.getElementById("q");
const clear = document.getElementById("clear");
const voice = document.getElementById("voice");
const save = document.getElementById("save");
const upload = document.getElementById("upload");
const fileInput = document.getElementById("fileInput");

function add(msg, who) {
  const p = document.createElement("div");
  p.className = "bubble " + who;
  p.textContent = msg;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
  return p;
}

// 📝 Skicka text till AI
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
    if (!r.body) throw new Error("Ingen stream");
    const reader = r.body.getReader();
    let decoder = new TextDecoder(),
      ai = "";
    ph.textContent = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      ai += decoder.decode(value, { stream: true });
      ph.textContent = ai;
    }
    ph.classList.remove("typing");
    speak(ai); // 🔊 AI pratar tillbaka
  } catch (err) {
    ph.textContent = "Fel: " + err.message;
  }
});

// 🧹 Rensa chatten
clear.addEventListener("click", () => (chat.innerHTML = ""));

// 🎤 Röstinmatning
voice.addEventListener("click", () => {
  const rec = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  rec.lang = "sv-SE";
  rec.onresult = (e) => {
    q.value = e.results[0][0].transcript;
    form.requestSubmit();
  };
  rec.start();
});

// 🔊 TTS (Text-to-Speech)
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "sv-SE";
  speechSynthesis.speak(u);
}

// 💾 Exportera chatt
save.addEventListener("click", () => {
  let text = "";
  chat.querySelectorAll(".bubble").forEach((p) => {
    text += p.textContent + "\n";
  });
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "chat.txt";
  a.click();
});

// 🖼️ Bilduppladdning
upload.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;
  add("🖼️ Bild skickad: " + file.name, "me");
  const formData = new FormData();
  formData.append("image", file);
  const r = await fetch("/api/vision", { method: "POST", body: formData });
  const data = await r.json();
  add("AI (bildanalys): " + data.reply, "ai");
});
