import { EventClass } from './eventclass';

type SocketDataObject =
{
    command: string,
    token : string,
    data: any
};

export class Socket extends EventClass
{
    private socket : WebSocket | null = null;

    constructor()
    {
        super(
            'data',
            'close',
            'binary'
        );
    }

    public connect(ip : string) : void
    {
        this.socket = new WebSocket('ws://' + ip);

        this.socket.addEventListener('message', (event : MessageEvent) =>
        {
            if (typeof(event.data) === "string") {
                let obj : SocketDataObject = JSON.parse(event.data);
                this.emitEvent('data', obj.command, obj.data);
            } else {
                this.emitEvent('data', 'binary', event.data);
            }
        });

        this.socket.addEventListener('close', () =>
        {
            this.emitEvent('close');
        });

        this.socket.addEventListener('error', () =>
        {
            this.emitEvent('close');
        });
    }

    public write(command : string, data : any = null)
    {
        if (this.socket)
        {
            let toSend =
            {
                command: command,
                data: data
            };
    
            this.socket.send(JSON.stringify(toSend));
        }
    }
}