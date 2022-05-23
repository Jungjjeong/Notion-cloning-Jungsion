import PostEditPage from './components/PostEditPage.js';
import PostsPage from './components/PostsPage.js';
import { ERROR } from './storage/constants.js';
import { initRouter } from './utils/router.js';

export default function App({ $target }) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const postsPage = new PostsPage({
    $target,
    initialState: [],
  });

  const postEditPage = new PostEditPage({
    $target,
    initialState: {},
    listRendering: () => postsPage.setState(),
  });

  this.route = async () => {
    $target.innerHTML = '';

    const { pathname } = window.location;

    if (pathname === '/') {
      postsPage.setState();
    } else if (pathname.indexOf('/documents') === 0) {
      const [, , _id] = pathname.split('/');
      console.log(pathname);

      await postsPage.setState();
      await postEditPage.setState({ _id });
    } else {
      $target.innerHTML = '<h1>404 NOT FOUND</h1>';
    }
  };

  this.route();
  initRouter(() => this.route());

  window.addEventListener('popstate', () => this.route());
}
