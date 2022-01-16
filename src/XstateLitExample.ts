import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { animate } from '@lit-labs/motion';
import type { Options as AnimateOptions } from '@lit-labs/motion';
import { StoreController } from './store';
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

export class XstateLitExample extends LitElement {
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

  protected store;
  constructor() {
    super();
    this.store = new StoreController(this).store;
  }

  public storeUpdated() {
    // console.table({state: this.store.state.value, ...this.store.state.context });
  }

  render() {
    const { orderRef } = this.store.state.context;
    return html`
      <c-nav></c-nav>
      <div id="pages">
        <p-init class="${this.store.state.matches('init') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-init>
        <p-default class="${this.store.state.matches('default') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-default>

        ${orderRef ? html`
          <p-order-color class="${orderRef.state.matches('color') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-color>
          <p-order-frame class="${orderRef.state.matches('frame') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-frame>
          <p-order-bake class="${orderRef.state.matches('bake') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-bake>
          <p-order-seat class="${orderRef.state.matches('seat') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-seat>
          <p-order-wheels class="${orderRef.state.matches('wheels') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-wheels>
          <p-order-handles class="${orderRef.state.matches('handles') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-handles>
          <p-order-shipit class="${orderRef.state.matches('shipit') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-shipit>
        ` : ''}
      </div>
    `;
  }

  public static animateOptions(): AnimateOptions {
    return { properties: ['opacity'] };
  }
}
