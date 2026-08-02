const featureds = document.querySelector(".featureds");
const pagination = document.querySelector(".pagination");
let tools = [];
const itemsPerPage = 10;



function displayTools(page){
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const currentTools = tools.slice(start, end)
    featureds.innerHTML = "";
    currentTools.forEach(featured => {

        const toolData = buildToolsData(featured);
        
        featureds.innerHTML += renderTools(toolData);
      });
}

function displayPagination(currentPage){
    pagination.innerHTML = "";

    const totalPages = Math.ceil(tools.length / itemsPerPage)

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
                        onclick="displayTools(${i}); displayPagination(${i})"
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

fetch("./data/ai-tools.json")
   .then(res => res.json())
   .then(data => {
       tools = data;
       displayTools(1);
       displayPagination(1)
   })
   .catch(error => {
    console.error(error);
    
   })