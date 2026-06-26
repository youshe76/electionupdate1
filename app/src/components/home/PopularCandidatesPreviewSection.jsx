import { Link } from "react-router-dom";
import { useMemo } from "react";
import candidatesData from "../../data/candidates.json";
import { toNepaliNumber } from "../../utils";

const PREVIEW_COUNT = 8;

export default function PopularCandidatesPreviewSection() {
  const popularCandidates = useMemo(
    () =>
      [...candidatesData]
        .sort((a, b) => (b.votes || 0) - (a.votes || 0))
        .slice(0, PREVIEW_COUNT),
    [],
  );

  return (
    <section className="section popular-candidate famous-candidates">
      <div className="elc-container">
        <div className="heading-title-wrap flex flex-between flex-wrap flex-middle">
          <h3 className="heading-title">चर्चित उम्मेदवारहरु</h3>
          <Link className="btn" to="/popular-candidates" target="_blank" rel="noopener noreferrer">
            विस्तृत
          </Link>
        </div>
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
      </div>
    </section>
  );
}
