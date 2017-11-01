const compose = (...args) => x => args.reduceRight((value, item) => item(value), x)


// const f = x => x + 2
// const g = x => x * 2
// compose(g, f)(2)
export default compose