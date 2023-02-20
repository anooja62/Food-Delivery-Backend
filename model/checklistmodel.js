const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const checklistSchema = new Schema({
  restaurantId:{type:String,required:true},
  date: { type: Date, required: true },
  cleanlinessRating: { type: Number, required: true },
  employeesWearingPPE: { type: String, required: true },
  utensilsSanitized:{type:String,required:true},
  foodPackagingSanitized:{type:String,required:true},
}, {
  timestamps: true
});

const Checklist = mongoose.model('Checklist', checklistSchema);

module.exports = Checklist;
