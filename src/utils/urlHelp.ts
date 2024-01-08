import {BuildGetUrlType, BuildMixGetUrlType} from "@/d.ts/utils/request";


let buildParamUrl: BuildGetUrlType = (baseUrl, req) => {
    if (req == null) return baseUrl;

    let url = baseUrl + "?";
    let propertyList = Object.keys(req);

    for (let i = 0; i < propertyList.length; i++) {
        const propertyName = propertyList[i];
        const propertyValue = req[propertyName];

        // 检查属性值是否为 null
        if (propertyValue !== null && propertyValue !== undefined) {
            url += propertyName + "=" + propertyValue;
            // 检查是否是最后一个属性
            if (i !== propertyList.length - 1 && req[propertyList[i + 1]] !== null && req[propertyList[i + 1]] !== undefined) {
                url += "&";
            }
        }
    }
    return url;
};


let buildPathUrl: BuildGetUrlType = (url, req) => {
    if (req == null) return url;
    req.forEach((v: string | number) => {
        url += ("/" + v);
    });
    return url;
};

let buildMixUrl: BuildMixGetUrlType = (url, req) => {
    if(req == null) return url;
    if(req.param == null) return buildPathUrl(url, req.path);
    if(req.path == null) return buildParamUrl(url, req.param);
    return buildParamUrl(
        buildPathUrl(url, req.path),
        req.param
    );
}

export default [buildParamUrl, buildPathUrl, buildMixUrl];