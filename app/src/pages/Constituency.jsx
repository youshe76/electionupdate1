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

export default function Constituency() {
  const { slug } = useParams();
  const cleanSlug = slug?.replace(/\.html$/i, "");
  
  const constituency = constituencyData.find((c) => c.slug === cleanSlug);

  if (!constituency) {
    return (
      <MainLayout title="निर्वाचन क्षेत्र फेला परेन">
        <p>दुःख है, यो निर्वाचन क्षेत्र फेला परेन।</p>
      </MainLayout>
    );
  }

  // Sort candidates by votes descending
  const sortedCandidates = [...constituency.candidates].sort(
    (a, b) => (b.votes || 0) - (a.votes || 0)
  );

  return (
    <MainLayout title={constituency.name}>
      <div className="district-detail" style={{ marginBottom: "30px" }}>
        <div className="dn-grid">
          <div className="col8">
            {constituency.map_image && (
              <div className="map-wrapper" style={{ marginBottom: "20px", textAlign: "center" }}>
                <img 
                  src={constituency.map_image} 
                  alt={constituency.name} 
                  style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", border: "1px solid #ddd" }}
                />
              </div>
            )}
            <div style={{ fontSize: "14px", color: "#666" }}>
              <strong>जिल्ला:</strong> <Link to={`/district/${constituency.district_slug}`} style={{ color: "#bf1e2e", textDecoration: "none", fontWeight: "bold" }} target="_blank" rel="noopener noreferrer">{constituency.district_name}</Link>
              <span style={{ margin: "0 10px" }}>|</span>
              <strong>प्रदेश:</strong> <Link to={`/province/${constituency.province_slug}`} style={{ color: "#bf1e2e", textDecoration: "none", fontWeight: "bold" }} target="_blank" rel="noopener noreferrer">{constituency.province_name}</Link>
            </div>
          </div>
          
          <div className="col4">
            <ul className="stats">
              <li style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                <img src="/assets/img/vote.png" alt="" style={{ maxWidth: "40px", marginRight: "15px" }} />
                <h5>
                  {constituency.voters?.total?.toLocaleString() || "०"}
                  <span style={{ fontSize: "12px", color: "#666", display: "block" }}>जम्मा मतदाता</span>
                </h5>
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                <img src="/assets/img/man.png" alt="" style={{ maxWidth: "40px", marginRight: "15px" }} />
                <h5>
                  {constituency.voters?.male?.toLocaleString() || "०"}
                  <span style={{ fontSize: "12px", color: "#666", display: "block" }}>पुरुष मतदाता</span>
                </h5>
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <img src="/assets/img/woman.png" alt="" style={{ maxWidth: "40px", marginRight: "15px" }} />
                <h5>
                  {constituency.voters?.female?.toLocaleString() || "०"}
                  <span style={{ fontSize: "12px", color: "#666", display: "block" }}>महिला मतदाता</span>
                </h5>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="all-parties-candidates section" style={{ marginTop: "30px" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid #bf1e2e", paddingBottom: "10px" }}>
          उम्मेदवारहरु
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {sortedCandidates.map((candidate) => {
            const candidateInfo = candidatesData.find((c) => c.slug === candidate.slug);
            const partyInfo = partyData.find((p) => p.name === candidateInfo?.party);
            
            return (
              <div 
                key={candidate.slug} 
                className={`party-container ${candidate.is_winner ? "candidate-win" : ""}`}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: candidate.is_winner ? "#fff8f8" : "#fff",
                  borderColor: candidate.is_winner ? "#bf1e2e" : "#ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div className="party-logo" style={{ display: "flex", alignItems: "center" }}>
                  <Link to={`/candidate/${candidate.slug}`} target="_blank" rel="noopener noreferrer">
                    <img 
                      className="candidate-photo" 
                      src={candidateInfo?.image || "/assets/images/placeholder.png"} 
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
                    {partyInfo ? (
                      <Link to={`/party/${partyInfo.slug}`} style={{ fontSize: "13px", color: "#bf1e2e", textDecoration: "none", fontWeight: "bold" }} target="_blank" rel="noopener noreferrer">
                        {candidateInfo?.party}
                      </Link>
                    ) : (
                      <span style={{ fontSize: "13px", color: "#666" }}>{candidateInfo?.party || "स्वतन्त्र"}</span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div className="votes" style={{ fontWeight: "bold", fontSize: "18px", color: "#bf1e2e", display: "flex", alignItems: "center" }}>
                    {candidate.votes?.toLocaleString() || "०"}
                    {candidate.is_winner && (
                      <img src="/assets/img/win-tick.png" alt="win-tick" style={{ width: "20px", marginLeft: "10px" }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
