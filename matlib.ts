export const egcd: Function = (alpha: number, mod: number) =>
{
    for (let x = 1; x < mod; x++)
        if (((alpha % mod) * (x % mod)) % mod == 1)
            return x;
}

export const isSquare: Function = (n: number) =>
{
    return n > 0 && Math.sqrt(n) % 1 == 0;
}

/*
export const egcd: Function = (m: number, n: number): EGCD_Triplet =>
{
    var a1 = 1;
    var b1 = 0;
    var a  = 0;
    var b  = 1;
    var c  = m;
    var d  = n;
    var q = Math.floor(c/d);
    var r = c % d;
    // such that
    //             a1 m + b2 n = c
    //                 am + bn = d
    // (a1 - qa)m + (b1 - qb)n = r
    while (r > 0) {
        var t = a1;
        a1 = a;
        a = t - q*a; // a1 - qa
        t = b1;
        b1 = b;
        b = t - q*b; // b1 - qb
        c = d;
        d = r;
        q = Math.floor(c/d);
        r = c % d;
    }
    return {
        x: a,
        y: b,
        gcd: d
    };
}

export const gcd: Function = (alpha: number, beta: number): number =>
{
    if (!beta)
        return alpha;

    return gcd(beta, (alpha % beta));
}
*/