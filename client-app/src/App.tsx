import React, { useEffect, useState } from "react";
import "./App.css";
import { ResponsiveLine } from "@nivo/line";

const apiUrl = "https://4e8e72cb.ngrok.io";

const App = () => {
  const [fetchState, setFetchState] = useState("loading");
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    fetch(apiUrl + "/analyse")
      .then(resp => {
        return resp.json();
      })
      .then(res => {
        console.log(res);

        setData([
          {
            id: "Commits",
            color: "hsl(332, 70%, 50%)",
            data: res.commits
          }
        ]);
        setFetchState("done");
      });
  }, []);

  return (
    <div className="main-layout">
      {fetchState === "loading" ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveLine
          data={data}
          enableSlices="x"
          sliceTooltip={({ slice }) => {
            const point = slice.points[0].data as any;

            return (
              <div className="tooltip-card">
                <div className="tooltip-card-header">
                  <img
                    className="tooltip-card-pic"
                    width="50px"
                    height="50px"
                    src={point.profPic}
                  />
                  <p className="tooltip-card-title">{point.committer}</p>
                </div>
                <p className="tooltip-card-desc">{point.message}</p>
              </div>
            );
          }}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "transportation",
            legendOffset: 36,
            legendPosition: "middle"
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle"
          }}
          colors={{ scheme: "nivo" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      )}
    </div>
  );
};

export default App;
