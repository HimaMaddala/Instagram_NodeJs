import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feed.css'
const Feed = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/feed");
      setFeed(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  return (
    <div>
      <br></br>
      <div className="gallery">
        {feed.map((post, index) => (
          <div className="image-container" key={index}>
            <img src={post.img_url} alt={post.category} style={{width:'350px'}}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
