import {BuildGetUrlType, BuildMixGetUrlType} from "@/d.ts/utils/request";


const buildParamUrl: BuildGetUrlType = (baseUrl, params) => {
    if (params) {
        const serializedParams = Object.entries(params)
            .map(([key, val]) => {
                if (val === null || typeof val === 'undefined') {
                    return '';
                }

                const adjustedKey = Array.isArray(val) ? key + '[]' : key;
                const adjustedVal = Array.isArray(val) ? val : [val];

                return adjustedVal.map((v) => encodeURIComponent(adjustedKey) + '=' + encodeURIComponent(v)).join('&');
            })
            .filter(Boolean)
            .join('&');

        if (serializedParams) {
            baseUrl += (baseUrl.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }
    }

    return baseUrl;
};


let buildPathUrl: BuildGetUrlType = (url, req) => {
    if (req == null) return url;
    req.forEach((v: string | number) => {
        url += ("/" + v);
    });
    return url;
};

let buildMixUrl: BuildMixGetUrlType = (url, req) => {
    if (req == null) return url;
    if (req.param == null) return buildPathUrl(url, req.path);
    if (req.path == null) return buildParamUrl(url, req.param);
    return buildParamUrl(
        buildPathUrl(url, req.path),
        req.param
    );
}

export default [buildParamUrl, buildPathUrl, buildMixUrl];