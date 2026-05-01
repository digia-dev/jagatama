import { Helmet } from "react-helmet-async";

const SEOStructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PT Jagasura Agrotama Indonesia",
    "url": "https://jagatama.id",
    "logo": "https://jagatama.id/logotp.png",
    "sameAs": [
      "https://instagram.com/jagasura_agrotama",
      "https://youtube.com/@jagasura"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Gili Turi, Dukuhwaru",
      "addressLocality": "Tegal",
      "addressRegion": "Jawa Tengah",
      "postalCode": "52451",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-857-4385-5637",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": "Indonesian"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AgricultureService",
    "name": "Jagasura Agrotama",
    "image": "https://jagatama.id/produk/Gambar%20Latar/Latar%202.jpg",
    "@id": "https://jagatama.id",
    "url": "https://jagatama.id",
    "telephone": "+6285743855637",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Gili Turi, Dukuhwaru",
      "addressLocality": "Tegal",
      "addressRegion": "Jawa Tengah",
      "postalCode": "52451",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.9856,
      "longitude": 109.1147
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default SEOStructuredData;
