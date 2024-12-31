const mongoose = require('mongoose')


const doctorSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
        required: true,
      },
      appointmentCost:{
        type: Number,
        required:true
      },
    password:{
        type:String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true,
    },
    clinicAddress: {
        type: String,
        required: true,
    },
    appointments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Appointment',
        required: true
    }],
    
    image:{
        type:String
    }
})

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;