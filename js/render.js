
function renderTools(tool){
    return  `
        <div class="featured">
            <div class="logo">
              <img src="${tool.logo}" alt="" />
            </div>
            <strong>${tool.name}</strong>
            <div class="category">
              ${tool.categoriesHTML}
            </div>
            <p class="description">
              ${tool.description}
            </p>
            <div class="tags">
              ${tool.tagsHTML}
            </div>
            <div class="stars">
              ${tool.starsHTML}
            </div>
            <a class="btn-visit" href="${tool.website}"
              >Visit Tool <i class="fa-solid fa-arrow-right-long"></i
            ></a>
          </div>
        `
}

function buildToolsData(featured) {

    let currentLang = localStorage.getItem("lang") || "en";

    const categoriesHTML = featured.categories[currentLang]
        .map(cat => `<span>${cat}</span>`)
        .join("");

    const tagsHTML = featured.tags[currentLang]
        .map(tag => `<span>${tag}</span>`)
        .join("");

    const fullStars = Math.floor(featured.rating);
    const hasHalfStar = featured.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = "";

    for (let i = 0; i < fullStars; i++)
        starsHTML += `<i class="fa-solid fa-star"></i>`;

    if (hasHalfStar)
        starsHTML += `<i class="fa-solid fa-star-half-stroke"></i>`;

    for (let i = 0; i < emptyStars; i++)
        starsHTML += `<i class="fa-regular fa-star"></i>`;

    return {
        ...featured,
        description: featured.description[currentLang],
        categoriesHTML,
        tagsHTML,
        starsHTML
    };
}


function renderTutorialCard(tutorialData){
    return  `
            <div class="card">
            <img src="${tutorialData.image}" alt="" />
            <h3>${tutorialData.title}</h3>
            <div class="category">
              ${tutorialData.categories}
            </div>
            <p>
              ${tutorialData.description}
            </p>
            <div class="actions">
              <div class="time">
                <p>${tutorialData.duration}</p>
              </div>
              <div class="veiws">
                <span>${tutorialData.views} veiws</span> . <span>${tutorialData.published}</span>
              </div>
            </div>
            <div class="level">
              ${tutorialData.level}
            </div>
            <a class="btn-visit" href="https://www.youtube.com/watch?v=${tutorialData.youtubeID}"
              >Open Tutorial <i class="fa-solid fa-arrow-right-long"></i
            ></a>
          </div>
            `
}

function buildTutorialData(tutorial, video){
    let currentLang = localStorage.getItem("lang") || "en";

    const categoriesHTML = tutorial.categories[currentLang]
        .map(cat => `<span>${cat}</span>`)
        .join("");

    const levelHTML = tutorial.level[currentLang]
        .map(level => `<span>${level}</span>`)
        .join("");

    return  {
        title: video.snippet.title,
        youtubeID: tutorial.youtubeID,
        image: video.snippet.thumbnails.high.url,
        duration: formatDuration(video.contentDetails.duration),
        views: formatViews(video.statistics.viewCount),
        published: new Date(video.snippet.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
        description: tutorial.description[currentLang],
        categories: categoriesHTML,
        level: levelHTML,
    };
}


function renderPromptCard(prompt){
    return `
        <div class="card">
    <h3>${prompt.title}</h3>
    <div class="name-ai-model">
      <p>${prompt.aiModel}</p>
    </div>
    <div class="category">
      ${prompt.categoriesHTML}
    </div>
    <div class="prompt-preview">
      <p>
        ${prompt.prompt}
      </p>
    </div>
    <button class="copy-btn">
      <i class="fa-solid fa-copy"></i> Copy
    </button>
    <div class="actions">
      <p class="views">+${prompt.views} Views</p>
      <div class="stars">
        ${prompt.starsHTML}
      </div>
    </div>
  </div>
        `
}

function buildPromptData(prompt){ 

     let currentLang = localStorage.getItem("lang") || "en";

        const categoriesHTML = prompt.categories
            .map(cat => `<span>${cat}</span>`)
            .join("");

        const fullStars = Math.floor(prompt.rating);
        const hasHalfStar = prompt.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = "";

        for (let i = 0; i < fullStars; i++)
            starsHTML += `<i class="fa-solid fa-star"></i>`;

        if (hasHalfStar)
            starsHTML += `<i class="fa-solid fa-star-half-stroke"></i>`;

        for (let i = 0; i < emptyStars; i++)
            starsHTML += `<i class="fa-regular fa-star"></i>`;

        return {
            ...prompt,
            views: formatViews(prompt.views),
            categoriesHTML,
            starsHTML
        }
}

function copyPrompts(){
    const copyBtn = document.querySelectorAll(".copy-btn");

      copyBtn.forEach(btn => {
        btn.addEventListener("click", () => {
        const promptText = btn.parentElement.querySelector(".prompt-preview p");
          navigator.clipboard.writeText(promptText.textContent)
           .then(() => {
                btn.innerHTML = `
            <i class="fa-solid fa-check"></i> Copied
            `

            setTimeout(() => {
                btn.innerHTML = `
            <i class="fa-solid fa-copy"></i> Copy
            `
            }, 2000)
           })
           .catch(err => {
            console.error(err);
        });
      })
    })
}
copyPrompts();

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
formatViews();