import { CLASS, TEXT } from '../storage/constants.js';
import { push } from '../utils/router.js';

export default function Header({ $target }) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const $header = document.createElement('div');
  $header.className = CLASS.HEADER_DIV;
  $target.appendChild($header);

  this.render = () => {
    $header.innerHTML = `
	  <img src="https://user-images.githubusercontent.com/72294509/163410631-70fa3086-191f-4d67-91c9-e343a0590424.png" class=${CLASS.HEADER_IMG}>
	  <h3 class=${CLASS.HEADER_TITLE}>${TEXT.HEADER_TITLE}</h3>
	`;
  };

  this.render();

  $header.addEventListener('click', () => {
    push('/');
  });
}
