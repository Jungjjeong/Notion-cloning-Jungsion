import { CLASS, TEXT } from '../storage/constants.js';

export default function ToggleButton({ $target, initialState, onToggle }) {
  if (!new.target) {
    throw ERROR.NEW;
  }

  const $toggleBtn = document.createElement('button');
  $toggleBtn.className = CLASS.TOGGLE_FALSE;
  $target.append($toggleBtn);

  this.state = initialState;

  this.setState = nextState => {
    if (nextState) {
      this.state = nextState;
      if (this.state) {
        $toggleBtn.className = CLASS.TOGGLE_TRUE;
        return;
      }

      $toggleBtn.className = CLASS.TOGGLE_FALSE;
    }
  };

  this.render = () => {
    $toggleBtn.textContent = TEXT.TOGGLE;
  };

  $toggleBtn.addEventListener('click', () => {
    onToggle(this.state);
  });

  this.render();
}
