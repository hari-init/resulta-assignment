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

// Dynamically import components for code splitting
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

    const socket = socketRef.current;

    // Handle connection events
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    // Handle data updates
    socket.on("data_update", (data: TeamsData) => {
      console.log("Received data update:", data);
      setTeamsData(data);
      setIsUpdated(true);
    });

    // Cleanup on unmount
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
    if (!teamsData || !teamsData[selectedLeague]) return [];
    return Object.keys((teamsData[selectedLeague] as Team[])[0]).filter(
      (key) => key !== "id"
    );
  }, [teamsData, selectedLeague]);

  // Memoized teams list based on selected league and sort option
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

  // Clear the update indicator after 800ms
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
