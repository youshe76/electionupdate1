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

export default function HotSeats() {
  const [districtFilter, setDistrictFilter] = useState("");

  // Get unique districts from hot seats data
  const hotseatConstituencies = useMemo(() => {
    return hotSeatsData.map((hs) => {
      const match = constituencyData.find((c) => c.name === hs.constituency);
      return { ...hs, district: match?.district_name || "" };
    });
  }, []);

  const uniqueDistricts = useMemo(() => {
    const districts = [
      ...new Set(hotseatConstituencies.map((hs) => hs.district)),
    ].filter(Boolean).sort();
    return districts;
  }, [hotseatConstituencies]);

  const filteredHotSeats = useMemo(() => {
    if (!districtFilter) return hotseatConstituencies;
    return hotseatConstituencies.filter((hs) => hs.district === districtFilter);
  }, [districtFilter, hotseatConstituencies]);

  const filterBar = (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <select
        value={districtFilter}
        onChange={(e) => setDistrictFilter(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      >
        <option value="">जिल्ला</option>
        {uniqueDistricts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
      <button
        onClick={() => setDistrictFilter("")}
        style={{
          padding: "8px 20px",
          backgroundColor: "#bf1e2e",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        खोज्नुहोस्
      </button>
    </div>
  );

  return (
    <MainLayout title="हट सिटहरु" headerRight={filterBar}>
      <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {filteredHotSeats.length > 0 ? (
          filteredHotSeats.map((hotSeat) => (
            <div key={hotSeat.constituency}>
              <div
                style={{
                  backgroundColor: "#f3e8eb",
                  borderBottom: "3px solid #bf1e2e",
                  padding: "10px 15px",
                  marginBottom: "15px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#bf1e2e",
                  }}
                >
                  {hotSeat.constituency}
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: "15px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                }}
              >
                {hotSeat.candidates.map((candidate, idx) => {
                  // Look up votes from candidatesData by matching name
                  const candidateData = candidatesData.find((c) => c.name === candidate.name);
                  const votes = candidateData?.votes || candidate.votes || 0;
                  // Fix image URL if it has the malformed ../npcdn prefix
                  const fixedImageUrl = candidate.image?.replace(/^\.\.\/npcdn\.ratopati\.com/, "https://npcdn.ratopati.com") || "/assets/images/placeholder.png";

                  return (
                    <div
                      key={idx}
                      style={{
                        textAlign: "center",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "90px",
                          height: "90px",
                          margin: "0 auto 10px",
                          borderRadius: "50%",
                          background: "linear-gradient(180deg, #ffeef0, #f8dfe0)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          border: "1px solid rgba(0,0,0,0.04)",
                          position: "relative",
                        }}
                      >
                        <img
                          src={fixedImageUrl}
                          alt={candidate.name}
                          style={{
                            width: "76px",
                            height: "76px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "4px solid #fff",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/images/placeholder.png";
                          }}
                        />
                        {candidate.winner && (
                          <img
                            src="/assets/img/win-tick.png"
                            alt="winner"
                            style={{
                              position: "absolute",
                              bottom: "-2px",
                              right: "-2px",
                              width: "24px",
                              height: "24px",
                            }}
                          />
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          margin: "6px 0",
                          color: "#333",
                        }}
                      >
                        {candidate.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          margin: "2px 0",
                        }}
                      >
                        {candidate.party}
                      </p>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "#2c9a6b",
                          marginTop: "6px",
                        }}
                      >
                        {toNepaliNumber(votes)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>कुनै हट सिट फेला परेन</p>
        )}
      </div>
    </MainLayout>
  );
}
