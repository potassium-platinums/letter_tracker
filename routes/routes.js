const express = require('express');
const router = express.Router();
const { registerLetter, forwardToPA, receivedbyPA, forwardToCeo, replyToLetter, setAppointment } = require('../controller/submitLetterController');
const { findLetterEvent, getLetterbysn, getPALetter, getacknowledLetter, getCeoLetter } = require('../controller/trackLetterController');


// submit letter route
const submitLetter = router.post('/register_letter', registerLetter);

// forward to PA
const forwardLetterToPA = router.post('/forward_to_pa/', forwardToPA);

// acknowledge letter by pa route
const acknowledgeLetterByPA = router.post('/acknowledge_letter/', receivedbyPA);

// forward to CEO route
const forwardLetterToCeo = router.post('/forward_to_ceo/', forwardToCeo);

// reply to letter route
const replytoLetter = router.post('/reply_to_letter/', replyToLetter);

// set appointment route
const setAppointmentRoute = router.post('/set_appointment/', setAppointment);

// track letter route
const trackLetter = router.post('/track_letter/', findLetterEvent);

// get letter route
const getLetter = router.get('/get_letter/:sn', getLetterbysn);

// get letter forwarded to pa
const forwardedTopa = router.get("/pa_letter/", getPALetter);

// get acknoldged letters
const acknowlgedLetter = router.get("/acknowledged", getacknowledLetter);

// get lettr ceo
const ceoLetter = router.get("/ceo_letter", getCeoLetter);

module.exports = {
    submitLetter,
    trackLetter,
    getLetter,
    forwardLetterToPA,
    acknowledgeLetterByPA,
    forwardLetterToCeo,
    replytoLetter,
    setAppointmentRoute,
    forwardedTopa,
    acknowlgedLetter,
    ceoLetter
};