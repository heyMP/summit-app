import { LitElement, html, css } from 'lit';
import { StoreController } from './store.js';

/**
 * Use this class to access store.
 */
export class StoreBase extends LitElement {
  protected store;
  constructor() {
    super();
    this.store = new StoreController(this).store;
  }
}