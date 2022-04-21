import Editor from './Editor.js';
import Preview from './Preview.js';
import ToggleButton from './ToggleButton.js';
import { fetchPost, fetchUpdatePost } from '../utils/fetch.js';
import { getItem, setItem } from '../utils/storage.js';
import { CLASS, ERROR, TEXT } from '../storage/constants.js';

export default function PostEditPage({ $target, initialState, listRendering }) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const $page = document.createElement('div');
  $page.className = CLASS.EDIT_PAGE_DIV;

  this.state = initialState;

  let POST_LOCAL_SAVE_KEY = `temp-post-${this.state.postId}`;
  let timer = null;

  const editor = new Editor({
    $target: $page,
    initialState: {},
    onEditing: post => {
      if (timer !== null) clearTimeout(timer);

      preview.setState(post);
      setItem(POST_LOCAL_SAVE_KEY, {
        ...post,
        tempSaveData: new Date(),
      });

      timer = setTimeout(async () => {
        await fetchUpdatePost(post);
        await listRendering();
      }, 1500);
    },
    renderSubPost: id => {
      this.setState({ id });
      history.replaceState(null, null, `/documents/${id}`);
    },
  });

  const toggleButton = new ToggleButton({
    $target: $page,
    initialState: false,
    onToggle: toggleState => {
      $page.classList.toggle(CLASS.TOGGLE);
      preview.toggle();
      toggleButton.setState(!toggleState);
    },
  });

  const preview = new Preview({
    $target: $page,
    initialState: {},
  });

  this.setState = async nextState => {
    this.state = nextState;
    POST_LOCAL_SAVE_KEY = `temp-post-${this.state.id}`;

    await fetchUpdatePost(this.state);
    const post = await fetchLocalStorage();

    await listRendering();
    editor.setState(post);
    preview.setState(post);

    await this.render();
  };

  const fetchLocalStorage = async () => {
    const post = fetchPost(this.state.id);
    const localPost = getItem(POST_LOCAL_SAVE_KEY, {
      title: '',
      content: '',
      parent: null,
    });

    if (localPost.tempSaveData && localPost.tempSaveData > post.updatedAt) {
      if (confirm(TEXT.STORAGE_CONFIRM)) {
        const updatedPost = {
          ...post,
          title: localPost.title,
          content: localPost.content,
        };

        return updatedPost;
      }
    }

    return post;
  };

  this.render = async () => {
    $target.appendChild($page);
  };
}
