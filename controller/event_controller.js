const Event = require('../models/Event');

exports.addEventController = (req, res) => {

    const { user, name, location, duration, description,url,isActive } = req.body;
    const eventToSave = new Event(
        {
            user: user,
            name: name,
            location: location,
            duration: duration,
            description: description,
            url: url,
            isActive: isActive,
        });
    eventToSave.save((err, eventToSave) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ errors: "Could not save the Event to the Database" });
        }
        else {
            return res.json({ success: true, message: eventToSave, message: 'Event Saved' });
        }
    })
}

exports.deleteEventController = (req,res) =>{
    const {eventid} = req.body;
    
    Event.findByIdAndDelete(eventid,function(err){
        if(err){
            console.log(err)
        }
    })
}

exports.getEventListController = (req, res) => {
    
    const userid = req.query.user;
    const query = Event.find({ user: userid });
    query.exec(function(err,event){
        if(err)
        {
            return err;
        }
        else{
            return res.json(event)
        }
    });

}

exports.getEventByIdController = (req,res) => {

    const eventID = req.query.event;

    const query = Event.findById({ _id: eventID});

    query.exec(function(err,event){
        if(err)
        {
            return err;
        }
        else{
            return res.json(event)
        }
    });
}

exports.updateEventController = (req,res) =>{
    const event = req.body;

    var query = {_id : event.eventID}
    
     Event.findByIdAndUpdate(query,req.body,{upsert:true},function(err,event){
         if(err)
         {
             return err;
         }
         else{
             return res.json("Update successful")
         }
     })   
}