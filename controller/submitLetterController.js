const { APP_NAME } = require('../config/constants');
const { insertLetter, letter_event, getLetterByid, getLetterBysn, updateLetterStatus, insertappointment, insertReply } = require('../utils/dbhelper');

function registerLetter(req, res) {
  const { sn, owner_name, owner_phone, owner_email, owner_nin, subject, priority } = req.body;

  // Validate required fields   
    if (!sn || !owner_name || !owner_phone || !owner_email || !owner_nin || !subject || !priority) {
    return res.status(400).send({ status: 'error', message: 'All fields are required' });
  }

    // Insert letter into the database
  const letterId = insertLetter(sn, owner_name, owner_phone, owner_email, subject, priority, 'SUBMITTED', 'CLERK');
  
  // Insert event into the database
  letter_event(sn, 'SUBMITTED', 'CLERK', 'CLERK', 'Letter submitted', "ojok");

  res.status(201).send({status: 'success', letter: getLetterByid(letterId), message: 'Letter registered successfully'});
}

function forwardToPA(req, res) {
  const { sn } = req.body;

  // collect the letter details from the database
  const letter = getLetterBysn(sn);
  
  // forward the letter to PA
  letter_event(sn, 'FORWARDED_TO_PA', 'CLERK', 'CLERK', 'Letter forwarded to PA', "potassium");

  // update the letter status in the database
  updateLetterStatus(sn, 'FORWARDED_TO_PA');

  res.status(200).send({status: 'success', message: 'Letter forwarded to PA successfully'});
  
  
}

function receivedbyPA(req, res) {
  const { sn } = req.body;

  // collect the letter details from the database
  // const letter = getLetterBysn(sn);

  // update the letter status in the database
  updateLetterStatus(sn, 'RECEIVED_BY_PA');

  // acknowledge the letter by PA
  letter_event(sn, 'RECEIVED_BY_PA', 'PA', 'PA', 'Letter acknowledged by PA', "potassium okumu");


  // send response
  res.status(200).send({status: 'success', message: 'Letter acknowledged by PA successfully'});
}

function forwardToCeo(req, res) {
  const { sn } = req.body;

  // collect the letter details from the database
  const letter = getLetterBysn(sn);

  // forward the letter to CEO
  letter_event(sn, 'FORWARDED_TO_CEO', 'PA', 'PA', 'Letter forwarded to CEO', "potassium okumu ronny");

  // update the letter status in the database
  updateLetterStatus(sn, 'FORWARDED_TO_CEO');

  // send response
  res.status(200).send({status: 'success', message: 'Letter forwarded to CEO successfully'});
  
}

function replyToLetter(req, res) {
  const { sn, reply } = req.body;
  // collect the letter details from the database
  const letter = getLetterBysn(sn);

  // reply to the letter
  letter_event(sn, 'REPLIED', 'CEO', 'CEO', `Letter replied: ${reply}`, "ronny okumu");

  // update the letter status in the database
  updateLetterStatus(sn, 'REPLIED');

  // insert reply into the letter details
  insertReply(sn, reply);

  // send response
  res.status(200).send({status: 'success', message: 'Letter replied successfully'});
  
}

function setAppointment(req, res) {
  const { sn, appointment_date } = req.body;
  
  // collect the letter details from the database
  const letter = getLetterBysn(sn);

  // set appointment for the letter
  letter_event(sn, 'APPOINTMENT_SET', 'CEO', 'CEO', `Appointment set for: ${appointment_date}`, "ronny okumu");

  // update the letter status in the database
  updateLetterStatus(sn, 'APPOINTMENT_SET');

  // insert appointment date into the letter details
  insertappointment(sn, appointment_date);

  // send response
  res.status(200).send({status: 'success', message: 'Appointment set successfully'});
}


module.exports = {
  registerLetter,
  forwardToPA,
  receivedbyPA,
  forwardToCeo,
  replyToLetter,
  setAppointment
}; 