import React from 'react';

interface Props {
    onIncrement: () => any;
    onDecrement: () => any;
    onChange: (value: string) => any;
    size: number;
}

interface State {
}

export default class SizeCircle extends React.Component<Props, State> {
    componentDidMount() {
    }

    handleIncrement() {
        this.props.onIncrement();
    }

    handleDecrement() {
        this.props.onDecrement();
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div className='item'>
            <button
                className='fullSize'
                onClick={this.handleIncrement.bind(this)}
            >
                +
            </button>
            <input
                value={this.props.size.toString()}
                onChange={this.handleChange.bind(this)}
            />
            <button
                className='fullSize'
                onClick={this.handleDecrement.bind(this)}
            >
                -
            </button>
            </div>
        );
    }
}