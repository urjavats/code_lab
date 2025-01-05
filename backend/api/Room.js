const express=require('express');
const router= express.Router();


//mongodb user model
const Room= require('./../models/Room');

// Signup
router.post('/create', async (req, res) => {
    try {
      const { roomName, problem } = req.body;
  
      // Validate input
      if (!roomName || !problem) {
        return res.status(400).json({ message: 'Room name and problem ID are required.' });
      }
  
      // Create and save room
      const newRoom = new Room({ roomName, problem});
      await newRoom.save();
  
      res.status(201).json({ message: 'Room created successfully!', room: newRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Could not create room.' });
    }
  });
  router.get('/', async (req, res) => {
    try {
        // Fetch all rooms from the database
        const rooms = await Room.find();  // You can add a populate() here if you want to fetch related data

        // Check if any rooms are found
        if (rooms.length === 0) {
            return res.status(404).json({ message: 'No rooms found.' });
        }

        // Send the rooms data as response
        res.status(200).json({ rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Could not fetch rooms.' });
    }
});



module.exports=router;