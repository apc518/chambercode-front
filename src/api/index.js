import axios from 'axios';

const url = "http://localhost:5000";

export const fetchPosts = () => axios.get(`${url}/posts`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        console.error(err);
    });

export const createPost = (newPost) => axios.post(url, newPost);