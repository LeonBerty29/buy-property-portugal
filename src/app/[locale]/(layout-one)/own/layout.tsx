import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="lg:container w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-14 py-10 pt-24">
      {children}
    </div>
  );
};

export default layout;
