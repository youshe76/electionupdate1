import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import candidatesData from "../../public/data/candidates.json";
import provinceData from "../../public/data/province.json";
import districtData from "../../public/data/district.json";
import constituencyData from "../../public/data/constituency.json";
import partyData from "../../public/data/party.json";
import manifestoData from "../../public/data/manifesto.json";
import hotSeatsData from "../../public/data/hot-seats.json";
import voteDifferenceData from "../../public/data/vote-difference.json";
import { MainLayout } from "../layouts/MainLayout";
import ConstituencyElectionCard from "../components/election/ConstituencyElectionCard";
import { toNepaliNumber } from "../utils";
import { districtsForProvince, provinceRouteSlug, cleanRouteSlug } from "../utils/geoUtils";
import { fixImageUrl } from "../utils/imageUtils";
import { getManifestoImage } from "../app/config/constants";

export default function ManifestoDetail() {
  const { id } = useParams();
  const cleanId = id?.replace(/\.html$/i, "");
  const manifesto = manifestoData.find((m) => m.id === cleanId);

  if (!manifesto) {
    return (
      <MainLayout title="घोषणा पत्र फेला परेन">
        <p>दुःख है, यो घोषणा पत्र फेला परेन।</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={manifesto.party_name}>
      <div className="pdf-viewer" style={{ marginTop: "20px" }}>
        <iframe
          src={manifesto.pdf_url}
          style={{ width: "100%", height: "920px", border: "none" }}
          title={manifesto.party_name}
        ></iframe>
      </div>
    </MainLayout>
  );
}
