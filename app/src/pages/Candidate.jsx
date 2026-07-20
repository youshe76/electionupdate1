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
import {
  districtsForProvince,
  provinceRouteSlug,
  cleanRouteSlug,
} from "../utils/geoUtils";
import { fixImageUrl } from "../utils/imageUtils";
import { getManifestoImage } from "../app/config/constants";
import getPersonLink from "../utils/getPersonLink";
import description from "../../public/data/description.json";
import { ChevronRight } from "lucide-react";

function normalizeName(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[()]/g, "")
    .replace(/[\s\u00A0]+/g, " ")
    .trim();
}

const getConstituencyHref = (constituencyName) => {
  const constituency = constituencyData.find(
    (c) => normalizeName(c.name) === normalizeName(constituencyName),
  );

  return constituency
    ? `/constituency/${constituency.slug}`
    : "/constituencies";
};

export default function Candidate() {
  const { slug } = useParams();
  const cleanSlug = slug?.replace(/\.html$/i, "");
  const candidate = candidatesData.find((c) => c.slug === cleanSlug);

  const featuredCandidates = [];
  for (
    let i = 0;
    i < candidatesData.length && featuredCandidates.length < 5;
    i++
  ) {
    if (candidatesData[i]?.popular) {
      featuredCandidates.push(candidatesData[i]);
    }
  }
  for (let i = 0; i < featuredCandidates.length; i++) {
    const x = i;
    const temp = featuredCandidates[x];
    const j = Math.floor(Math.random() * featuredCandidates.length);
    featuredCandidates[x] = featuredCandidates[j];
    featuredCandidates[j] = temp;
  }
  let sameCons = candidatesData.filter(
    (e) => candidate.constituency == e?.constituency,
  );

  if (sameCons.length > 5) {
    sameCons = sameCons.slice(0, 5);
  }

  if (!candidate) {
    return (
      <MainLayout title="उम्मेदवार फेला परेन">
        <p>
          दुःख है, यो उम्मेदवार फेला परेन। कृपया{" "}
          <Link to="/candidates" target="_blank" rel="noopener noreferrer">
            उम्मेदवार सूची
          </Link>{" "}
          पर वापस जाएं।
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
      <div
        className="candidatePageContainer"
        style={{ display: "grid", gap: "1%" }}
      >
        <div
          sytle={{
            display: "flex",
            gap: "100px",
          }}
        >
          <div
            style={{
              display: "grid",
              paddingLeft: "5vw",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
              border: "1px solid red",
              height: "50vh",
            }}
          >
            <div
              style={{
                height: "50vh",
              }}
            >
              <img
                src={candidate.image}
                alt={candidate.name}
                onError={(e) => {
                  let total = 0;
                  for (let ch of candidate?.slug) {
                    total += ch.charCodeAt(0);
                  }
                  e.target.src = getPersonLink(
                    candidate.votes || total || parseInt(Math.random() * 1000),
                  );
                }}
                style={{
                  height: "100%",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  objectFit: "contain",
                  marginLeft: "auto",
                }}
              />
            </div>
            <div
              style={{
                background:
                  "linear-gradient(120deg, rgb(255, 198, 197) 46%, rgba(234, 234, 234, 0) 100%)",
                height: "50vh",
                padding: "5%",
              }}
            >
              {candidate.partyLogo && (
                <div style={{ marginBottom: "15px" }}>
                  <img
                    src={candidate.partyLogo}
                    alt={candidate.party}
                    style={{
                      maxWidth: "100px",
                      width: "48px",
                      height: "48px",
                      height: "auto",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}

              <h2
                style={{
                  fontSize: "27px",
                  fontWeight: "700",
                  marginBottom: "",
                }}
              >
                {candidate.name}
              </h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{}}>
                  {partyInfo ? (
                    <Link
                      to={`/party/${partyInfo.slug}`}
                      style={{
                        color: "#bf1e2e",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {candidate.party}
                    </Link>
                  ) : (
                    candidate.party
                  )}
                </div>

                <div
                  style={{
                    borderRadius: "20px",
                    background: "#fff",
                    padding: "0 15px",
                  }}
                >
                  <Link
                    to={getConstituencyHref(candidate.constituency)}
                    style={{
                      color: "rgba(0,0,0,0.6)",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {candidate.constituency}
                  </Link>
                </div>
              </div>
              <div style={{}}>
                <strong>पद:</strong> {candidate.jobTitle}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong>मत:</strong> {candidate.votes?.toLocaleString() || "०"}
              </div>
              {candidate.isWinner && (
                <div
                  style={{
                    marginBottom: "15px",
                    color: "green",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span>विजेता</span>
                  <img
                    src="/assets/img/win-tick.png"
                    alt="win"
                    style={{ width: "20px", marginLeft: "10px" }}
                  />
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
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  सबै उम्मेदवारहरू
                </Link>
              </div>
            </div>
          </div>

          {description[0][cleanSlug] && (
            <div>
              <h1
                style={{
                  fontWeight: "700",
                  fontSize: "22px",
                  fontFamily: "Anek Devanagari, sans-serif",
                  marginBottom: "10px",
                }}
              >
                उम्मेदवारको व्यक्तिगत विवरण
              </h1>
              <h1 style={{ fontStyle: "normal",fontWeight: "400", fontSize: "20px", lineHeight: "1.9" }}>{description[0][cleanSlug]}</h1>
            </div>
          )}
        </div>
        {/*Charchit */}
        <div
          style={{
            display: "flex",
            gap: "1%",
            flexDirection: "column",
          }}
        >
          <div>
            {featuredCandidates?.length && (
              <aside className="candidate-sidebar">
                <div className="sidebar">
                  <div className="sidebar-candidate">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h2 className="heading-title">
                        <span>चर्चित उम्मेदवारहरु</span>
                      </h2>
                      <Link to={"/popular-candidates"}>
                        {" "}
                        <ChevronRight
                          style={{
                            background: "#bf1e2e",
                            fontWeight: "800",
                            height: "22px",
                            width: "22px",
                            color: "#fff",
                            borderRadius: "100%",
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "10px",
                            alignItems: "center",
                          }}
                        />
                      </Link>
                    </div>
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
                                {candidate.name}
                              </Link>
                            </h3>
                            <Link
                              to={`/party/${partyData.find((p) => p.name === candidate.party)?.slug}`}
                            >
                              {candidate.party}
                            </Link>
                          </div>
                        </div>
                        <div className="candidate-detail">
                          <div className="votes">
                            {toNepaliNumber(candidate.votes || 0)}
                            {candidate.isWinner ? (
                              <img
                                src="/assets/img/win-tick.png"
                                alt="win-tick"
                              />
                            ) : null}
                          </div>
                          <Link
                            className="party"
                            to={`/party/${partyInfo?.party}`}
                          >
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
            {sameCons?.length && (
              <aside className="candidate-sidebar">
                <div className="sidebar">
                  <div className="sidebar-candidate">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h2 className="heading-title">
                        <span>{candidate.constituency} उम्मेदवारहरु</span>
                      </h2>
                      <Link
                        to={
                          "/constituency/" +
                          constituencyData.find(
                            (e) => e?.name == sameCons[0]?.constituency,
                          )?.slug
                        }
                      >
                        {" "}
                        <ChevronRight
                          style={{
                            background: "#bf1e2e",
                            fontWeight: "800",
                            height: "22px",
                            width: "22px",
                            color: "#fff",
                            borderRadius: "100%",
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "10px",
                            alignItems: "center",
                          }}
                        />
                      </Link>
                    </div>
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
                                event.currentTarget.src = getPersonLink(
                                  parseInt(10000 * Math.random()),
                                );
                              }}
                            />
                          </Link>
                          <div>
                            <h3 className="title">
                              <Link to={`/candidate/${candidate.slug}`}>
                                {candidate.name}
                              </Link>
                            </h3>
                            <Link
                              to={`/party/${partyData.find((p) => p.name === candidate.party)?.slug}`}
                            >
                              {candidate?.party}
                            </Link>
                          </div>
                        </div>
                        <div className="candidate-detail">
                          <div className="votes">
                            {toNepaliNumber(candidate.votes || 0)}
                            {candidate.isWinner ? (
                              <img
                                src="/assets/img/win-tick.png"
                                alt="win-tick"
                              />
                            ) : null}
                          </div>
                          <Link
                            className="party"
                            to={`/party/${partyInfo?.slug}`}
                          >
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
