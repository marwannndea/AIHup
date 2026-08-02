const darkModeBtn = document.querySelector(".dark-mode");
const langBtn = document.querySelector(".lang");
const langContainer = document.querySelector(".lang-container");
const tutorialContainer = document.querySelector(".cards-tutorials");
const menuBtn = document.querySelector(".menu");
const list = document.querySelector(".list");

const API_KEY = "AIzaSyCn26G0wuZ1YsDq7iiks6gE8x5t9Ua_DsA";

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("darkMode", "true"); 
    }else{
        localStorage.setItem("darkMode", "false");
    }
})

if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark");
}

langBtn.addEventListener("click", () => {
    langContainer.classList.toggle("active");
})

menuBtn.addEventListener("click", () => {
    list.classList.toggle("active");
})

const categories = [
    { id: "Chatbot", name: "AI Chatbots", icon: "fa-solid fa-robot"},
    { id: "Image Generation", name: "Image Generation", icon: "fa-solid fa-images"},
    { id: "Video Creation", name: "Video Creation", icon: "fa-solid fa-video"},
    { id: "Coding", name: "Coding Assistants", icon: "fa-solid fa-code"},
    { id: "Writing", name: "Writing Tools", icon: "fa-solid fa-pen"},
    { id: "Audio", name: "Audio & Music", icon: "fa-solid fa-music"},
    { id: "Data Analysis", name: "Data Analysis", icon: "fa-solid fa-chart-line"},
    { id: "Productivity", name: "Productivity", icon: "fa-solid fa-bolt"}
]

const categoriesContainer = document.querySelector(".categories");

categories.forEach(cat => {
    categoriesContainer.innerHTML += `
          <button class="categorie" data-category="${cat.id}">
            <i class="${cat.icon}"></i>
            <h3>${cat.name}</h3>
          </button>
    `
});

const category = document.querySelectorAll(".categorie");

category.forEach(cat => {
    cat.addEventListener("click", () => {
        const data = cat.dataset.category;

    if(!data) return;

    window.location.href = `search.html?category=${encodeURIComponent(data)}`
    
    })
})

const featuredscontainer = document.querySelector(".featureds");
const promptsContainer = document.querySelector(".prompts-cards");

let currentLang = localStorage.getItem("lang") || "en";

function renderFeaturedTools(data, limit) {
    featuredscontainer.innerHTML = "";

    data.slice(0, limit).forEach(featured => {
        const toolData = buildToolsData(featured);
        featuredscontainer.innerHTML += renderTools(toolData);
    });
}

function renderFeaturedPrompts(data, limit) {
    promptsContainer.innerHTML = "";

    data.slice(0, limit).forEach(prompt => {
        const promptData = buildPromptData(prompt);
        promptData.views = formatViews(prompt.views);

        promptsContainer.innerHTML += renderPromptCard(promptData);
        });
    initCopyButtons();
}

const containerTutorials = document.querySelector(".cards-tutorials")
  
    


function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const promptText = btn.parentElement.querySelector(".prompt-preview p");

            navigator.clipboard.writeText(promptText.textContent)
            .then(() => {

                btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;

                setTimeout(() => {
                    btn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy`;
                }, 2000);

            });

        });

    });
}

fetch("./data/ai-tools.json")
.then(res => res.json())
.then(data => {
    renderFeaturedTools(data, 6);
});

fetch("./data/prompts.json")
.then(res => res.json())
.then(data => {
    renderFeaturedPrompts(data, 3);
});

fetch("data/tutorials.json")
.then(response => response.json())
.then(data => {
    containerTutorials.innerHTML = "";

    data.slice(0, 4).forEach(tutorial => {

        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${tutorial.youtubeID}&key=${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {

            const video = videoData.items[0];

            const tutorialData = buildTutorialData(tutorial, video);

            containerTutorials.innerHTML += renderTutorialCard(tutorialData);

        });

    });
})


function formatDuration(duration){
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = match[1] || 0;
    const minutes = match[2] || 0;
    const seconds = match[3] || 0;

    if(hours > 0){
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`
}

function formatViews(veiws){
                veiws = Number(veiws);

                if(veiws >= 1000000){
                  return (veiws / 1000000).toFixed(1) + "M";
                }

                if(veiws >= 1000){
                  return (veiws / 1000).toFixed(1) + "K";
                }

                return veiws
}

const searchBtn = document.querySelector(".search-btn");
const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();

    if(!query) return;

    window.location.href = `search.html?q=${encodeURIComponent(query)}`
    
})