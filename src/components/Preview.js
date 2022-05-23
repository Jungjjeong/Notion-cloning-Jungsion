import { CLASS } from '../storage/constants.js';

export default function Preview({ $target, initialState }) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const $preview = document.createElement('div');
  $preview.className = CLASS.PREVIEW_DIV;
  $target.appendChild($preview);

  this.state = initialState;

  this.setState = nextState => {
    if (nextState) {
      this.state = nextState;
      this.render();
    }
  };

  this.toggle = () => {
    $preview.classList.toggle(CLASS.TOGGLE);
  };

  const renderRichContent = content => {
    if (!content) return content;

    const richContent = content
      .split('\n')
      .map(line => {
        if (line.indexOf('# ') === 0) {
          return `<h1>${line.substr(2)}</h1>`;
        } else if (line.indexOf('## ') === 0) {
          return `<h2>${line.substr(3)}</h2>`;
        } else if (line.indexOf('### ') === 0) {
          return `<h3>${line.substr(4)}</h3>`;
        } else if (line.indexOf('> ') === 0) {
          return `<blockquote>${line.substr(2)}</blockquote>`;
        } else if (line.indexOf('`') >= 0) {
          const codeIndex = line.indexOf('`');
          return (
            line.substring(0, codeIndex) +
            `<code>${line.substring(codeIndex + 1)}`.replace('`', '</code>')
          );
        } else if (line === '---') {
          return `<hr>`;
        }

        return `${line}`;
      })
      .join('<br>');

    return richContent;
  };

  this.render = () => {
    const { data } = this.state;
    if (!data) return;

    $preview.innerHTML = `
	   <h1>${data.title}</h1><br><hr><br>
	   ${renderRichContent(data.content)}
	  `;
  };

  this.render();
}
