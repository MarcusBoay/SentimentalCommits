import React, { useState } from "react";
import "./App.css";
import { ResponsiveLine } from "@nivo/line";
import { Input, Label, Spinner, Button, FormGroup } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

const apiUrl = "https://4e8e72cb.ngrok.io";

const App = () => {
  const [fetchState, setFetchState] = useState("init");
  const [data, setData] = useState<any>([]);
  const [inputUrl, setInputUrl] = useState<string>("");

  const getCommits = () => {
    setFetchState("loading");

    fetch(apiUrl + "/analyse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: inputUrl })
    })
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
  };

  return (
    <div className="main-layout">
      <div>
        <FormGroup>
          <Label>
            GitHub Repository URL (ex:
            https://github.com/MarcusBoay/marcusboay.dev)
          </Label>
          <Input
            type="text"
            onChange={event => {
              setInputUrl(event.target.value);
            }}
          />
          <Button
            color="primary"
            onClick={() => {
              getCommits();
            }}
          >
            Analyse!
          </Button>
        </FormGroup>
      </div>
      {fetchState === "loading" ? (
        <Spinner size="lg" color="primary" type="grow" />
      ) : (
        fetchState === "done" && (
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
        )
      )}
    </div>
  );
};

export default App;
