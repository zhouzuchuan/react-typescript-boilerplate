export const console = window.console

/**
 * 加载所有
 *
 * @param {*} context
 */
export const requireAll = (context: any) => context.keys().map(context)
