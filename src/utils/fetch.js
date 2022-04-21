import { request } from './api.js';

export const fetchList = async () => {
  const posts = await request('/documents', {
    method: 'GET',
  });

  return posts;
};

export const fetchNewPost = async post => {
  const newPost = await request('/documents', {
    method: 'POST',
    body: JSON.stringify(post),
  });

  return newPost;
};

export const fetchDeletePost = async id => {
  await request(`/documents/${id}`, {
    method: 'DELETE',
  });
};

export const fetchUpdatePost = async post => {
  await request(`/documents/${post.id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  });
};

export const fetchPost = async id => {
  const post = await request(`/documents/${id}`);

  return post;
};
