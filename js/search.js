const params = new URLSearchParams(window.location.search)
const searchTerm = params.get("q");
const categoryItem = params.get("category");
console.log(categoryItem);
const titleSearch = document.querySelector(".title-search")

if(searchTerm){
    titleSearch.innerHTML = `Search Results : <span id="search-words"></span>`;
}else if(categoryItem){
    titleSearch.innerHTML = `Category : <span id="search-words"></span>`;
}

let tutorials = [];
let tools = [];
let prompts = [];

const tabs = document.querySelectorAll(".tab");
const toolsResults = document.getElementById("tools-results")
const tutorialsResults = document.getElementById("tutorials-results")
const promptsResults = document.getElementById("prompts-results")


copyPrompts();

const searchWords = document.getElementById("search-words")
if(searchTerm){
    searchWords.textContent = searchTerm
}else if(categoryItem){
    searchWords.textContent = categoryItem
}

fetch("data/tutorials.json")
.then(response => response.json())
.then(data => {
    tutorials = data;

    const result = tutorials.filter(searchTutorials)
    
    tutorialsResults.innerHTML = "";

    if (result.length === 0) {
           tutorialsResults.innerHTML = `
                                    <div class="no-results">
                                        <p>No results found.</p>
                                    </div>
                                `;
           return;
        }

    result.forEach(tutorial => {

        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${tutorial.youtubeID}&key=${API_KEY}`)
        .then(res => res.json())
        .then(videoData => {

            const video = videoData.items[0];

            const tutorialData = buildTutorialData(tutorial, video);

            tutorialsResults.innerHTML += renderTutorialCard(tutorialData);

    });
})
    
    
})
fetch("data/ai-tools.json")
.then(response => response.json())
.then(data => {
    tools = data;
    const result = tools.filter(searchTools)

    toolsResults.innerHTML = "";

    if (result.length === 0) {
           toolsResults.innerHTML = `
                                <div class="no-results">
                                    <p>No results found.</p>
                                </div>
                            `;
           return;
        }

    result.forEach(item => {

        const toolsData = buildToolsData(item)
        toolsResults.innerHTML += renderTools(toolsData)
    })
    
    
})
fetch("data/prompts.json")
.then(response => response.json())
.then(data => {
    prompts = data;
    const result = prompts.filter(searchPrompts)

    promptsResults.innerHTML = "";

    if (result.length === 0) {
           promptsResults.innerHTML = `
                                    <div class="no-results">
                                        <p>No results found.</p>
                                    </div>
                                `;
           return;
        }

    result.forEach(item => {

        const promptsData = buildPromptData(item)
        promptsResults.innerHTML += renderPromptCard(promptsData)

        copyPrompts();
    })
    
    
})

let query;

if(searchTerm){
    query = searchTerm.toLowerCase()
}else{
    query = categoryItem.toLowerCase()
}

function searchTutorials(item){

    const currentLang = localStorage.getItem("lang") || "en";

    const categorie = item.categories[currentLang].join('').toLowerCase().includes(query);
    
    const tag = item.tags[currentLang].join('').toLowerCase().includes(query);

    return item.tool.toLowerCase().includes(query) || item.description[currentLang].toLowerCase().includes(query) || categorie || tag
}
function searchTools(item){

    const currentLang = localStorage.getItem("lang") || "en";

    const categorie = item.categories[currentLang].join('').toLowerCase().includes(query);
    
    const name = item.name.toLowerCase().includes(query);
    const tag = item.tags[currentLang].join('').toLowerCase().includes(query);

    return  item.description[currentLang].toLowerCase().includes(query) || categorie || name || tag;
}
function filterToolsByCategory(item){
    const categorie = item.categories[currentLang].join('').toLowerCase().includes(query);
    return categorie
}
function searchPrompts(item){

    const categorie = item.categories
        .join("")
        .toLowerCase()
        .includes(query);

    const title = item.title
        .toLowerCase()
        .includes(query);

    const prompt = item.prompt
        .toLowerCase()
        .includes(query);

    const aiModel = item.aiModel
        .toLowerCase()
        .includes(query);

    return title || prompt || aiModel || categorie;
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        tabs.forEach(tab => {
        tab.classList.remove("active");
     })

     const sections = [toolsResults, tutorialsResults, promptsResults]

     sections.forEach(section => {
        section.style.display = 'none'
     })

        const section = document.getElementById(`${tab.dataset.tab}-results`);

        section.style.display = 'grid'

        tab.classList.add("active");

    })

})


// Categorie Part

