export function buildRoutePath(path) {
    const routePrametersRegex = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(routePrametersRegex, '(?<$1>[a-z0-9\-_]+)')

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

    return pathRegex
}