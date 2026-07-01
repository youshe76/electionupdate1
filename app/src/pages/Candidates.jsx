import { useState, useMemo, useEffect, useRef } from "react";
import provinceData from "../data/province.json";
import constituencyData from "../data/constituency.json";
import partyData from "../data/party.json";
import { MainLayout } from "../layouts/MainLayout";
import ConstituencyElectionCard from "../components/election/ConstituencyElectionCard";
import { districtsForProvince } from "../utils/geoUtils";

const CARD_BATCH_SIZE = 20;

export default function Candidates() {
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [appliedProvince, setAppliedProvince] = useState("");
  const [appliedDistrict, setAppliedDistrict] = useState("");
  const [visibleCount, setVisibleCount] = useState(CARD_BATCH_SIZE);
  const [candidatesData, setCandidatesData] = useState([]);
  const loadMoreRef = useRef(null);

  const candidatesBySlug = useMemo(
    () => new Map(candidatesData.map((c) => [c.slug, c])),
    [candidatesData],
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

  const visibleConstituencies = useMemo(
    () => filteredConstituencies.slice(0, visibleCount),
    [filteredConstituencies, visibleCount],
  );

  const hasMoreConstituencies = visibleCount < filteredConstituencies.length;

  useEffect(() => {
    setVisibleCount(CARD_BATCH_SIZE);
  }, [appliedProvince, appliedDistrict]);

  useEffect(() => {
    let ignore = false;

    const loadCandidates = () => {
      fetch("/data/candidates.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load candidates: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (!ignore) {
            setCandidatesData(data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(loadCandidates, { timeout: 1000 });

      return () => {
        ignore = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timerId = window.setTimeout(loadCandidates, 0);

    return () => {
      ignore = true;
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMoreConstituencies) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + CARD_BATCH_SIZE, filteredConstituencies.length),
          );
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [filteredConstituencies.length, hasMoreConstituencies]);

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
            visibleConstituencies.map((constituency) => (
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
        {hasMoreConstituencies ? (
          <div ref={loadMoreRef} className="load-more-trigger" aria-hidden="true" />
        ) : null}
      </div>
    </MainLayout>
  );
}
