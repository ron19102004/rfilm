import { GetFilmsType } from "@/apis/index.d";
import React from "react";
import { useParams } from "react-router-dom";
import FindByOption from "@/components/custom/find-by-option";
import { useSystemContext } from "@/context";
const FilterByGenre: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { genresRecord } = useSystemContext();
  return (
    <FindByOption
      type={GetFilmsType.GENRE}
      value={slug?.toString() || ""}
      titleBar={genresRecord[slug?.toString() || ""] || "Thể loại"}
    />
  );
};

export default FilterByGenre;
