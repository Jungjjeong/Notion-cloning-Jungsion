import Editor from './Editor.js';
import Preview from './Preview.js';
import ToggleButton from './ToggleButton.js';
import { fetchPost, updatePost } from '../utils/api.js';
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

      const { data } = post;
      const postBody = {
        content: data.content,
        title: data.title,
      };

      timer = setTimeout(async () => {
        await updatePost(data._id, postBody);
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
    POST_LOCAL_SAVE_KEY = `temp-post-${this.state._id}`;

    const post = await fetchLocalStorage();

    await listRendering();
    editor.setState(post);
    preview.setState(post);

    await this.render();
  };

  const fetchLocalStorage = async () => {
    const post = await fetchPost(this.state._id);
    const { updatedAt } = post.data;
    const localPost = getItem(POST_LOCAL_SAVE_KEY, {
      data: {
        title: '',
        content: '',
        parent: null,
      },
    });

    if (localPost.tempSaveData && localPost.tempSaveData > updatedAt) {
      if (confirm(TEXT.STORAGE_CONFIRM)) {
        const updatedPost = {
          ...post,
          data: {
            ...post.data,
            title: localPost.data.title,
            content: localPost.data.content,
          },
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
