import { styled } from 'goober'

export const Time = styled('div')`
	height: 10px;
	border-left: 1px solid var(--secondary);
	touch-action: none;

	${props => props.time.slice(-2) === '00' && `
		border-top: 1px solid var(--secondary);
	`}
	${props => props.time.slice(-2) === '30' && `
		border-top: 1px dotted var(--secondary);
	`}

	${props => (props.selected || (props.mode === 'add' && props.selecting)) && `
		background-color: var(--secondary);
	`};
	${props => props.mode === 'remove' && props.selecting && `
		background-color: initial;
	`};
`;
