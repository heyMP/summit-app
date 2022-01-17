import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { animate } from '@lit-labs/motion';
import type { Options as AnimateOptions } from '@lit-labs/motion';
import { StoreController, StoreBase } from './store';
import { tokens } from './globals.js';
import './components/c-nav.js';
import './pages/p-init.js';
import './pages/p-default.js';
import './pages/p-order-color.js';
import './pages/p-order-frame.js';
import './pages/p-order-bake.js';
import './pages/p-order-seat.js';
import './pages/p-order-wheels.js';
import './pages/p-order-handles.js';
import './pages/p-order-shipit.js';

export class BikeFactory extends StoreBase {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100vw;
      height: 100vh;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    body {
      padding: 0;
      margin: 0;
      width: 100vw;
      height: 100vh;
    }

    #pages {
      position: relative;
    }

    #pages > * {
      opacity: 0;
      position: absolute;
      pointer-events: none;
    }

    #pages > *:is(.active) {
      opacity: 1;
      pointer-events: all;
    }
  `;

  render() {
    return html`
      <c-nav></c-nav>
      <div id="pages">
        <p-init class="${this.store.state.matches('init') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-init>
        <p-default class="${this.store.state.matches('default') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-default>

        ${this.order ? html`
          <p-order-color class="${this.order.state.matches('color') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-order-color>
          <p-order-frame class="${this.order.state.matches('frame') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-order-frame>
          <p-order-bake class="${this.order.state.matches('bake') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-order-bake>
          <p-order-seat class="${this.order.state.matches('seat') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-order-seat>
          <p-order-wheels class="${this.order.state.matches('wheels') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-order-wheels>
          <p-order-handles class="${this.order.state.matches('handles') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-order-handles>
          <p-order-shipit class="${this.order.state.matches('shipit') ? 'active': ''}" ${animate(BikeFactory.animateOptions)}></p-order-shipit>
        ` : ''}
      </div>
    `;
  }

  public static animateOptions(): AnimateOptions {
    return { properties: ['opacity'] };
  }
}
