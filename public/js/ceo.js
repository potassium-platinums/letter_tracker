function ceo_appointment(sn){

    console.log(sn);
    

    // show pop up
    const overlay = document.getElementById('ceo_replay');
    overlay.classList.toggle('show');
}

function reply_msg(sn) {
    console.log(sn);
    

    // show pop up
    const overlay = document.getElementById('ceo_replay_msg');
    overlay.classList.toggle('show');

}

async function loadLetter() {
        const letter_View = document.getElementById("letter_View");
    try {
        const response = await fetch("api/ceo_letter/");
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
        <button onclick="reply_msg('${letter.sn}')">Reply</button>
        <button onclick="ceo_appointment('${letter.sn}')">Set Appointment</button>
        <button data-action="NO_ACTION_FILED">No Action</button>
      </div>
            `).join('');
        }else{
            letter_View.innerHTML = `
            <div class="notif">
          <span class="msg">No Letter Avaliable Yet</span>
        </div>
            `;
        }
        
    } catch (error) {
        console.error(error);
    }
}

// load view
loadLetter();