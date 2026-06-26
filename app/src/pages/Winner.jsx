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

export default function Winner() {
  const { pageId } = useParams();
  const winnerId = pageId?.replace(/\.html$/i, "") || "unknown";

  return (
    <MainLayout
      title={`Winner ${winnerId}`}
      description={`Winner result content for ID ${winnerId}.`}
    >
      <p>
        This winner page is rendered by React for result identifier:{" "}
        <strong>{winnerId}</strong>.
      </p>
    </MainLayout>
  );
}
