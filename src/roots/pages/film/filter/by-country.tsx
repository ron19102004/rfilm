import { GetFilmsType } from "@/apis/index.d";
import React from "react";
import { useParams } from "react-router-dom";
import FindByOption from "@/components/custom/find-by-option";
import { useSystemContext } from "@/context";

const FilterByCountry: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { countriesRecord } = useSystemContext();
  return (
    <FindByOption
      type={GetFilmsType.COUNTRY}
      value={slug?.toString() || ""}
      titleBar={countriesRecord[slug?.toString() || ""] || "Quốc gia"}
    />
  );
};

export default FilterByCountry;
