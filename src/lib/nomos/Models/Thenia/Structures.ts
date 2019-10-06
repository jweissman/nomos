import { Thing } from "../../../ea/World"

interface Nothing extends Thing {
    kind: 'nothing'
    isNothing: true
    size: -1
}

export const zed: () => Nothing = () => { return { kind: 'nothing', name: 'nonesuch', isNothing: true, size: -1 } }


