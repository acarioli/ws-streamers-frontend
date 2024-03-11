import * as React from "react";

function HeaderComponent() {
  return (
    <div className="min-h-full">
      <nav className="navbar bg-dark text-white">
        <div className="m-3">
          <h1>Streamers Tracking</h1>
          <h2 style={{ fontSize: "0.8rem" , fontStyle:"italic"}}>Data from the last 30 days</h2>
        </div>
      </nav>
    </div>
  );
}

export default HeaderComponent;