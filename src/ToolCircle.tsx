import React from 'react';
import { ToolType } from './DrawingPage';

interface Props {
    tool: ToolType;
    onToggle: () => any;
}

export default class ToolCircle extends React.Component<Props, {}> {
    handleClick() {
        this.props.onToggle();
    }

    render() {
        let toolIcon: string = this.props.tool + '.png';

        return (
            <button
                className='item fullSize'
                style={{
                    backgroundImage: 'url(' + toolIcon + ')'
                }}
                onClick={this.handleClick.bind(this)}
            >
            </button>
        );
    }
}