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
            
            const isWinner = Boolean(
              candidate.isWinner ||
              candidate.is_winner ||
              candidateInfo?.isWinner ||
              candidateInfo?.is_winner
            );
            
            return (
             
              <div
                key={candidate.slug}
                className={`party-container col12${candidate.isWinner ? " candidate-win" : ""}`}
              >
                <Link
                  to={`/candidate/${candidate.slug}`}
                  className="party-logo"
                >
                  <img
                    src={candidateInfo?.image}
                    alt={candidate.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "/assets/images/placeholder.png";
                    }}
                  />
                  <span className="party-name">{candidate.name }</span>
                </Link>
                <div className="party-wrap">
                  <div className="party-info">
                    <Link
                      to={`/party/${partyInfo.slug}`}
                      className="party-sign"
                    >
                      <img src={partyInfo?.logo} alt={partyInfo?.name} />
                      {partyInfo.name }
                    </Link>
                    <Link to={`/constituency/${cleanSlug}`}>
                    <p style={{fontSize: "12px" , color: "rgba(1, 8, 20, 0.568627451)", fontWeight: "700"}}>{candidateInfo?.constituency}</p>
                    </Link>
                    
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", width: "fit-content" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "7px 12px",
                   
                        
                        color: isWinner ? "#2c9a6b" : "#4b5563",
                        fontWeight: 700,
                        fontSize: "15px",
                        
                      }}
                    >
                      <span>{toNepaliNumber(candidate.votes || 0)}</span>
                      {isWinner ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: "#ffffff",
                            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.12)",
                          }}
                        >
                          <img
                            src="/assets/img/win-tick.png"
                            alt="winner badge"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        </span>
                      ) : null}
                    </div>
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
