import { css } from 'lit';
export const tokens = Object.freeze({
    'color': {
        prop: css `--color`,
        value: css `#6a6e72`
    },
    'navHeight': {
        prop: css `--nav-height`,
        value: css `135px`
    },
    'contentMaxWidth': {
        prop: css `--content-max-width`,
        value: css `990px`
    }
});
export function variable(name) {
    const { prop, value } = tokens[name];
    return css `var(${prop}, ${value})`;
}
;
//# sourceMappingURL=globals.js.map