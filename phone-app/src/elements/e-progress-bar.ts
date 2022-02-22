import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from '../global.css.js';
import { variable } from '../globals.js';
import { StoreBase, StoreSubscriptionController } from '../store.js';

export class EProgressBar extends LitElement {
  static styles = [styles, css`
		:host {
			display: inline-block;
		}
  `];

  render() {
    return html`
			<div class="base" part="base">
			</div>
    `;
  }
}

customElements.define('e-progress-bar', EProgressBar);
