// src/stores/couchService.js
import axios from 'axios';

const dbUrl = 'http://localhost:5984/techstore'; 

const couch = axios.create({
  baseURL: dbUrl,
  auth: {
    username: 'admin',  
    password: 'admin'   
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllDocs = async () => {
  const res = await couch.get('/_all_docs?include_docs=true');
  return res.data.rows.map(row => row.doc);
};

export const addDoc = async (doc) => {
  const res = await couch.post('', doc);
  return res.data;
};
