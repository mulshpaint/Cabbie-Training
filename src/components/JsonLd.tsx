export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Cabbie Training",
    description:
      "Accredited Passenger Assistance Training (PAT) for taxi and private hire drivers. In-person, hands-on training delivered in partnership with Total Training UK. RoSPA assured driver training element.",
    url: "https://cabbietraining.co.uk",
    telephone: "07739320050",
    email: "info@cabbietraining.co.uk",

    founder: {
      "@type": "Person",
      name: "Wendy Clarke",
      jobTitle: "Lead PAT Instructor",
      description:
        "Licensed taxi driver since 2000 with 16 years as a disability driver. Delivering Disability Awareness and Passenger Assistance Training since 2012.",
    },
    openingHours: "Mo-Sa 08:00-18:00",
    priceRange: "£75",
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
