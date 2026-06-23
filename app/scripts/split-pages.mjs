import fs from "fs";

const src = fs.readFileSync("src/pages/Pages.jsx", "utf8");

const pages = [
  "Candidates",
  "HotSeats",
  "Manifesto",
  "ManifestoDetail",
  "Parties",
  "PopularCandidates",
  "Result",
  "Videos",
  "VoteDifference",
  "Province",
  "District",
  "Constituency",
  "Party",
  "Candidate",
  "Winner",
  "NotFound",
];

const sharedImports = `import { Link, useParams, useNavigate } from "react-router-dom";
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
`;

for (const name of pages) {
  const re = new RegExp(
    `export function ${name}\\(\\)[\\s\\S]*?(?=\\nexport function |$)`,
  );
  const match = src.match(re);
  if (!match) {
    console.error("Missing", name);
    continue;
  }

  let body = match[0]
    .replace(/^export function /, "export default function ")
    .replace(/SiteLayout/g, "MainLayout");

  const file = `src/pages/${name}.jsx`;
  fs.writeFileSync(file, `${sharedImports}\n${body.trim()}\n`);
  console.log("Wrote", file);
}
