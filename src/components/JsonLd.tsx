export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Cabbie Training",
    description:
      "Accredited Passenger Assistance Training (PAT) for taxi and private hire drivers across Essex.",
    url: "https://cabbietraining.co.uk",
    telephone: "07739320050",
    email: "info@cabbietraining.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cottis House, Locks Hills, South Street",
      addressLocality: "Rochford",
      addressRegion: "Essex",
      postalCode: "SS4 1BB",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.5819,
      longitude: 0.7073,
    },
    openingHours: "Mo-Sa 08:00-18:00",
    priceRange: "£65-£75",
    image: "https://cabbietraining.co.uk/og-image.jpg",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
