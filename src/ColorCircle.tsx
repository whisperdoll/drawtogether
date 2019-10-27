import React from 'react';

interface Props {
    color: string,
    onChange: (color: string) => any
}

interface State {
}

export default class ColorCircle extends React.Component<Props, State> {
    componentDidMount() {
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div className='item'>
                <label>
                    <div
                        className='fullSize'
                        style={{
                            backgroundColor: this.props.color
                        }}
                    />
                    <input
                        type='color'
                        style={{
                            display: 'none'
                        }}
                        onChange={this.handleChange.bind(this)}
                        value={this.props.color}
                    />
                </label>
            </div>
        );
    }
}