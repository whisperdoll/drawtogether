import React from 'react';

interface Props {
    onSubmit: (server: string) => any
}

interface State {
    server: string;
}

export default class LoginPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            server: '192.168.1.149:5000'
        };

        this.handleServerChange = this.handleServerChange.bind(this);
    }

    handleServerChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({...this.state, server: event.target.value});
    }

    render() {
        return (
            <div className='page loginPage'>
                <h1>welcome,,,</h1>
                <span>Server: </span>
                <input type='text' value={this.state.server} onChange={this.handleServerChange}></input>
                <button onClick={() => this.props.onSubmit(this.state.server)}>Join</button>
            </div>
        );
    }
}