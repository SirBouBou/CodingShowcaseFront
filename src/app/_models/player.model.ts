export type PlayerType = 'USER' | 'GUEST';

export interface PlayerId {
    type: PlayerType;
    value: string;
}

export interface PlayerIdentity {
    id: PlayerId;
    displayName: string;
}