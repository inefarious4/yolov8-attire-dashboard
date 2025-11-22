export interface AttireReading {
    id: number;
    attireCompleteness: {
        coat: boolean;
        shoes: boolean;
        gloves: boolean;
    };
    dateCaptured: string;
}

export interface NewDataset {
    file: File;
    description: string;
}