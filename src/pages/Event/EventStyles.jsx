import { styled } from 'goober'


export const LoginForm = styled('form')`
	display: grid;
	grid-template-columns: 1fr 1fr 100px;
	align-items: flex-end;
	grid-gap: 18px;

	@media (max-width: 500px) {
		grid-template-columns: 1fr 1fr;
	}
	@media (max-width: 400px) {
		grid-template-columns: 1fr;
	}
`;

export const LoginSection = styled('section')`
	background-color: 30240F;
	padding: 10px 0;
`;

export const Info = styled('p')`
	margin: 18px 0;
	opacity: .6;
	font-size: 12px;
`;

export const ShareInfo = styled('p')`
	margin: 6px 0;
	text-align: center;
	font-size: 15px;
`;

export const Tabs = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 30px 0 20px;
`;

export const Tab = styled('a')`
	user-select: none;
	text-decoration: none;
	display: block;
	color: #fff;
	padding: 8px 18px;
	border: 1px solid var(--secondary);
	margin: 0 4px;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;

	${props => props.selected && `
		color: #000;
		background-color: var(--secondary);
		border-color: var(--secondary);
	`}

	${props => props.disabled && `
		opacity: .5;
		cursor: not-allowed;
	`}
`;
