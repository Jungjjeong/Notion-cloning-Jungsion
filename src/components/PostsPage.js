import PostList from './PostList.js';
import Header from './Header.js';
import { fetchList, fetchNewPost, fetchDeletePost } from '../utils/fetch.js';
import { push } from '../utils/router.js';
import { CLASS, TEXT } from '../storage/constants.js';

export default function PostsPage({ $target, initialState }) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const $page = document.createElement('div');
  const $button = document.createElement('button');
  $page.className = CLASS.LIST_PAGE_DIV;
  $button.className = CLASS.ROOT_POST_BTN;
  $button.textContent = TEXT.ROOT_POST_BTN;

  this.state = initialState;

  this.setState = async () => {
    this.state = await fetchList();
    postList.setState(this.state);
    this.render();
  };

  new Header({
    $target: $page,
  });

  const postList = new PostList({
    $target: $page,
    initialState: [],
    onCreateSubPost: async parentId => {
      const post = {
        title: 'Untitled',
        parent: parentId,
      };
      const newPost = await fetchNewPost(post);
      push(`/documents/${newPost.id}`);
    },
    onRemove: async id => {
      if (confirm(TEXT.REMOVE_CONFIRM)) {
        await fetchDeletePost(id);
        push('/');
      }
    },
    onEdit: id => {
      push(`/documents/${id}`);
    },
  });

  this.render = async () => {
    $target.appendChild($page);
    $target.appendChild($button);
  };

  $button.addEventListener('click', async e => {
    if (e.target.className === CLASS.ROOT_POST_BTN) {
      const post = {
        title: 'Untitled',
        parent: null,
      };
      const newPost = await fetchNewPost(post);
      push(`/documents/${newPost.id}`);
    }
  });
}
