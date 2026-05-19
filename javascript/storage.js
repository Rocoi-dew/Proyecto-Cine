/* BOTÓN MODO OSCURO */
const btn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
}

if (btn) {
    btn.addEventListener("click", () => {
    
      document.body.classList.toggle("dark-mode");
      
      let theme = "light";
      if (document.body.classList.contains("dark-mode")) {
        theme = "dark";
      }
      localStorage.setItem("theme", theme);
    });
}