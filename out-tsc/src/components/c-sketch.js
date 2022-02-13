// @ts-nocheck
import { LitElement, html, css } from 'lit';
export class CSketch extends LitElement {
    firstUpdated(_changedProperties) {
        this.build();
    }
    build() {
        var _this = this;
        // Variables for referencing the canvas and 2dcanvas context
        var canvas, ctx;
        // Variables to keep track of the mouse position and left-button status 
        var mouseX, mouseY, mouseDown = 0;
        // Draws a dot at a specific position on the supplied canvas name
        // Parameters are: A canvas context, the x position, the y position, the size of the dot
        function drawDot(ctx, x, y, size) {
            // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
            var r = 0, g = 0, b = 0, a = 255;
            // Select a fill style
            ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
            // Draw a filled circle
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
        // Clear the canvas context using the canvas width and height
        function clearCanvas(canvas, ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Keep track of the mouse button being pressed and draw a dot at current location
        function sketchpad_mouseDown() {
            mouseDown = 1;
            drawDot(ctx, mouseX, mouseY, 12);
        }
        // Keep track of the mouse button being released
        function sketchpad_mouseUp() {
            mouseDown = 0;
        }
        // Keep track of the mouse position and draw a dot if mouse button is currently pressed
        function sketchpad_mouseMove(e) {
            // Update the mouse co-ordinates when moved
            getMousePos(e);
            // Draw a dot if the mouse button is currently being pressed
            if (mouseDown == 1) {
                drawDot(ctx, mouseX, mouseY, 12);
            }
        }
        // Get the current mouse position relative to the top-left of the canvas
        function getMousePos(e) {
            if (!e)
                var e = event;
            if (e.offsetX) {
                mouseX = e.offsetX;
                mouseY = e.offsetY;
            }
            else if (e.layerX) {
                mouseX = e.layerX;
                mouseY = e.layerY;
            }
        }
        // Set-up the canvas and add our event handlers after the page has loaded
        function init() {
            var _a;
            // Get the specific canvas element from the HTML document
            canvas = (_a = _this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('sketchpad');
            // If the browser supports the canvas tag, get the 2d drawing context for this canvas
            if (canvas.getContext)
                ctx = canvas.getContext('2d');
            // Check that we have a valid context to draw on/with before adding event handlers
            if (ctx) {
                canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
                canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
                window.addEventListener('mouseup', sketchpad_mouseUp, false);
            }
        }
        init();
    }
    render() {
        return html `
			<div class="base" part="base">
				<canvas id="sketchpad" height="300" width="400">
				</canvas>
			</div>
    `;
    }
}
CSketch.styles = css `
    :host {
      display: flex;
			position: relative;
    }
		#sketchpadapp {
			/* Prevent nearby text being highlighted when accidentally dragging mouse outside confines of the canvas */
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
		#sketchpad {
			width: 100%;
			height: 100%;
			position:relative; /* Necessary for correct mouse co-ords in Firefox */
		}
  `;
customElements.define('c-sketch', CSketch);
//# sourceMappingURL=c-sketch.js.map