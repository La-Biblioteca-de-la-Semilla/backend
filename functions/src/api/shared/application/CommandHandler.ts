export interface CommandHandler<TCommand, TReturn> {
    handle(command: TCommand): Promise<TReturn>;
}