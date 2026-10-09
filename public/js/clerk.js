// variables
const submitBtn = document.getElementById("submitBtn");
const submit_form = document.getElementById("submit_form");


submit_form.onsubmit = (e)=>{
    e.preventDefault();
}

function togglePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}

function closepopup(){
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}


function forwardLetter(id){
    fetch("api/forward_to_pa/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sn: id
        })
    }).then(response => response.json())
    .then(result => {
        // console.log(result);
        if (result.message) {
            console.log(result.message);
        }
        closepopup()
    })
    .catch(error => console.error(error)
    )
}


submitBtn.onclick = ()=> {
    const data = {
        sn: document.getElementById("sn").value,
        owner_name: document.getElementById("owner_name").value,
        owner_phone: document.getElementById("owner_phone").value,
        owner_email: document.getElementById("owner_email").value,
        owner_nin: document.getElementById("owner_nin").value,
        subject: document.getElementById("subject").value,
        priority: document.getElementById("Priority").value
    }

    // console.log(data);

    fetch("/api/register_letter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    }).then(response => response.json())
    .then(result => {
        // console.log(result);
        const letter_details = document.getElementById("letter_details");
        if (result.message) {
            letter_details.innerHTML = result.letter.map(details => 
                `
                <h2> Brief Letter Details</h2>
                <p><strong>Owner:</strong> ${details.owner_name}</p>
                <p><strong>Subject:</strong> ${details.subject}</p>
                <p><strong>Status:</strong> <span class="badge">${details.current_status}</span></p>
                <h3>Time: <span class="badge">${details.submitted_at}</span>  |  SN: <span class="badge"> ${details.id}</span></h3>
                <button class="btn-submit" onclick="forwardLetter('${details.sn}')" type="submit">FORWARD TO PA OFFICE</button>
                <button class="btn-close-popup" onclick="closepopup()">Cancel</button>
                `).join('');
        }
        togglePopup();
        document.getElementById("sn").value = ""
        document.getElementById("owner_name").value = ""
        document.getElementById("owner_phone").value = ""
        document.getElementById("owner_email").value = ""
        document.getElementById("owner_nin").value = ""
        document.getElementById("subject").value = ""
        document.getElementById("Priority").value = ""
    })
    .catch(error => console.error(error));
}

// load view
