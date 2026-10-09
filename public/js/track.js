const trackBtn = document.getElementById("trackBtn");
const track_form = document.getElementById("track_form");
const closebtn = document.getElementById("closebtn");

track_form.onsubmit = (e)=>{
    e.preventDefault();
}

closebtn.onclick = ()=>{
    const overlay = document.getElementById('trackLetter');
    overlay.classList.toggle('show'); 
}

trackBtn.onclick = ()=>{
    fetch("/api/track_letter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sn: document.getElementById("sn").value,
        })
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        const load_event = document.getElementById("load_event");
        if (!data.length == 0) {
            load_event.innerHTML = data.map(event => `
                <div class="notif">
                    <span class="badge">${event.note}</span>
                    <span class="status">${event.occurred_at}</span>
                </div>
                `).join('');

                // shwo pop up
                const overlay = document.getElementById('trackLetter');
                overlay.classList.toggle('show'); 
        }else{
            console.log("No Letter Found");
        }
    })
    .catch(error => console.error(error))
}