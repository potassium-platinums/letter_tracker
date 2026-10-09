const {getLetterByid, getLetterBysn, getLetterPA, getacknowledPA, getLetterCeo, getLetterEventsById } = require('../utils/dbhelper');

const findLetterEvent = async (req, res) => {
  const { sn } = req.body;
  try {
    const letterEvents = await getLetterEventsById(sn);
    res.json(letterEvents);
  } catch (error) {
    console.error('Error finding letter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLetterbysn = async (req, res) => {
  const { sn } = req.params;
  // console.log('Received SN:', sn); // Log the received SN
  try {
    const letter = await getLetterByid(sn);
    res.json(letter);
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPALetter = async(req, res) => {
  const  sn  = req.params.sn;
  try {
    const letter = await getLetterPA();
    res.json(letter);
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getacknowledLetter = async(req, res) => {
  const  sn  = req.params.sn;
  try {
    const letter = await getacknowledPA();
    res.json(letter);
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getCeoLetter = async(req, res) => {
  const  sn  = req.params.sn;
  try {
    const letter = await getLetterCeo();
    res.json(letter);
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { 
    findLetterEvent,
    getLetterbysn,
    getPALetter,
    getacknowledLetter,
    getCeoLetter
};