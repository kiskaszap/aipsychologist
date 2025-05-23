import React from "react";
import Layout from "../../Components/Dashboard/Layout";
import Chat from "../../Components/Chat/Chat";

function Dashboard() {
  return (
    <Layout>
      <div style={{ height: "calc(100vh - 6rem)" }} className="mt-1">
        <Chat />
      </div>
    </Layout>
  );
}

export default Dashboard;
