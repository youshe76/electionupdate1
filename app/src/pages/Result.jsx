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

export default function Result() {
  return (
    <MainLayout
      title="परिणाम"
      description="View election results for the Nepal Election 2082."
    >
      <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", borderBottom: "2px solid #bf1e2e", paddingBottom: "10px" }}>
          प्रतिनिधिसभा परिणाम सारसंक्षेप
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>राजनीतिक दल</th>
              <th style={{ padding: "10px", textAlign: "center" }}>प्रत्यक्ष सिट</th>
              <th style={{ padding: "10px", textAlign: "center" }}>समानुपातिक सिट</th>
              <th style={{ padding: "10px", textAlign: "right" }}>कुल सिट</th>
            </tr>
          </thead>
          <tbody>
            {partyData.filter(p => p.wins > 0).map((party) => {
              // Map some mock proportional seats based on popular status
              let proportional = 0;
              if (party.slug === "rastriya-swatantra-party") proportional = 57;
              else if (party.slug === "nepali-congress") proportional = 20;
              else if (party.slug === "cpn-uml") proportional = 16;
              else if (party.slug === "nepali-communist-party") proportional = 9;
              else if (party.slug === "shram-samskriti-party") proportional = 4;
              else if (party.slug === "rastriya-prajatantra-party") proportional = 4;
              
              return (
                <tr key={party.slug} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>
                    <Link to={`/party/${party.slug}`} style={{ color: "#0066cc", textDecoration: "none", fontWeight: "bold" }} target="_blank" rel="noopener noreferrer">
                      {party.name}
                    </Link>
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{party.wins}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{proportional}</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>{party.wins + proportional}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
