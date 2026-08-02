const VIDEO_ID = "JTxsNm9IdYU";
let tutorials = [];
const itemsPerPage = 10;

const cardsTutorials = document.querySelector(".cards-tutorials");
const pagination = document.querySelector(".pagination");

fetch(
  `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${VIDEO_ID}&key=${API_KEY}`
)
.then(res => {
    console.log("Status:", res.status);
    return res.json();
})
.then(data => {

  console.log(data);
  

    if(!data.items || data.items.length === 0){
        console.log("Not video found");
        return;
    }
    
})
.catch(err => console.error(err));

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

function displayTutorials(page){
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    let currentLang = localStorage.getItem("lang") || "en";

    const currentTutorial = tutorials.slice(start, end)
    cardsTutorials.innerHTML = "";
    currentTutorial.forEach(tutorial => {
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${tutorial.youtubeID}&key=${API_KEY}`)
        .then(response => response.json())
        .then(videoData => {
            const video = videoData.items[0];

            const tutorialData = buildTutorialData(tutorial, video);

            cardsTutorials.innerHTML += renderTutorialCard(tutorialData);
            
            
        })
        
    });
}

function displayPagination(currentPage){
    pagination.innerHTML = "";

    const totalPages = Math.ceil(tutorials.length / itemsPerPage)

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
                        onclick="displayTutorials(${i}); displayPagination(${i})"
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


fetch("data/tutorials.json")
.then(response => response.json())
.then(data => {
    tutorials = data;
    displayTutorials(1);
    displayPagination(1);
    
})
.catch(error => {
    console.error(error);
    
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