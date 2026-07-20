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

const parties = [
  {
    slug: "rastriya-swatantra-party",
    name: "राष्ट्रिय स्वतन्त्र पार्टी",
    image: "/assets/images/rsp_AiC1qh2xlI.jpg",
    direct: 125,
    proportional: 57,
    total: 182,
    votes: "51,83,493",
    color: "#07a4f2",
  },
  {
    slug: "nepali-congress",
    name: "नेपाली कांग्रेस",
    image: "/assets/images/congress-logo_zVeY3un3Hj.jpg",
    direct: 18,
    proportional: 20,
    total: 38,
    votes: "17,59,172",
    color: "#2e7a05",
  },
  {
    slug: "cpn-uml",
    name: "नेकपा (एमाले)",
    image: "/assets/images/uml-1_zfT0bMAJFO.jpg",
    direct: 9,
    proportional: 16,
    total: 25,
    votes: "14,55,885",
    color: "#910808",
  },
  {
    slug: "nepali-communist-party",
    name: "नेपाली कम्युनिष्ट पार्टी",
    image: "/assets/images/nepali-communist_uVwmNizOSk.jpg",
    direct: 8,
    proportional: 9,
    total: 17,
    votes: "8,11,577",
    color: "#f50f0f",
  },
  {
    slug: "shram-samskriti-party",
    name: "श्रम संस्कृति पार्टी",
    image: "/assets/images/shram-sanskriti-party_jrxdNsjzjb.jpg",
    direct: 3,
    proportional: 4,
    total: 7,
    votes: "3,85,902",
    color: "#d54b10",
  },
  {
    slug: "rastriya-prajatantra-party",
    name: "राष्ट्रिय प्रजातन्त्र पार्टी",
    image: "/assets/images/raprapa_RPVSZDsBPg.jpg",
    direct: 1,
    proportional: 4,
    total: 5,
    votes: "3,30,684",
    color: "#f0d105",
  },
  {
    slug: "swatantra",
    name: "स्वतन्त्र",
    image: "https://npcdn.ratopati.com/media/news/swatantra_9p27i1Pv2j.png",
    direct: 1,
    proportional: "-",
    total: 0,
    votes: "",
    color: "rgba(137, 40, 140, 1)",
  },
];

export default function Result() {
  return (
    <MainLayout
      title="प्रतिनिधिसभा परिणाम"
      description="View election results for the Nepal Election 2082."
    >
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "15px",
            borderBottom: "2px solid #bf1e2e",
            paddingBottom: "10px",
          }}
        >
          प्रतिनिधिसभा परिणाम सारसंक्षेप
        </h3>
        <section className="section section-lead-table">
          <div className="elc-container">
            {/* <div className="heading-title-wrap flex flex-between flex-wrap flex-middle">
              <h3 className="heading-title">प्रतिनिधिसभा परिणाम</h3>
              <Link
                className="btn"
                to="/parties"
                target="_blank"
                rel="noopener noreferrer"
              >
                विस्तृत
              </Link>
            </div> */}
            <div className="dn-grid dn-grid-small">
              {parties.map((party) => (
                <div key={party.slug} className="col2 parties-card is-border">
                  <Link
                    to={`/party/${party.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={party.image} alt={party.name} />
                    <span className="title">{party.name}</span>
                  </Link>
                  <table>
                    <thead>
                      <tr>
                        <th>प्रत्यक्ष</th>
                        <th>समानुपातिक सिट</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Link
                            to={`/party/${party.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {party.direct}
                          </Link>
                        </td>
                        <td>{party.proportional}</td>
                      </tr>
                    </tbody>
                  </table>
                  {party.total > 0 && (
                    <span
                      style={{ backgroundColor: party.color }}
                      className="total-seat"
                    >
                      कुल सिट: <strong>{party.total}</strong>
                    </span>
                  )}
                  <p>
                    सामानुपातिक मत:
                    <span className="vote-samanupatik">{party.votes}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
