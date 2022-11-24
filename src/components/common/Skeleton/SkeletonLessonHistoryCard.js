import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonLessonHistoryCard = ({ column }) => {
  return (
    <tr>
      {
        Array(parseInt(column)).fill().map((item, index) => <th key={index}><Skeleton height={40} /></th>)
      }
  </tr>
  );
};

export default SkeletonLessonHistoryCard;