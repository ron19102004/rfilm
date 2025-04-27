import React, { Fragment } from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogLocale?: string;
  canonicalUrl?: string;
}

interface HelmetSEOProps {
  children: React.ReactNode;
  seo?: SEOProps;
}

const defaultSEO: SEOProps = {
  title: "R-Film - Xem phim online miễn phí chất lượng cao",
  description: "R-Film là trang web xem phim online miễn phí với chất lượng cao, phụ đề tiếng Việt, cập nhật phim mới nhất. Xem phim online không giới hạn, không quảng cáo, tốc độ tải nhanh.",
  keywords: "xem phim online, phim mới, phim hay, phim vietsub, phim thuyết minh, phim bộ, phim lẻ, phim hoạt hình, phim chiếu rạp, xem phim miễn phí",
  author: "Ronial",
  ogTitle: "R-Film - Xem phim online miễn phí chất lượng cao",
  ogDescription: "R-Film là trang web xem phim online miễn phí với chất lượng cao, phụ đề tiếng Việt, cập nhật phim mới nhất. Xem phim online không giới hạn, không quảng cáo, tốc độ tải nhanh.",
  ogImage: "/filmlogov3.png",
  ogType: "website",
  ogUrl: "https://rfilm.netlify.app/",
  ogSiteName: "R-Film",
  ogLocale: "vi_VN",
  canonicalUrl: "https://rfilm.netlify.app"
};

const HelmetSEO: React.FC<HelmetSEOProps> = ({ children, seo = {} }) => {
  const {
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    author = defaultSEO.author,
    ogTitle = defaultSEO.ogTitle,
    ogDescription = defaultSEO.ogDescription,
    ogImage = defaultSEO.ogImage,
    ogType = defaultSEO.ogType,
    ogUrl = defaultSEO.ogUrl,
    ogSiteName = defaultSEO.ogSiteName,
    ogLocale = defaultSEO.ogLocale,
    canonicalUrl = defaultSEO.canonicalUrl
  } = seo;

  return (
    <Fragment>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Vietnamese" />
        <meta name="revisit-after" content="1 days" />
        <meta name="generator" content="R-Film" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content={ogSiteName} />
        <meta property="og:locale" content={ogLocale} />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="application-name" content={title} />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content={ogImage} />
      </Helmet>
      {children}
    </Fragment>
  );
};

export default HelmetSEO;
