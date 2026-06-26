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

export default function Videos() {
  return (
    <MainLayout
      title="निर्वाचन भिडियो"
      description="Watch election videos and voter coverage from the 2082 campaign."
    >
      <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#fff" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>रातोपाटी निर्वाचन विशेष</h3>
          <p style={{ color: "#666" }}>निर्वाचन परिणाम र विश्लेषण भिडियो अपडेट यहाँ उपलब्ध हुनेछ।</p>
        </div>
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#fff" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>उम्मेदवार अन्तर्वार्ता</h3>
          <p style={{ color: "#666" }}>विभिन्न निर्वाचन क्षेत्रका उम्मेदवारहरूसँग रातोपाटीको विशेष कुराकानी।</p>
        </div>
      </div>
    </MainLayout>
  );
}
