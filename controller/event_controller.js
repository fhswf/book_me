const Event = require('../models/Event');

exports.addEventController = (req, res) => {

    const { user, name, location, duration, description } = req.body;
    const eventToSave = new Event(
        {
            user: user,
            name: name,
            location: location,
            duration: duration,
            description: description,
        });

    console.log(eventToSave)

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