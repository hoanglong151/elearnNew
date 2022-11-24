import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonLessonHistoryCard = () => {
    return (
      <section>
        <ul className="list pd-l-0-f">
          {Array(3)
            .fill()
            .map((item, index) => (
              <li className="card mg-5 pd-5" key={index}>
                <div>
                <Skeleton height={20} width={`40%`} />
                </div>
                <div>
                <Skeleton height={20} width={`100%`} />
                <Skeleton height={20} width={`100%`} />
                </div>
              </li>
            ))}
        </ul>
      </section>
    );
  };

  export default SkeletonLessonHistoryCard;