interface SiteConfigInterface {
    tokenHeader: {
        AccessToken: string;
        RefreshToken: string;
    }
}

const siteConfig: SiteConfigInterface = {
    tokenHeader: {
        AccessToken: "AccessToken",
        RefreshToken: "RefreshToken"
    }
}

export {siteConfig};