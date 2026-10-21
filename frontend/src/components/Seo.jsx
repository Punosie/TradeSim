// React 19 hoists <title>, <meta> and <link> rendered anywhere into <head>.
// Defaults for crawlers that don't run JavaScript live in index.html.

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://tradesim-shubhabha.vercel.app").replace(/\/$/, "");
const SITE_NAME = "TradeSim";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const Seo = ({ title, description, path = "/", image = DEFAULT_IMAGE, noindex = false }) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Real-Time Crypto Trade Simulator`;
    const url = `${SITE_URL}${path}`;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noindex
                ? <meta name="robots" content="noindex, nofollow" />
                : <link rel="canonical" href={url} />}

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </>
    );
};

export default Seo;
