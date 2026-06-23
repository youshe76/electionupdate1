import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import candidatesData from "../../public/data/candidates.json";
import provinceData from "../../public/data/province.json";
import districtData from "../../public/data/district.json";
import constituencyData from "../../public/data/constituency.json";
import partyData from "../../public/data/party.json";
import manifestoData from "../../public/data/manifesto.json";
import hotSeatsData from "../../public/data/hot-seats.json";
import voteDifferenceData from "../../public/data/vote-difference.json";
import { MainLayout } from "../layouts/MainLayout";
import ConstituencyElectionCard from "../components/election/ConstituencyElectionCard";
import { toNepaliNumber } from "../utils";
import { districtsForProvince, provinceRouteSlug, cleanRouteSlug } from "../utils/geoUtils";
import { fixImageUrl } from "../utils/imageUtils";
import { getManifestoImage } from "../app/config/constants";

export default function Candidates() {
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

  const filteredConstituencies = useMemo(() => {
    return constituencyData.filter((constituency) => {
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

  const filterBar = (
    <div className="heading-title-wrap flex flex-between flex-wrap flex-middle">
      <form onSubmit={handleFilterSubmit}>
        <div className="filter-row">
          <div className="select-box">
            <select
              className="state select"
              name="province_id"
              id="province_id"
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
              id="district_id"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
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
    </div>
  );

  return (
    <MainLayout title="उम्मेदवारहरु" headerRight={filterBar}>
      <div className="local__election">
        <div className="candidate--lists dn-grid dn-grid-small">
          {filteredConstituencies.length > 0 ? (
            filteredConstituencies.map((constituency) => (
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
    </MainLayout>
  );
}
