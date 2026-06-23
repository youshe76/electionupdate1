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

export default function Parties() {
  const sortedParties = [...partyData].sort((a, b) => {
    const winsA = a.wins || 0;
    const winsB = b.wins || 0;
    if (winsA !== winsB) return winsB - winsA;
    const votesA = Number(a.proportional_votes?.replace(/[^0-9]/g, "") || 0);
    const votesB = Number(b.proportional_votes?.replace(/[^0-9]/g, "") || 0);
    return votesB - votesA;
  });

  return (
    <MainLayout
      title="राजनीतिक दलहरु"
      description="Review participating political parties and their results in Nepal Election 2082."
    >
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {sortedParties.map((party) => (
          <div
            key={party.slug}
            style={{
              background: "linear-gradient(180deg, rgba(255,239,239,0.85), #fff)",
              border: "1px solid rgba(191,30,46,0.15)",
              borderRadius: "18px",
              padding: "24px 20px",
              minHeight: "320px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: "86px",
                  height: "86px",
                  margin: "0 auto 18px",
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    party.logo && party.logo !== "#"
                      ? party.logo.startsWith("http")
                        ? party.logo
                        : party.logo.startsWith("/")
                        ? party.logo
                        : `/${party.logo}`
                      : "/assets/images/placeholder.png"
                  }
                  alt={party.name}
                  style={{ maxWidth: "72px", maxHeight: "72px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/images/placeholder.png";
                  }}
                />
              </div>

              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    margin: "0 0 10px",
                    lineHeight: "1.3",
                    color: "#991d2b",
                  }}
                >
                  {party.name}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#5d5d5d", lineHeight: "1.5" }}>
                  अध्यक्ष: {party.leader || "—"}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "14px",
                    textAlign: "center",
                    border: "1px solid #f1e6e9",
                  }}
                >
                  <div style={{ fontSize: "14px", color: "#999" }}>सिट</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#bf1e2e", marginTop: "6px" }}>
                    {party.wins || 0}
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "14px",
                    textAlign: "center",
                    border: "1px solid #f1e6e9",
                  }}
                >
                  <div style={{ fontSize: "14px", color: "#999" }}>सम्पूर्ण मत</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#bf1e2e", marginTop: "6px" }}>
                    {party.proportional_votes || "०"}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Link
                to={`/party/${party.slug}`}
                style={{
                  display: "inline-block",
                  padding: "10px 18px",
                  backgroundColor: "#bf1e2e",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "999px",
                  fontWeight: "700",
                  fontSize: "13px",
                }}
              >
                विस्तृत जानकारी
              </Link>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
