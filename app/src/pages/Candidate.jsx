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

export default function Candidate() {
  const { slug } = useParams();
  const cleanSlug = slug?.replace(/\.html$/i, "");
  const candidate = candidatesData.find((c) => c.slug === cleanSlug);

  if (!candidate) {
    return (
      <MainLayout title="उम्मेदवार फेला परेन">
        <p>
          दुःख है, यो उम्मेदवार फेला परेन। कृपया{" "}
          <Link to="/candidates">उम्मेदवार सूची</Link> पर वापस जाएं।
        </p>
      </MainLayout>
    );
  }

  const partyInfo = partyData.find((p) => p.name === candidate.party);

  return (
    <MainLayout
      title={candidate.name}
      description={`Candidate profile page for ${candidate.name}.`}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <img
            src={candidate.image}
            alt={candidate.name}
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
            {candidate.name}
          </h2>
          <div style={{ marginBottom: "15px" }}>
            <strong>पार्टी:</strong>{" "}
            {partyInfo ? (
              <Link to={`/party/${partyInfo.slug}`} style={{ color: "#bf1e2e", textDecoration: "none", fontWeight: "bold" }}>
                {candidate.party}
              </Link>
            ) : (
              candidate.party
            )}
          </div>
          <div style={{ marginBottom: "15px" }}>
            <strong>निर्वाचन क्षेत्र:</strong>{" "}
            <Link 
              to={`/constituency/${candidate.constituency?.replace(/\s+/g, "").toLowerCase()}`}
              style={{ color: "#0066cc", textDecoration: "none", fontWeight: "bold" }}
            >
              {candidate.constituency}
            </Link>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <strong>पद:</strong> {candidate.jobTitle}
          </div>
          <div style={{ marginBottom: "15px" }}>
            <strong>मत:</strong> {candidate.votes?.toLocaleString() || "०"}
          </div>
          {candidate.isWinner && (
            <div style={{ marginBottom: "15px", color: "green", fontWeight: "bold", display: "flex", alignItems: "center" }}>
              <span>विजेता</span>
              <img src="/assets/img/win-tick.png" alt="win" style={{ width: "20px", marginLeft: "10px" }} />
            </div>
          )}
          {candidate.partyLogo && (
            <div style={{ marginBottom: "15px" }}>
              <img
                src={candidate.partyLogo}
                alt={candidate.party}
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </div>
          )}
          <div>
            <Link
              to="/candidates"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#0066cc",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              सभी उम्मेदवार देखें
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
