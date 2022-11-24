import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonStudentForm = () => {
    return (
      <section>
        <div>
           <div className="w-100 mb-1">
               <Skeleton height={30} style={{width:"calc(50% - 5px)", marginRight:"10px"}}/>
               <Skeleton height={30} style={{width:"calc(50% - 5px)"}}/>
           </div>
           <div className="w-100 mb-1">
               <Skeleton height={30} style={{width:"calc(50% - 5px)", marginRight:"10px"}}/>
               <Skeleton height={30} style={{width:"calc(50% - 5px)"}}/>
           </div>
           <div className="w-100 mb-1">
               <Skeleton height={30} style={{width:"calc(50% - 5px)", marginRight:"10px"}}/>
               <Skeleton height={30} style={{width:"calc(50% - 5px)"}}/>
           </div>
           <div className="w-100 mb-1">
               <Skeleton height={30} style={{width:"calc(50% - 5px)", marginRight:"10px"}}/>
               <Skeleton height={30} style={{width:"calc(50% - 5px)"}}/>
           </div>
           <div className="w-100 mb-1">
               <Skeleton width={`100%`} height={30}/>
           </div>
           <div className="w-100 mb-1">
               <Skeleton width={`100%`} height={30}/>
           </div>
           <div className="w-100 mb-1">
               <Skeleton width={`100%`} height={30}/>
           </div>
           <div className="w-100 mb-1">
               <Skeleton width={`100%`} height={60}/>
           </div>
        </div>
      </section>
    );
  };

  export default SkeletonStudentForm;