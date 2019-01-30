//https://gist.github.com/renaudtertrais/fbb1a78d495bd72b8b318fb7368644e2
export const compose = (...fns) => (...args) => {
    return fns.slice(0, -1).reduceRight((res, fn) => fn(res),
        fns[fns.length - 1].apply(null, args)
    );
};

export const pipe = (f1, ...fns) => (...args) => {
    return fns.reduce((res, fn) => fn(res), f1.apply(null, args));
};

export const pipeWithParam = (f1, param, ...fns) => (...args) => {
    return fns.reduce((res, fn) => fn(res, param), f1.apply(null, args));
};

//https://github.com/pdme/compound/blob/master/src/compound.js
export const compound = (...fns) => (...args) =>
    fns.reduceRight((result, fn) => fn(...[result, ...args.slice(1)]), args[0]);
