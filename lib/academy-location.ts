/** Darse-Quran office on Google Maps (Jammu & Kashmir). */
export const ACADEMY_LOCATION = {
  name: "DARSE-QURAN",
  label: "DARSE-QURAN, Jammu & Kashmir",
  mapsUrl: "https://maps.app.goo.gl/7kUvxhkrDq1Z22AUA",
  latitude: 34.063839,
  longitude: 74.4468766,
  zoom: 17,
} as const;

export function getAcademyLocationEmbedUrl() {
  const { latitude, longitude, zoom } = ACADEMY_LOCATION;
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&hl=en&output=embed`;
}
