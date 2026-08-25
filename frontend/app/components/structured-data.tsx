export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Roast & Co.",
    "image": "https://roastandco.pk/logo.png",
    "@id": "https://roastandco.pk",
    "url": "https://roastandco.pk",
    "telephone": "+92-300-1234567",
    "priceRange": "Rs. 300 - Rs. 2000",
    "servesCuisine": "Coffee, Desserts, Beverages",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Block 8, Clifton",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "postalCode": "75600",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.8138,
      "longitude": 67.0258
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "23:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2000"
    },
    "sameAs": [
      "https://www.facebook.com/roastandco",
      "https://www.instagram.com/roastandco"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
