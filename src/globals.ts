import { css } from 'lit';
import type { CSSResult } from 'lit';

export type VariableName =
	'navHeight'

export interface Token {
	prop: CSSResult;
	value: CSSResult;
}

export const tokens: Record<VariableName, Token> = Object.freeze({
	'navHeight': {
		prop: css`--nav-height`,
		value: css`190px`
	}
});

export function variable(name: VariableName): CSSResult {
	const { prop, value } = tokens[name];
	return css`var(${prop}, ${value})`;
};