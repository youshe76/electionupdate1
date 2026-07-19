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
          <Link
            className="btn"
            to="/hot-seats"
            target="_blank"
            rel="noopener noreferrer"
          >
            विस्तृत
          </Link>
        </div>
        <div className="dn-grid">
          <div className="col12 hotseat-row">
            <div
              className=""
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {previewSeats.map((hotSeat) => (
                <div key={hotSeat.constituency} className="">
                  <div className="candidate-card">
                    <div className="candidate-card-header">
                      <h3>
                        {hotSeat.slug ? (
                          <Link
                            to={`/constituency/${hotSeat.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
                            <Link
                              to={`/candidate/${candidate.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
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

// function CandidateProfile({ candidate }) {
//   return (
//     <>
//       <div
//         style={{
//           maxWidth: "110px",
//         }}
//       >
//         <img
//           src={candidate.image}
//           alt={candidate.name}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = "/assets/images/placeholder.png";
//           }}
//           style={{
//             position: "relative",
//           }}
//         />
//         {candidate.partyLogo && candidate.partyLogo !== "#" ? (
//           <div
//             className=""
//             style={{
//               position: "absolute",
//               height: "20px",
//               aspectRatio: "1",
//               borderRadius: "50%",
//               top: "0",
//               left: "0",
//             }}
//           >
//             <img
//               src={candidate.partyLogo}
//               alt={candidate.party}
//               style={{
//                 objectFit: "contain",
//               }}
//               onError={(e) => {
//                 e.target.style.display = "none";
//               }}
//             />
//           </div>
//         ) : null}
//       </div>
//       <span>{candidate.name}</span>
//       <div>{toNepaliNumber(candidate.votes)}</div>
//     </>
//   );
// }

function CandidateProfile({ candidate }) {
  console.log(candidate);
  return (
    <>
      <div
        style={{
          maxWidth: "110px",
          position: "relative",
        }}
      >
        <img
          src={candidate.image}
          alt={candidate.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/images/placeholder.png";
          }}
          style={{
            position: "relative",
            width: "100%",
            display: "block",
            borderRadius: "50%",
          }}
        />
        {candidate.partyLogo && candidate.partyLogo !== "#" ? (
          <div
            style={{
              position: "absolute",
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              border: "2px solid white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={candidate.partyLogo}
              alt={candidate.party}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : null}
      </div>
      <span
        style={{
          fontSize: "12px",
        }}
      >
        {candidate.name}
      </span>
      <div
        style={{
          color: candidate?.winner ? "#2fa12f" : "black",
          fontSize: "18px",
        }}
      >
        {toNepaliNumber(candidate.votes)}
      </div>
    </>
  );
}
