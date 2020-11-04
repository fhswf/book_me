const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        user: String,
        name:{
            type: String,
            required: true
        },

        location: String,

        description:{
            type: String,
            default: ''
        },
        
        duration:{
            type: String,
            required:true,
            default: '15'
        },
        /*
        range:{
            workingdays: {type:Boolean},
            numberOfDays: {type:Number},
        }*/
    }
)
module.exports = mongoose.model('Event', eventSchema);