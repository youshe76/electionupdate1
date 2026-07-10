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


export default function Candidate() {
  const { slug } = useParams();
  const cleanSlug = slug?.replace(/\.html$/i, "");
  const candidate = candidatesData.find((c) => c.slug === cleanSlug);
  
  const featuredCandidates  = [];
  for(let i =0; i<candidatesData.length && featuredCandidates.length < 5; i++){
    if(candidatesData[i]?.popular){
      featuredCandidates.push(candidatesData[i])
    }
  }
  for(let i =0; i<featuredCandidates.length; i++){
    const x = Math.floor(Math.random() * featuredCandidates.length);
    const temp = featuredCandidates[x];
    const j = Math.floor(Math.random() * featuredCandidates.length);
    featuredCandidates[x]  = featuredCandidates[j];
    featuredCandidates[j]= temp;
  }
  let sameCons = candidatesData.filter(e=> candidate.constituency == e?.constituency);
  if(sameCons.length > 5){
    sameCons= sameCons.slice(0, 5) 
  }
  

  
  if (!candidate) {
    return (
      <MainLayout title="उम्मेदवार फेला परेन">
        <p>
          दुःख है, यो उम्मेदवार फेला परेन। कृपया{" "}
          <Link to="/candidates" target="_blank" rel="noopener noreferrer">उम्मेदवार सूची</Link> पर वापस जाएं।
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
      <div style={{display:"grid", gridTemplateColumns: "2fr 1fr", gap: "1%"}}>
        <div
          style={{
            display: "grid",
            paddingLeft:"5vw",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
            border: "1px solid red",
            height:"50vh"
            

          }}
        >
          <div 
          style={{
            height: "50vh"
          }}
          >
            <img
              src={candidate.image}
              alt={candidate.name}
              style={{
                height: "100%",
                borderRadius: "8px",
                border: "1px solid #ddd",
                objectFit:"contain",
                marginLeft:"auto",
                
              }}
            />
          </div>
          <div
          style={{
            background: "linear-gradient(120deg, rgb(255, 198, 197) 46%, rgba(234, 234, 234, 0) 100%)",
            height:"50vh",
            padding:"5%"
          }}
          
          >
            
              {candidate.partyLogo && (
                <div style={{ marginBottom: "15px" }}>
                  <img
                    src={candidate.partyLogo}
                    alt={candidate.party}
                    style={{ maxWidth: "100px", width: "48px", height:"48px", height: "auto", borderRadius:"50%" }}
                  />
                </div>
              )}
          
            <h2 style={{ fontSize: "27px", fontWeight: "700", marginBottom: "" }}>
              {candidate.name}
            </h2>
            <div style={{display: "flex", gap:"10px"}}>
              <div style={{}}>
              
                {partyInfo ? (
                  <Link to={`/party/${partyInfo.slug}`} style={{ color: "#bf1e2e", textDecoration: "none", fontWeight: "bold" }} target="_blank" rel="noopener noreferrer">
                    {candidate.party}
                  </Link>
                ) : (
                  candidate.party
                )}
              </div>
              <div style={{borderRadius: "20px", background:"#fff" , padding:"0 15px"}}>
                
                <Link 
                  to={`/constituency/${candidate.constituency?.replace(/\s+/g, "").toLowerCase()}`}
                  style={{ color: "rgba(0,0,0,0.6)", textDecoration: "none", fontWeight: "bold" }}
                target="_blank" rel="noopener noreferrer">
                  {candidate.constituency}
                </Link>
              </div>
            </div>
            <div style={{ }}>
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
            
            <div>
              <Link
                to="/candidates"
                style={{
                  display: "inline-block",
                  padding: "2px 3px",
                  backgroundColor: "#0066cc",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              target="_blank" rel="noopener noreferrer">
                सबै उम्मेदवारहरू
              </Link>
            </div>
          </div>
        </div>
        {/*Charchit */}
        <div
        style={{
          display:"flex",
          gap:"1%",
          flexDirection:"column"
        }}
        >
          <div>
              {featuredCandidates?.length  &&(
            <aside className="candidate-sidebar">
              <div className="sidebar">
                <div className="sidebar-candidate">
                  <h2 className="heading-title">
                    <span>चर्चित उम्मेदवारहरु</span>
                  </h2>
                  {featuredCandidates?.map((candidate) => (
                    <div
                      key={candidate.slug}
                      className={`candidate-row${candidate.isWinner ? " candidate-win" : ""}`}
                    >
                      <div className="candidate-media">
                        <Link to={`/candidate/${candidate.slug}`}>
                          <img
                            className="candidate-photo"
                            src={fixImageUrl(candidate.image)}
                            alt={candidate.name}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "/assets/images/placeholder.png";
                            }}
                          />
                        </Link>
                        <div>
                          <h3 className="title">
                            <Link to={`/candidate/${candidate.slug}`}>
                              {candidate.name }
                            </Link>
                          </h3>
                          <Link to={`/party/${partyData.find((p) => p.name === candidate.party)?.slug}`}>{candidate.party}</Link>
                        </div>
                      </div>
                      <div className="candidate-detail">
                        <div className="votes">
                          {toNepaliNumber(candidate.votes || 0)}
                          {candidate.isWinner ? (
                            <img src="/assets/img/win-tick.png" alt="win-tick" />
                          ) : null}
                        </div>
                        <Link className="party" to={`/party/${partyInfo?.party}`}>
                          <img
                            className="party-flag"
                            src={candidate?.partyLogo}
                            alt={partyInfo?.name}
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
          </div>
          <div>
              {sameCons?.length  &&(
            <aside className="candidate-sidebar">
              <div className="sidebar">
                <div className="sidebar-candidate">
                  <h2 className="heading-title">
                    <span>{candidate.constituency} उम्मेदवारहरु</span>
                  </h2>
                  {sameCons?.map((candidate) => (
                    <div
                      key={candidate.slug}
                      className={`candidate-row${candidate.isWinner ? " candidate-win" : ""}`}
                    >
                      <div className="candidate-media">
                        <Link to={`/candidate/${candidate.slug}`}>
                          <img
                            className="candidate-photo"
                            src={fixImageUrl(candidate.image)}
                            alt={candidate.name}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "/assets/images/placeholder.png";
                            }}
                          />
                        </Link>
                        <div>
                          <h3 className="title">
                            <Link to={`/candidate/${candidate.slug}`}>
                              {candidate.name }
                            </Link>
                          </h3>
                          <Link to={`/party/${partyData.find((p) => p.name === candidate.party)?.slug}`}>{candidate?.party}</Link>
                        </div>
                      </div>
                      <div className="candidate-detail">
                        <div className="votes">
                          {toNepaliNumber(candidate.votes || 0)}
                          {candidate.isWinner ? (
                            <img src="/assets/img/win-tick.png" alt="win-tick" />
                          ) : null}
                        </div>
                        <Link className="party" to={`/party/${partyInfo?.slug}`}>
                          <img
                            className="party-flag"
                            src={candidate?.partyLogo}
                            alt={partyInfo?.name}
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
          </div>
        </div>
        
      </div>
    </MainLayout>
  );
}
