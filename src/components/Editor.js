import { CLASS, TEXT } from '../storage/constants.js';

export default function Editor({
  $target,
  initialState,
  onEditing,
  renderSubPost,
}) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const $editor = document.createElement('div');
  const $subPostList = document.createElement('div');
  $editor.className = CLASS.EDIT_DIV;
  $subPostList.className = CLASS.SUB_LIST;
  $target.appendChild($editor);
  $target.appendChild($subPostList);

  this.state = initialState;

  this.setState = nextState => {
    if (nextState) {
      this.state = nextState;
      this.render();
    }
  };

  const renderDocuments = ({ documents }, arr) => {
    if (documents.length !== 0) {
      arr.push('<ul>');
      for (let d of documents) {
        const { title, id, documents } = d;
        arr.push(
          `<li data-id=${id}><span class=${CLASS.SUB_TITLE}>${title}</span></li>`,
        );
        renderDocuments({ documents }, arr);
      }
      arr.push('</ul>');
    }

    return arr;
  };

  this.render = () => {
    const { title, content, documents } = this.state;
    const subLists = renderDocuments({ documents }, []).join('');

    $editor.innerHTML = `
	   <input class=${CLASS.EDIT_TITLE} type="text" value="${title}" placeholder ="Untitled"/>
	   <textarea class=${CLASS.EDIT_CONTENT} placeholder ="Content">${content}</textarea> 
	  `;

    $subPostList.innerHTML = `
    <button class=${CLASS.SUB_LIST_TOGGLE}>▼</button>
    <span class=${CLASS.SUB_LIST_TITLE}>${TEXT.SUB_LIST_TITLE}</span>
    <div class=${CLASS.SUB_LIST_DIV}>${
      subLists === ''
        ? `<p class=${CLASS.SUB_EMPTY}>${TEXT.SUB_EMPTY}</p>`
        : subLists
    }</div>
    `;
  };

  $subPostList.addEventListener('click', e => {
    if (e.target.className === CLASS.SUB_LIST_TOGGLE) {
      const $subLists = document.querySelector(`.${CLASS.SUB_LIST_DIV}`);
      $subLists.classList.toggle(CLASS.TOGGLE);
    }
    if (e.target.className === CLASS.SUB_TITLE) {
      const $li = e.target.closest('li');
      renderSubPost($li.dataset.id);
    }
  });

  $editor.addEventListener('keyup', () => {
    const title = $editor.querySelector(`.${CLASS.EDIT_TITLE}`).value;
    const content = $editor.querySelector(`.${CLASS.EDIT_CONTENT}`).value;

    const nextState = {
      ...this.state,
      title: title,
      content: content,
    };

    this.state = nextState;
    onEditing(this.state);
  });
}
