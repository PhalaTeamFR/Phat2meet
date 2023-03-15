import { styled } from 'goober'

export const Wrapper = styled('div')`
	overflow-x: auto;
	margin: 20px 0;
`;

export const Container = styled('div')`
	display: inline-flex;
	box-sizing: border-box;
  min-width: 100%;
	align-items: flex-end;
	padding: 0 calc(calc(100% - 600px) / 2);

	@media (max-width: 660px) {
		padding: 0 30px;
	}
`;


export const Date = styled('div')`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	width: 60px;
	min-width: 60px;

	& .time:last-of-type {
		border-bottom: 1px solid var(--secondary);
	}
	&.last > .time {
		border-right: 1px solid var(--secondary);
	}
`;

export const DateLabel = styled('label')`
	display: block;
	font-size: 12px;
	text-align: center;
	user-select: none;
`;

export const DayLabel = styled('label')`
	display: block;
	font-size: 15px;
	text-align: center;
	user-select: none;
`;

export const Time = styled('div')`
	height: 10px;
	border-left: 1px solid var(--secondary);

	${props => props.time.slice(-2) === '00' && `
		border-top: 1px solid var(--secondary);
	`}
	${props => props.time.slice(-2) === '30' && `
		border-top: 1px dotted var(--secondary);
	`}

	background-color: var(--secondary);
  background-color: ${props => `#c5ff47${Math.round((props.people.length / (props.totalpeople)) * 255).toString(16)}`};
`;

export const Spacer = styled('div')`
	width: 12px;
	flex-shrink: 0;
`;

export const Tooltip = styled('div')`
	position: fixed;
	top: ${props => props.y + 6}px;
	left: ${props => props.x + 6}px;
	border: 1px solid var(--secondary);
	border-radius: 3px;
	padding: 4px 8px;
	background-color: black;
	max-width: 200px;
`;

export const TooltipTitle = styled('span')`
	font-size: 15px;
	display: block;
	font-weight: 700;
`;

export const TooltipDate = styled('span')`
	font-size: 13px;
	display: block;
	opacity: .7;
	font-weight: 700;
`;

export const TooltipContent = styled('span')`
	font-size: 13px;
	display: block;
`;

export const TimeLabels = styled('div')`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	width: 40px;
	padding-right: 6px;
`;

export const TimeSpace = styled('div')`
	height: 10px;
	position: relative;

	${props => props.time.slice(-2) === '00' && `
		border-top: 1px solid transparent;
	`}
	${props => props.time.slice(-2) === '30' && `
		border-top: 1px dotted transparent;
	`}
`;

export const TimeLabel = styled('label')`
	display: block;
	position: absolute;
	top: -.7em;
	font-size: 12px;
	text-align: right;
	user-select: none;
	width: 100%;
`;
