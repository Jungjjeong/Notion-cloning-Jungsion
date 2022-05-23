import { CLASS, TEXT } from '../storage/constants.js';

export default function PostList({
  $target,
  initialState,
  onCreateSubPost,
  onRemove,
  onEdit,
}) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const $list = document.createElement('div');
  $list.className = CLASS.LIST_DIV;
  $target.appendChild($list);

  this.state = initialState;

  this.setState = nextState => {
    if (nextState) {
      this.state = nextState;
      this.render();
    }
  };

  const renderDocuments = ({ title, _id, documents }, arr) => {
    arr.push(
      `<li data-id=${_id}>
      <span class=${CLASS.POST_TITLE}>▶ ${title}</span>
      <button class=${CLASS.SUB_POST_BTN}>+</button>
      <button class=${CLASS.REMOVE_BTN}>-</button>
      </li>`,
    );
    if (documents.length !== 0) {
      arr.push('<ul>');

      for (let d of documents) {
        const { title, _id, documents } = d;
        renderDocuments({ title, _id, documents }, arr);
      }
      arr.push('</ul>');
    }

    return arr;
  };

  this.render = () => {
    const { data } = this.state;

    $list.innerHTML = `
    <p class=${CLASS.LIST_TITLE}>${TEXT.LIST_TITLE}</p>
	  <ul>
	    ${data
        .map(({ title, _id, documents }) =>
          renderDocuments({ title, _id, documents }, []).join(''),
        )
        .join('')}  
	  </ul>`;
  };

  $list.addEventListener('click', e => {
    const $li = e.target.closest('li');
    if ($li) {
      const { id } = $li.dataset;

      if (e.target.className === CLASS.SUB_POST_BTN) {
        onCreateSubPost(id);
      } else if (e.target.className === CLASS.REMOVE_BTN) {
        onRemove(id);
      } else {
        onEdit(id);
      }
    }
  });
}
