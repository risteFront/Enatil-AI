import mongoose, { Schema } from 'mongoose';

const crawledPageSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  //todo: add here the missing fields
  links:{
    type:String,
    require:true,
  },
  
  snippet:{
    type:String,
    require:true
  },
  displayedLink:{
    type:String,
    required:true,
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CrawledPage', crawledPageSchema);
