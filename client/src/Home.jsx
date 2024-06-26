import React, { useState, useEffect } from 'react';
import axios from 'axios';
import like from './assets/heart.png';
import comment from './assets/comment.png';
import forward from './assets/forward.png';
import save0 from './assets/save0.png';
import save1 from './assets/save1.png';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getProfileImageSize = (index) => {
    // Define custom sizes based on index
    const sizes = [
      { width: 40, height: 40 },
      { width: 45, height: 45 },
      { width: 35, height: 35 },
      { width: 38, height: 35 },
      { width: 30, height: 30 },
      { width: 40, height: 40 },
    ];
    const size = sizes[index % sizes.length]; // Repeat pattern if more than 6 posts
    return { width: size.width, height: size.height };
};


  const getPostImageSize = (index) => {
    // Define custom sizes based on index
    const sizes = [
      { width: 550, height: 350 },
      { width: 600, height: 350 },
      { width: 550, height: 360 },
      { width: 520, height: 360 },
      { width: 550, height: 365 },
      { width: 530, height: 600 },
    ];
    return sizes[index % sizes.length]; // Repeat pattern if more than 6 posts
  };

  const handleSaveImage = async (postImage) => {
    try {
      const data = { post_image: postImage };

      // Send a POST request to the backend with data
      const response = await axios.post("http://localhost:8080/predict", data);
      alert("Button clicked!");

      // Log the predicted class and confidence
      console.log("Predicted class:", response.data.predicted_class);
      console.log("Confidence:", response.data.confidence);

      // Optionally, you can update the UI after receiving the response
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <>
      <div>Home</div>
      <div className='displayposts'>
        <p>Posts</p>
        {posts.map((post, index) => (
          <div className='displaypostscards' key={index}>
            <div className='profile-section'>
              <div className='profile-section-cont'>
                <img src={post.profile_img} style={{ width: `${getProfileImageSize(index).width}px`, height: `${getProfileImageSize(index).height}px`, marginLeft: '10px', borderRadius: '50%' }} alt="Profile"></img>
                <p>{post.username}</p>
              </div>
            </div>
            <div className='display-post'>
              <img src={post.post_image} style={{ width: `${getPostImageSize(index).width}px`, height: `${getPostImageSize(index).height}px` }} alt="Post"></img>
            </div>
            <div className='description-section'>
            <div className='icons-cont'>
                <img src={like} style={{ width: '25px' }} alt="Like"></img>
                <img src={comment} style={{ width: '23px' }} alt="Comment"></img>
                <img src={forward} style={{ width: '23px' }} alt="Forward"></img>
                <img src={save0} style={{ width: '26px', cursor: 'pointer' }} alt="Save" onClick={() => handleSaveImage(post.post_image)}></img>
              </div>
              <div className='description-section-cont' style={{ marginLeft: '15px' }}>
                <p ><span style={{}}>   </span> {post.caption}<span style={{color:'#0047AB'}}>{post.hastags}</span></p>
                
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
