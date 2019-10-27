import React from 'react';
import './App.css';
import LoginPage from './LoginPage';
import { Socket } from './socket';
import DrawingPage from './DrawingPage';

export const socket = new Socket();

interface State {
    connected: boolean,
    size: number[]
}

export default class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            connected: false,
            size: []
        };

        socket.on('data', this.handleData.bind(this));
        socket.on('close', this.handleClose.bind(this));
    }

    handleClose() {
        this.setState({...this.state, connected: false});
    }

    handleData(command: string, data: any) {
        switch (command) {
            case 'hi':
                socket.write('join');
                break;
            case 'join':
                console.log('successfully joined the server!');
                this.setState({...this.state, connected: true, size: data.size});
                break;
        }
    }

    handleSubmit(server: string) {
        console.log('connecting to server: ' + server);
        socket.connect(server);
    }

    render() {
        const pageToRender = !this.state.connected ?
            <LoginPage
                onSubmit={this.handleSubmit}
            /> :
            <DrawingPage
                size={this.state.size}
            />


        return (
            <div className='App'>
                {pageToRender}
            </div>
        );
    }
}