import provinceData from "../data/province.json";
import districtData from "../data/district.json";

export const cleanRouteSlug = (slug = "") => slug?.replace(/\.html$/i, "") ?? "";

export const provinceRouteSlug = (provinceSlug = "") =>
  provinceSlug.replace(/-province$/, "");

export const districtsForProvince = (provinceSlug) => {
  const provinceEntry = provinceData.find((p) => p.slug === provinceSlug);
  if (!provinceEntry?.districts) {
    return [];
  }
  return provinceEntry.districts.map((district) => {
    const full = districtData.find((d) => d.slug === district.slug);
    return { slug: district.slug, name: full?.name || district.slug };
  });
};

export { provinceData, districtData };
