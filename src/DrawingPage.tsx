import React from 'react';
import './DrawingPage.scss';
import { socket } from './App';
import { Canvas } from './canvas';
import { Point } from './point';
import ColorCircle from './ColorCircle';
import SizeCircle from './SizeCircle';
import ToolCircle from './ToolCircle';

export type ToolType = 'pencil' | 'eraser';

interface DotData {
    pos: number[];
    size: number;
    color: string;
}

interface LineData {
    from: number[];
    to: number[];
    size: number;
    color: string;
}

interface EraseData {
    from: number[];
    to: number[];
    size: number;
}

interface State {
    color: string,
    size: number,
    tool: ToolType
}

interface Props {
    size: number[]
}

export default class DrawingPage extends React.Component<Props, State> {
    state: State = {
        color: 'black',
        size: 5,
        tool: 'pencil'
    };

    lastWrite = 0;
    writeThrottle = 16;
    _canvas: Canvas | null = null;

    mouseDown(pos: Point) {
        if (this.state.tool === 'pencil') {
            const data : DotData = {
                pos: pos.toArray(),
                size: this.state.size,
                color: this.state.color
            };
    
            socket.write('dot', data);
        }
    }

    mouseMove(pos: Point, lastPos: Point, mouseIsDown: boolean) {
        if (mouseIsDown) {
            const now = Date.now();
            if (true || now - this.lastWrite >= this.writeThrottle) {
                this.lastWrite = now;
                
                switch (this.state.tool) {
                    case 'pencil': {
                        const data : LineData = {
                            from: lastPos.toArray(),
                            to: pos.toArray(),
                            size: this.state.size,
                            color: this.state.color
                        };
            
                        socket.write('line', data);
                        break;
                    }
                    case 'eraser': {
                        const data : EraseData = {
                            from: lastPos.toArray(),
                            to: pos.toArray(),
                            size: this.state.size
                        };
            
                        socket.write('erase', data);
                        break;
                    }
                }
            }
        }
    }

    mouseUp() {
        // pass
    }

    handleData(command: string, _data: any) {
        // console.log(command, _data, canvas, context);

        switch (command) {
            case 'line': {
                const data = _data as LineData;
                this.canvas.drawLine(Point.fromArray(data.from), Point.fromArray(data.to), data.color, data.size);
                break;
            }
            case 'dot': {
                const data = _data as DotData;
                this.canvas.fillCircleInSquare(Point.fromArray(data.pos).minus(new Point(data.size / 2)), data.size, data.color);
                break;
            }
            case 'erase': {
                const data = _data as EraseData;
                this.canvas.drawLine(Point.fromArray(data.from), Point.fromArray(data.to), 'white', data.size);
                break;
            }
            case 'binary': {
                const data = _data as ArrayBuffer;
                const blob = new Blob([data]);
                const image = new Image();
                image.onload = () => {
                    this.canvas.drawImage(image, new Point(0));
                    URL.revokeObjectURL(image.src);
                };
                image.src = URL.createObjectURL(blob);
                break;
            }
            case 'clear': {
                this.canvas.fill('white');
                break;
            }
        }
    }

    get canvas(): Canvas {
        return this._canvas as Canvas;
    }

    componentDidMount() {
        socket.on('data', this.handleData.bind(this));

        (this.refs.canvas as HTMLCanvasElement).addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });
        (this.refs.canvas as HTMLCanvasElement).addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        (this.refs.canvas as HTMLCanvasElement).addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });

        this._canvas = new Canvas({
            canvasElement: this.refs.canvas as HTMLCanvasElement,
            pixelated: false,
            opaque: true,
            size: Point.fromArray(this.props.size)
        });

        this.canvas.context.lineJoin = 'round';
        this.canvas.context.lineCap = 'round';

        this.canvas.addEventListener('mousedown', (pos, e) => {
            this.mouseDown(pos);
        });
        this.canvas.addEventListener('mousemove', (pos, isDown, lastPos) => {
            this.mouseMove(pos, lastPos, isDown);
        });
        this.canvas.addEventListener('mouseup', () => {
            this.mouseUp();
        });

        this.canvas.fill('white');
    }

    handleColorChange(color: string) {
        this.setState({...this.state, color: color});
    }

    handleIncrement() {
        this.setState({...this.state, size: Math.min(100, this.state.size + 1)});
    }

    handleDecrement() {
        this.setState({...this.state, size: Math.max(0, this.state.size - 1)});
    }

    handleChange(value: string) {
        let size: number;

        if (value === "") {
            size = 0;
        } else {
            size = parseInt(value);
        }
        
        if (!isNaN(size)) {
            size = Math.min(100, Math.max(0, size));
            this.setState({...this.state, size: size});
        }
    }

    handleToggleTool() {
        if (this.state.tool === 'eraser') {
            this.setState({...this.state, tool: 'pencil'});
        } else {
            this.setState({...this.state, tool: 'eraser'});
        }
    }

    saveBoard() {
        const link = document.createElement('a');
        link.download = 'board.png';
        link.href = this.canvas.canvas.toDataURL();
        link.click();
    }

    clearBoard() {
        socket.write('clear');
    }

    render() {
        return (
            <div className='page'>
                <div className='menu'>
                    <ColorCircle
                        color={this.state.color}
                        onChange={this.handleColorChange.bind(this)}
                    />
                    <SizeCircle
                        size={this.state.size}
                        onIncrement={this.handleIncrement.bind(this)}
                        onDecrement={this.handleDecrement.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />
                    <ToolCircle
                        tool={this.state.tool}
                        onToggle={this.handleToggleTool.bind(this)}
                    />
                    <button
                        className='item fullSize'
                        onClick={this.saveBoard.bind(this)}
                    >
                        💾
                    </button>
                    <button
                        className='item fullSize'
                        onClick={this.clearBoard.bind(this)}
                    >
                        ⎚
                    </button>
                </div>
                <canvas
                    ref='canvas'
                    width={800}
                    height={600}
                />
            </div>
        );
    }
}