import { Describable, Investigable, Seek } from "./Values";

export class Wonder implements Describable, Investigable {
    public location: [number, number] = [-1, -1];
    public clueLocations: Array<[number, number]> = [];
    constructor(public name: string, public description: string) {}
}

export const seekWonder: (w: Wonder) => Seek<Wonder> = (wonder: Wonder) => {
    return { kind: "seek", goal: wonder };
};

