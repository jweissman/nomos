import { Thing } from "../World"

interface Nothing extends Thing {
    kind: 'nothing'
    isNothing: true
    size: -1
}

export const zed: () => Nothing = () => { return { kind: 'nothing', isNothing: true, size: -1 } }


