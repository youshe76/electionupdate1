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

export default function PopularCandidates() {
  // Select some candidates with high votes
  const popularCandidates = [...candidatesData]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 15);

  return (
    <MainLayout
      title="चर्चित उम्मेदवारहरु"
      description="See the most popular candidates from the 2082 election."
    >
      <div className="popular-grid" style={{ marginTop: "20px" }}>
        {popularCandidates.map((candidate) => (
          <div key={candidate.slug} className="popular-card">
            <div className="popular-card-inner">
              <div className="photo-wrap">
                <Link to={`/candidate/${candidate.slug}`} target="_blank" rel="noopener noreferrer">
                  <div className="photo-circle">
                    <img
                      src={candidate.image || "/assets/images/placeholder.png"}
                      alt={candidate.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/assets/images/placeholder.png"; }}
                    />
                  </div>
                </Link>
              </div>

              <div className="card-body">
                <h4 className="candidate-name">
                  <Link to={`/candidate/${candidate.slug}`} target="_blank" rel="noopener noreferrer">{candidate.name}</Link>
                </h4>
                <div className="candidate-meta">{candidate.party}</div>
                <div className="constituency-pill">{candidate.constituency}</div>
              </div>

              <div className="card-footer">
                <div className="votes">{toNepaliNumber(candidate.votes || 0)}</div>
                {candidate.isWinner ? (
                  <img src="/assets/img/win-tick.png" alt="winner" className="winner-badge" style={{ width: "30px", height: "30px" }} />
                ) : candidate.partyLogo ? (
                  <img src={candidate.partyLogo} alt={candidate.party} className="party-badge" onError={(e)=>{e.target.style.display='none'}} />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
