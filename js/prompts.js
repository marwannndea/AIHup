const promptsCards = document.querySelector(".prompts-cards");
const pagination = document.querySelector(".pagination");
let prompts = [];
const itemsPerPage = 10;

function displayPrompts(page){
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const currentTools = prompts.slice(start, end)
    promptsCards.innerHTML = "";
    currentTools.forEach(prompt => {
       const promptData = buildPromptData(prompt);
        promptData.views = formatViews(prompt.views);

        promptsCards.innerHTML += renderPromptCard(promptData);
      });


      copyPrompts();
}

function displayPagination(currentPage){
    pagination.innerHTML = "";

    const totalPages = Math.ceil(prompts.length / itemsPerPage)
    let dots = false;

    for (let i = 1; i <= totalPages; i++) {
        if (
            totalPages <= 7 ||
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {

            pagination.innerHTML += `
                <li>
                    <a
                        href="#"
                        class="${i === currentPage ? "active" : ""}"
                        onclick="displayPrompts(${i}); displayPagination(${i})"
                    >
                        ${i}
                    </a>
                </li>
            `;

            dots = false;

        } else {

            if (!dots) {

                pagination.innerHTML += `
                    <li><span>...</span></li>
                `;

                dots = true;
            }
        
    }}
}

fetch("data/prompts.json")
.then(response => response.json())
.then(data => {
    prompts = data
    displayPrompts(1);
    displayPagination(1)
})