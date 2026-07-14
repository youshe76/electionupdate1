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


const nepalProvinces = {
  "कोशी प्रदेश": "koshi province",
  "मधेस प्रदेश": "madhesh province",
  "बागमती प्रदेश": "bagmati province",
  "गण्डकी प्रदेश": "gandaki province",
  "लुम्बिनी प्रदेश": "lumbini province",
  "कर्णाली प्रदेश": "karnali province",
  "सुदूरपश्चिम प्रदेश": "sudurpashchim province"
};




export default function VoteDifference() {
  const [partyFilter, setPartyFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const voteItems = useMemo(() => {
    return voteDifferenceData.map((item) => {
      const match = constituencyData.find((c) => c.name === item.constituency);
      return {
        ...item,
        district: match?.district_name || "",
      };
    });
  }, []);

  const partyOptions = useMemo(
    () => [
      ...new Set(voteItems.flatMap((item) => item.candidates.map((candidate) => candidate.party))),
    ],
    [voteItems]
  );

  const provinceOptions = useMemo(
    () => [
      ...new Set(voteItems.map((item) => item.province).filter(Boolean)),
    ],
    [voteItems]
  );

  const districtOptions = useMemo(
    () => [
      ...new Set(voteItems.map((item) => item.district).filter(Boolean)),
    ],
    [voteItems]
  );

  const filteredItems = useMemo(() => {
    return voteItems.filter((item) => {
      const partyMatch =
        !partyFilter || item.candidates.some((candidate) => candidate.party === partyFilter);
      const provinceMatch = !provinceFilter || item.province === provinceFilter;
      const districtMatch = !districtFilter || item.district === districtFilter;
      return partyMatch && provinceMatch && districtMatch;
    });
  }, [partyFilter, provinceFilter, districtFilter, voteItems]);
  
  

  return (
    <MainLayout
      title="मतान्तर"
      description="Track the vote difference across constituencies in the 2082 election."
    >
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <select
          value={partyFilter}
          onChange={(e) => setPartyFilter(e.target.value)}
          style={{
            minWidth: "160px",
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px",
            background: "#fff",
          }}
        >
          <option value="">पार्टी</option>
          {partyOptions.map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>

        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          style={{
            minWidth: "160px",
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px",
            background: "#fff",
          }}
        >
          <option value="">प्रदेश</option>
          {provinceOptions.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          style={{
            minWidth: "160px",
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px",
            background: "#fff",
          }}
        >
          <option value="">जिल्ला</option>
          {districtOptions.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setPartyFilter("");
            setProvinceFilter("");
            setDistrictFilter("");
          }}
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#bf1e2e",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          खोज्नुहोस्
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: " repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.constituency}
              style={{
                background: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  padding: "18px 18px 14px",
                  borderBottom: "1px solid #f0f0f0",
                  background: "#fbfbfb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div style={{display:"flex",width:"100%", justifyContent:"space-between", flexDirection:"row"}}>
                    
                    <Link to={"/"+item.link}>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#222",
                          marginBottom: "6px",
                        }}
                      >
                        {item.constituency}
                      </div>
                    </Link>
                   <Link to={`/province/${nepalProvinces[item.province]?.split(" ").join("-")}`}> <div style={{ fontSize: "13px", color: "#666", textDecoration: "underline" }}>
                      {item.province }
                    </div> </Link>
                  </div>
                  {/* <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#2c9a6b",
                      }}
                    >
                      {item.voteDifference}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {item.voteDifferencePercent}
                    </div>
                  </div> */}
                </div>
              </div>

              <div style={{ padding: "18px", display: "grid", gap: "12px" }}>
                {item.candidates.map((candidate, index) => {
                  const fixedImageUrl =
                    candidate.image?.replace(/^\.\.\/npcdn\.ratopati\.com/, "https://npcdn.ratopati.com") ||
                    "/assets/images/placeholder.png";
                    
                    const candidateData = candidatesData.find((c) => c.name === candidate.name);
                    const party = partyData.find((c)=> c.name === candidateData?.party)?.slug;
                    
                    
                    const partyLogo = candidateData?.partyLogo || "/assets/images/placeholder.png";
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px",
                        borderRadius: "12px",
                        background: candidate.winner ? "#edf9f0" : "#fff",
                        border: candidate.winner ? "1px solid #cdecd4" : "1px solid #f0f0f0",
                        borderLeft: candidate.winner ? "5px solid rgb(47, 161, 47)" : "1px solid #f0f0f0",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "#f3f3f3",
                          flexShrink: 0,
                        }}
                      >
                        <Link to={`/candidate/${candidateData?.slug}`}>
                          <img
                            src={fixedImageUrl}
                            alt={candidate.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/images/placeholder.png";
                            }}
                          />
                        </Link>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/candidate/${candidateData?.slug}`}>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#212121",
                            }}
                          >
                            {candidate.name}
                          </div>
                        </Link>
                        <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
                          <Link to={`/party/${party}`}>
                          <div style={{height:"15px", width:"15px", borderRadius:"50%"}}>
                            <img src={partyLogo} style={{height:"100%", width:"100%", objectFit: "contain", transform: "translateY(-2px)"}} />
                          </div>
                          </Link>
                          <Link to={`/party/${party}`}>
                          <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                            {candidate.party}
                          </div>
                          </Link>

                        </div>
                      </div>
                      <div  style={{ textAlign: "right" }}>
                        <div style={{display:"flex", gap:"5px"}}>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: candidate?.winner? "#2c9a6b": "#000000",
                            }}
                          >
                            {candidate.votes}
                          </div>
                          {candidate?.winner && <img
														src="/assets/img/win-tick.png"
														alt="winner"
														
														style={{
															height: "20px",
                              width:"20px",
                              transform: "translateY(3px)",
															objectFit: "contain",
															
														}}
													/>}
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
                <div style={{ display:"flex",borderTop:"2px solid rgb(172, 27, 42)", background:"rgba(191, 30, 46, 0.03)", borderRadius:"8px" , padding:"10px" , gap:"2px", justifyContent:"center"}}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "rgba(17, 17, 17, 0.6588235294)",
                        
                      }}
                    >
                      {"मतान्तर : " }
                    </div>
                    <div style={{ fontSize: "12px", color: "#bf1e2e" }}>
                      <strong>{item.voteDifference + " (" + item.voteDifferencePercent + ")"}</strong>
                    </div>
                  </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "40px 20px",
              textAlign: "center",
              color: "#666",
            }}
          >
            कुनै परिणाम फेला परेन। फिल्टर हटाएर पुन: प्रयास गर्नुहोस्।
          </div>
        )}
      </div>
    </MainLayout>
  );
}
