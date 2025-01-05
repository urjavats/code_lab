//here we create a mongoose model to communicate with the database

const mongoose=require('mongoose');
const router = require('../api/Room');
const Schema = mongoose.Schema;

const RoomSchema= new Schema({
    roomName: { type: String, required: true, trim: true },
    problem: { type: String, required: true }, 
});

const Room=mongoose.model('Room',RoomSchema);

module.exports = Room;
