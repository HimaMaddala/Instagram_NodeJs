import mongoose from "mongoose";
const feedSchema = new mongoose.Schema({
  img_url: {
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  }
});
  
const feedsModel = mongoose.model("feeds", feedSchema);
export default feedsModel;
  