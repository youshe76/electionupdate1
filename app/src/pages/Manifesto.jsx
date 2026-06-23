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

export default function Manifesto() {
  return (
    <MainLayout
      title="घोषणा पत्र"
      description="Read the major party manifestos and policy platforms in the 2082 election."
    >
      <div
        className="manifesto-grid"
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {manifestoData.map((manifesto) => (
          <div
            key={manifesto.id}
            className="manifesto-card"
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <Link to={`/manifesto/${manifesto.id}`} style={{ display: "block" }}>
                <img
                  src={getManifestoImage(manifesto.id)}
                  alt={manifesto.party_name}
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => {
                    e.target.src = "/assets/images/placeholder.png";
                  }}
                />
              </Link>
            </div>
            <div style={{ padding: "16px", textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#333",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {manifesto.party_name}
              </h3>
              <Link
                to={`/manifesto/${manifesto.id}`}
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: "#bf1e2e",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                घोषणा पत्र हेर्नुहोस्
              </Link>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
