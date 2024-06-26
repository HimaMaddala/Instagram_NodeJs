import mongoose from "mongoose";
const postsSchema = new mongoose.Schema({
  profile_img: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  post_image: {
    type: String,
    required: true
  },
  caption:{
    type: String,
    required: true
  }
});
  
const postsModel = mongoose.model("posts", postsSchema);
export default postsModel;
  