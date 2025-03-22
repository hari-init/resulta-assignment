"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Select from "./components/Select/Select";

/**
 * This is the Main component of the application where it receives the Data from
 * the Backend through Socket IO, and updates the view with the data
 *
 * 1. Shimmer component for fallback UI.
 * 2. TeamTable component for showing team data.
 * 3. Select Component for both league and sortby dropdowns.
 *
 * Overall all the reference are cached with useCallback and useMemo hook inside
 * handled dynamic loading
 */

// Dynamically import components for code splitting (as of now in this SPA it will not bring that much difference)
const TeamTable = dynamic(() => import("./components/TeamTable/TeamTable"));
const Shimmer = dynamic(() => import("./components/Shimmer/Shimmer"));

interface Team {
  id: string;
  name: string;
  nickname: string;
  display_name: string;
  conference: string;
  division: string;
}

interface TeamsData {
  last_updated: string;
  [league: string]: Team[] | string;
}

export default function Page() {
  const [teamsData, setTeamsData] = useState<TeamsData | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [selectedSortBy, setSelectedSortBy] = useState<string>("name");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("https://backend-6pbu.onrender.com");
    }

    //Assigned in Ref to avoid frequent state update
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    socket.on("data_update", (data: TeamsData) => {
      console.log("Received data update:", data);
      setTeamsData((prev) => {
        if (!prev) {
          return data;
        }
        Object.keys(data).forEach((key) => {
          if (key === "last_updated") {
            prev.last_updated = data.last_updated;
          } else {
            prev[key] = data[key]; // To avoid the reference change while state change
          }
        });

        return prev;
      });
      setIsUpdated(true);
    });

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []);

  // Memoized leagues and sort options
  const leagues = useMemo(() => {
    if (!teamsData) return [];
    return Object.keys(teamsData).filter((key) => key !== "last_updated");
  }, [teamsData]);

  const sortBys = useMemo(() => {
    if (!teamsData) return [];
    return Object.keys(Object.values(teamsData)[1][1]).filter(
      (key) => key !== "id"
    );
  }, [teamsData]);

  /** Memoized teams list based on selected league and sort option
   * This can be handled on Backend or Server (Next.js) but for this
   * Single page i handled here
   */

  const teams = useMemo(() => {
    if (!teamsData || !teamsData[selectedLeague]) return [];
    const leagueData = teamsData[selectedLeague] as Team[];
    return [...leagueData].sort((a, b) => {
      const aValue = a[selectedSortBy as keyof Team];
      const bValue = b[selectedSortBy as keyof Team];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue);
      }
      return 0;
    });
  }, [teamsData, selectedLeague, selectedSortBy]);

  // Handle league change
  const handleLeagueChange = useCallback((league: string) => {
    setSelectedLeague(league);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort: string) => {
    setSelectedSortBy(sort);
  }, []);

  // Set initial selectedLeague when teamsData is updated
  useEffect(() => {
    if (teamsData && !selectedLeague && leagues.length > 0) {
      setSelectedLeague(leagues[0]);
    }
  }, [teamsData, selectedLeague, leagues]);

  /** This is used to show and hide the loading indicator on top the
   *  table container
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isUpdated) {
      timer = setTimeout(() => setIsUpdated(false), 800);
    }
    return () => clearTimeout(timer);
  }, [isUpdated]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.controlsCenter}>
        <div className={styles.controls}>
          <Select
            selectedOption={selectedLeague}
            handleChange={handleLeagueChange}
            options={leagues}
            label="League"
          />
          <Select
            selectedOption={selectedSortBy}
            handleChange={handleSortChange}
            options={sortBys}
            label="Sort by"
          />
        </div>
        <div className={styles.status}>
          <div className={styles.socket}>
            SocketIO:{" "}
            <span
              style={{
                backgroundColor: isConnected ? "#4caf50b3" : "#e91e1e8a",
              }}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className={styles.statusDivider}>|</div>
          Last Updated:{" "}
          {teamsData?.last_updated
            ? new Date(teamsData.last_updated).toLocaleString().split(",")[1]
            : "N/A"}
        </div>
      </div>
      <div className={styles.container}>
        {isUpdated && <span className={styles.loader}></span>}
        {teamsData ? (
          <>
            {/* One for rendering header with static array and 
            another for dynamic list of data */}
            <TeamTable isHead={true} list={teams} />
            <TeamTable isHead={false} list={teams} />
          </>
        ) : (
          <Shimmer count={5} />
        )}
      </div>
    </div>
  );
}
