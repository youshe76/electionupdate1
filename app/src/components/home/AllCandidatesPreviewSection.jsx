import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import candidatesData from "../../data/candidates.json";
import provinceData from "../../data/province.json";
import constituencyData from "../../data/constituency.json";
import partyData from "../../data/party.json";
import ConstituencyElectionCard from "../election/ConstituencyElectionCard";
import { districtsForProvince } from "../../utils/geoUtils";

const PREVIEW_COUNT = 6;

export default function AllCandidatesPreviewSection() {
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [appliedProvince, setAppliedProvince] = useState("");
  const [appliedDistrict, setAppliedDistrict] = useState("");

  const candidatesBySlug = useMemo(
    () => new Map(candidatesData.map((c) => [c.slug, c])),
    [],
  );

  const partyByName = useMemo(
    () => new Map(partyData.map((p) => [p.name, p])),
    [],
  );

  const availableDistricts = useMemo(
    () => districtsForProvince(provinceFilter),
    [provinceFilter],
  );

  const appliedProvinceDistrictSlugs = useMemo(() => {
    if (!appliedProvince) {
      return null;
    }
    const provinceEntry = provinceData.find((p) => p.slug === appliedProvince);
    return new Set(provinceEntry?.districts?.map((d) => d.slug) || []);
  }, [appliedProvince]);

  const previewConstituencies = useMemo(() => {
    const filtered = constituencyData.filter((constituency) => {
      if (
        appliedProvinceDistrictSlugs &&
        !appliedProvinceDistrictSlugs.has(constituency.district_slug)
      ) {
        return false;
      }
      if (appliedDistrict && constituency.district_slug !== appliedDistrict) {
        return false;
      }
      return true;
    });
    return filtered.slice(0, PREVIEW_COUNT);
  }, [appliedProvinceDistrictSlugs, appliedDistrict]);

  const handleProvinceChange = (value) => {
    setProvinceFilter(value);
    setDistrictFilter("");
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setAppliedProvince(provinceFilter);
    setAppliedDistrict(districtFilter);
  };

  return (
    <section className="section all-parties-candidates">
      <div className="elc-container">
        <div className="heading-title-wrap flex flex-between flex-wrap flex-middle">
          <h3 className="heading-title">देशभरका उम्मेदवारहरु</h3>
          <div className="flex flex-middle flex-wrap" style={{ gap: "10px" }}>
            <form onSubmit={handleFilterSubmit}>
              <div className="filter-row">
                <div className="select-box">
                  <select
                    className="state select"
                    name="province_id"
                    value={provinceFilter}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                  >
                    <option value="">प्रदेश</option>
                    {provinceData.map((province) => (
                      <option key={province.slug} value={province.slug}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-box">
                  <select
                    name="district_id"
                    className="district select"
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    disabled={!provinceFilter}
                  >
                    <option value="">जिल्ला</option>
                    {availableDistricts.map((district) => (
                      <option key={district.slug} value={district.slug}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-box">
                  <button type="submit" className="btn-submit">
                    <span>खोज्नुहोस</span>
                  </button>
                </div>
              </div>
            </form>
            <Link className="btn" to="/candidates" target="_blank" rel="noopener noreferrer">
              विस्तृत
            </Link>
          </div>
        </div>
        <div className="local__election">
          <div className="candidate--lists dn-grid dn-grid-small">
            {previewConstituencies.length > 0 ? (
              previewConstituencies.map((constituency) => (
                <ConstituencyElectionCard
                  key={constituency.slug}
                  constituency={constituency}
                  candidatesBySlug={candidatesBySlug}
                  partyByName={partyByName}
                />
              ))
            ) : (
              <p>कुनै निर्वाचन क्षेत्र फेला परेन</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
