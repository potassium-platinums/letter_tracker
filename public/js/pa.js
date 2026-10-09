async function loadLetter (){
    const letter_View = document.getElementById("letter_View");
    try {
        const response = await fetch("api/pa_letter/");
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.length == 0) {
            letter_View.innerHTML = data.map(letter => `
            <div class="notif">
            <span class="chan">${letter.priority}</span>
            <span class="status">${letter.owner_name}</span>
        </div>
        <h3 id="new-letter">${letter.subject}</h3>
        <button onclick="acknowledge_letter('${letter.sn}')">Acknowledge Letter</button>
            `).join('');
        }else{
            letter_View.innerHTML = `
            <div class="notif">
          <span class="msg">No Letter Avaliable</span>
        </div>
            `;
        }
        
    } catch (error) {
        console.error(error);
    }
}

async function loadLetterAcknowledged (){
    const letter_acknowleged = document.getElementById("letter_acknowleged");
    try {
        const response = await fetch("api/acknowledged/");
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.length == 0) {
            letter_acknowleged.innerHTML = data.map(letter => `
            <div class="notif">
          <span class="chan">${letter.priority}</span>
          <span class="status">${letter.owner_name}</span>
        </div>
        <h3 id="new-letter">${letter.subject}</h3>
        <button onclick="forwardCeo('${letter.sn}')">Forward To Ceo</button>
            `).join('');
        }else{
            letter_acknowleged.innerHTML = `
            <div class="notif">
          <span class="msg">No Letter Avaliable</span>
        </div>
            `;
        }
        
    } catch (error) {
        console.error(error);
    }
}


function acknowledge_letter(id){
    fetch("api/acknowledge_letter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sn: id
        })
    }).then(response => response.json())
    .then(result => {
        console.log(result);
        
    })
    .catch(error => console.error(error)
    );
}

function forwardCeo(id) {
    fetch("api/forward_to_ceo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sn: id
        })
    }).then(response => response.json())
    .then(result => {
        console.log(result);
        
    })
    .catch(error => console.error(error)
    );
}


// load view
loadLetter();
loadLetterAcknowledged()