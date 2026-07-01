import { Link } from "react-router-dom";
import { useMemo } from "react";
import hotSeatsData from "../../data/hot-seats.json";
import constituencyData from "../../data/constituency.json";
import candidatesData from "../../data/candidates.json";
import partyData from "../../data/party.json";
import { toNepaliNumber } from "../../utils";
import { fixImageUrl } from "../../utils/imageUtils";
import { cleanRouteSlug } from "../../utils/geoUtils";

const PREVIEW_COUNT = 3;

export default function HotSeatsPreviewSection() {
  const partyByName = useMemo(
    () => new Map(partyData.map((p) => [p.name, p])),
    [],
  );

  const previewSeats = useMemo(() => {
    return hotSeatsData.slice(0, PREVIEW_COUNT).map((hotSeat) => {
      const constituency = constituencyData.find(
        (c) => c.name === hotSeat.constituency,
      );
      const slug =
        constituency?.slug ||
        cleanRouteSlug(hotSeat.link?.replace(/^constituency\//, "") || "");

      const candidates = hotSeat.candidates.map((candidate) => {
        const candidateData = candidatesData.find(
          (c) => c.name === candidate.name,
        );
        const party = partyByName.get(candidate.party);

        return {
          ...candidate,
          slug: candidateData?.slug,
          votes: candidateData?.votes || candidate.votes || 0,
          image: fixImageUrl(candidate.image),
          partyLogo: candidateData?.partyLogo || party?.logo,
        };
      });

      return { ...hotSeat, slug, candidates };
    });
  }, [partyByName]);

  return (
    <section className="section candidates-column">
      <div className="elc-container">
        <div className="heading-title-wrap flex flex-between flex-wrap flex-middle">
          <h3 className="heading-title">हट सिटहरु</h3>
          <Link className="btn" to="/hot-seats" target="_blank" rel="noopener noreferrer">
            विस्तृत
          </Link>
        </div>
        <div className="dn-grid">
          <div className="col12 hotseat-row">
            <div className="dn-grid dn-grid-small">
              {previewSeats.map((hotSeat) => (
                <div key={hotSeat.constituency} className="col4">
                  <div className="candidate-card">
                    <div className="candidate-card-header">
                      <h3>
                        {hotSeat.slug ? (
                          <Link to={`/constituency/${hotSeat.slug}`} target="_blank" rel="noopener noreferrer">
                            {hotSeat.constituency}
                          </Link>
                        ) : (
                          hotSeat.constituency
                        )}
                      </h3>
                    </div>
                    <div className="candidate-holder">
                      {hotSeat.candidates.map((candidate, idx) => (
                        <div
                          key={idx}
                          className={`candidate${idx === 0 ? " candidate-win" : ""}`}
                        >
                          {candidate.slug ? (
                            <Link to={`/candidate/${candidate.slug}`} target="_blank" rel="noopener noreferrer">
                              <CandidateProfile candidate={candidate} />
                            </Link>
                          ) : (
                            <CandidateProfile candidate={candidate} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CandidateProfile({ candidate }) {
  return (
    <>
      <div className="profile">
        <img
          src={candidate.image}
          alt={candidate.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/images/placeholder.png";
          }}
        />
        {candidate.partyLogo && candidate.partyLogo !== "#" ? (
          <div className="party">
            <img
              src={candidate.partyLogo}
              alt={candidate.party}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : null}
      </div>
      <span>{candidate.name}</span>
      <div className="votes">{toNepaliNumber(candidate.votes)}</div>
    </>
  );
}
