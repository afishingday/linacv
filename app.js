// Diccionario de textos
const TEXTS = {
  en: {
    pdf: "Download PDF",
    exp: "Experience",
    edu: "Education",
    certs: "Certifications",
    skills: "Skills",
    langs: "Languages",
    repos: "Featured Projects",
    contact: "Contact",
    nocerts: "No certifications added yet."
  },
  es: {
    pdf: "Descargar PDF",
    exp: "Experiencia",
    edu: "Educación",
    certs: "Certificaciones",
    skills: "Habilidades",
    langs: "Idiomas",
    repos: "Proyectos Destacados",
    contact: "Contacto",
    nocerts: "Aún no hay certificaciones."
  }
};

const langSelect = document.getElementById("langSelect");
let lang = localStorage.getItem("cvLang") || "en";
langSelect.value = lang;

function setTexts() {
  const t = TEXTS[lang];
  document.getElementById("pdfText").textContent      = t.pdf;
  document.getElementById("expTitle").textContent     = t.exp;
  document.getElementById("eduTitle").textContent     = t.edu;
  document.getElementById("certTitle").textContent    = t.certs;
  document.getElementById("skillsTitle").textContent  = t.skills;
  document.getElementById("langTitle").textContent    = t.langs;
  document.getElementById("contactTitle").textContent = t.contact;
}

function loadAndRender() {
  fetch(`data_${lang}.json`)
    .then(res => res.json())
    .then(data => renderCV(data))
    .catch(err => {
      alert("Error loading data: " + err);
      console.error(err);
    });
}

langSelect.addEventListener("change", (e) => {
  lang = e.target.value;
  localStorage.setItem("cvLang", lang);
  setTexts();
  loadAndRender();
});

// Inicialización
setTexts();
loadAndRender();

function renderCV(data) {
  // Hero/Profile
  document.getElementById("profilePic").src = data.profile.photoUrl;
  document.getElementById("name").textContent = data.profile.name;
  document.getElementById("title").textContent = data.profile.title;
  document.getElementById("summary").textContent = data.profile.summary;

  // Experiencia
  document.getElementById("experienceContainer").innerHTML = (data.experience || []).map(e => `
    <div>
      <div class="font-poppins text-lg font-bold text-indigo-800 mb-1">
        ${e.position} <span class="text-gray-700 font-normal">${lang === "en" ? "at" : "en"}</span> ${e.company}
      </div>
      <div class="text-sm text-gray-500 mb-2">${e.period}</div>
      <ul class="list-disc ml-6 text-gray-700">${(e.responsibilities || []).map(r=>`<li>${r}</li>`).join('')}</ul>
    </div>
  `).join('');

  // Educación
  document.getElementById("educationContainer").innerHTML = (data.education || []).map(ed => `
    <div class="p-4 rounded-xl border border-indigo-100 bg-white/90 shadow-sm">
      <div class="font-bold text-indigo-700">${ed.degree}</div>
      <div class="text-gray-700">${ed.institution} <span class="text-gray-500">(${ed.year})</span></div>
    </div>
  `).join('');

  // NEW: Certificaciones
  const certs = data.certifications || [];
  document.getElementById("certificationsContainer").innerHTML = certs.length
    ? certs.map(c => `
      <div class="p-4 rounded-xl border border-indigo-100 bg-white/90 shadow-sm">
        <div class="font-bold text-indigo-700">${c.degree}</div>
        <div class="text-gray-700">${c.institution} <span class="text-gray-500">(${c.year})</span></div>
      </div>
    `).join('')
    : `<p class="text-gray-500">${TEXTS[lang].nocerts}</p>`;

  // Skills
  document.getElementById("skillsContainer").innerHTML = (data.skills || []).map(sk => `
    <div>
      <div class="flex justify-between font-semibold mb-1">${sk.name} <span>${sk.level}%</span></div>
      <div class="w-full h-3 bg-gray-200 rounded-full">
        <div class="h-3 bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all" style="width:${sk.level}%"></div>
      </div>
    </div>
  `).join('');

  // Idiomas
  document.getElementById("languagesContainer").innerHTML = (data.languages || []).map(lg => `
    <div>
      <div class="flex justify-between font-semibold mb-1">${lg.name} <span>${lg.level}%</span></div>
      <div class="w-full h-3 bg-gray-200 rounded-full">
        <div class="h-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all" style="width:${lg.level}%"></div>
      </div>
    </div>
  `).join('');

  // Contacto (2 columnas en desktop, stack en mobile)
  document.getElementById("contactContainer").innerHTML = (data.contact || []).map(ct => `
    <li class="flex flex-col gap-1 px-4 py-3 bg-white/90 border border-indigo-100 rounded-xl shadow text-indigo-700">
      <span class="font-semibold flex items-center gap-2">
        <i class="fa ${ct.icon}"></i>${ct.label}
      </span>
      <span class="text-gray-800 break-all">${ct.value}</span>
    </li>
  `).join('');

  // PDF
  document.getElementById("pdfBtn").onclick = () => {
    const main = document.querySelector('main');
    html2pdf()
      .set({
        margin: 0.3,
        filename: `CV_${data.profile.name.replace(/\s+/g, '_')}_${lang}.pdf`,
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        jsPDF: { format: 'a4', orientation: 'portrait' }
      })
      .from(main).save();
  };
}
