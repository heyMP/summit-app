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
    console.log(this.store.state.event);
  }

  render() {
    return html`
      <c-nav></c-nav>
      <div id="pages">
        <p-init class="${this.store.state.matches('init') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-init>
        <p-default class="${this.store.state.matches('default') ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-default>
        <p-order-color class="${this.store.state.matches({order: 'color'}) ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-color>
        <p-order-frame class="${this.store.state.matches({order: 'frame'}) ? 'active': ''}" ${animate(XstateLitExample.animateOptions)}></p-order-frame>
      </div>
    `;
  }

  public static animateOptions(): AnimateOptions {
    return { properties: ['opacity'] };
  }
}
