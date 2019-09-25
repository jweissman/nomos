export const assertNever = (it: never) => {
    throw new Error("Unexpected object: " + it)
}

