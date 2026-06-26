import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import candidatesData from "../data/candidates.json";
import provinceData from "../data/province.json";
import districtData from "../data/district.json";
import constituencyData from "../data/constituency.json";
import partyData from "../data/party.json";
import manifestoData from "../data/manifesto.json";
import hotSeatsData from "../data/hot-seats.json";
import voteDifferenceData from "../data/vote-difference.json";
import { MainLayout } from "../layouts/MainLayout";
import ConstituencyElectionCard from "../components/election/ConstituencyElectionCard";
import { toNepaliNumber } from "../utils";
import { districtsForProvince, provinceRouteSlug, cleanRouteSlug } from "../utils/geoUtils";
import { fixImageUrl } from "../utils/imageUtils";
import { getManifestoImage } from "../app/config/constants";

export default function Party() {
  const { slug } = useParams();
  const cleanSlug = slug?.replace(/\.html$/i, "");
  
  const party = partyData.find((p) => p.slug === cleanSlug);

  if (!party) {
    return (
      <MainLayout title="राजनीतिक दल फेला परेन">
        <p>दुःख है, यो राजनीतिक दल फेला परेन।</p>
      </MainLayout>
    );
  }

  // Filter candidates belonging to this party
  const partyCandidates = candidatesData.filter(
    (c) => c.party === party.name
  );
  
  // Sort them by votes descending
  const sortedPartyCandidates = [...partyCandidates].sort(
    (a, b) => (b.votes || 0) - (a.votes || 0)
  );

  return (
    <MainLayout title={party.name}>
      <div className="candidate-detail-wrapper" style={{ marginBottom: "30px" }}>
        <div className="dn-grid">
          <div className="col8">
            <div className="candidate-bio" style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              {party.logo && party.logo !== "#" ? (
                 <img src={party.logo} alt={party.name} onError={(e) => { e.target.onerror=null; e.target.src="/assets/images/placeholder.png"; }} style={{ maxWidth: "120px", height: "auto", borderRadius: "8px", border: "1px solid #ddd" }} />
               ) : (
                 <img src="/assets/images/placeholder.png" alt={party.name} style={{ maxWidth: "120px", height: "auto", borderRadius: "8px", border: "1px solid #ddd" }} />
               )}
              <div className="page-header" style={{ padding: 0, border: "none" }}>
                <h3 className="page-title" style={{ margin: "0 0 10px 0", fontSize: "24px" }}>
                  {party.name}
                </h3>
                {party.leader && (
                  <span style={{ fontSize: "16px", color: "#666" }}>
                    <strong>नेतृत्व/अध्यक्ष:</strong> {party.leader}
                  </span>
                )}
              </div>
            </div>
            
            <div className="contentarea">
              <p style={{ fontSize: "16px", lineHeight: "1.6" }}>{party.description}</p>
            </div>
          </div>
          
          <div className="col4">
            <div className="stats-wrap" style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#fff" }}>
              <h3 className="heading-title" style={{ fontSize: "18px", fontWeight: "bold", borderBottom: "2px solid #bf1e2e", paddingBottom: "10px", marginBottom: "15px" }}>
                निर्वाचन परिणाम सार
              </h3>
              <div className="result-grid" style={{ display: "flex", gap: "20px", justifyContent: "space-around" }}>
                <div className="result-vote" style={{ textAlign: "center" }}>
                  <h5 style={{ fontSize: "24px", color: "#bf1e2e", margin: 0, fontWeight: "bold" }}>
                    {party.wins || "०"}
                  </h5>
                  <span style={{ fontSize: "12px", color: "#666" }}>जित सिट</span>
                </div>
                {party.proportional_votes && (
                  <div className="result-vote" style={{ textAlign: "center" }}>
                    <h5 style={{ fontSize: "20px", color: "#bf1e2e", margin: 0, fontWeight: "bold" }}>
                      {party.proportional_votes}
                    </h5>
                    <span style={{ fontSize: "12px", color: "#666" }}>समानुपातिक मत</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="all-parties-candidates section" style={{ marginTop: "30px" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid #bf1e2e", paddingBottom: "10px" }}>
          यस दलका उम्मेदवारहरु ({partyCandidates.length})
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {sortedPartyCandidates.map((candidate) => (
            <div 
              key={candidate.slug} 
              className={`party-container ${candidate.isWinner ? "candidate-win" : ""}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: candidate.isWinner ? "#fff8f8" : "#fff",
                borderColor: candidate.isWinner ? "#bf1e2e" : "#ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div className="party-logo" style={{ display: "flex", alignItems: "center" }}>
                <Link to={`/candidate/${candidate.slug}`} target="_blank" rel="noopener noreferrer">
                  <img 
                    className="candidate-photo" 
                    src={candidate.image || "/assets/images/placeholder.png"} 
                    alt={candidate.name} 
                    style={{ width: "60px", height: "60px", borderRadius: "50%", marginRight: "15px", objectFit: "cover", border: "1px solid #ccc" }}
                  />
                </Link>
                <div>
                  <h3 className="party-name" style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                    <Link to={`/candidate/${candidate.slug}`} style={{ color: "#333", textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                      {candidate.name}
                    </Link>
                  </h3>
                  <span style={{ fontSize: "13px", color: "#666" }}>
                    <strong>क्षेत्र:</strong> {candidate.constituency}
                  </span>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div className="votes" style={{ fontWeight: "bold", fontSize: "18px", color: "#bf1e2e", display: "flex", alignItems: "center" }}>
                  {candidate.votes?.toLocaleString() || "०"}
                  {candidate.isWinner && (
                    <img src="/assets/img/win-tick.png" alt="win-tick" style={{ width: "20px", marginLeft: "10px" }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
