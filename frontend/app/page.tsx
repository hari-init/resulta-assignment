"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './page.module.css';
import TeamTable from './components/TeamTable/TeamTable';
import Select from './components/Select/Select';
import Shimmer from './components/Shimmer/Shimmer';

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

export default function Home() {
  const [teamsData, setTeamsData] = useState<TeamsData | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedSortBy, setSelectedSortBy] = useState<string>('name');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  // Memoized leagues and sort options
  const leagues = useMemo(() => {
    if (!teamsData) return [];
    return Object.keys(teamsData).filter((key) => key !== 'last_updated');
  }, [teamsData]);

  const sortBys = useMemo(() => {
    if (!teamsData || !teamsData[selectedLeague]) return [];
    return Object.keys((teamsData[selectedLeague] as Team[])[0]).filter(
      (key) => key !== 'id'
    );
  }, [teamsData, selectedLeague]);

  // Memoized teams list based on selected league and sort option
  const teams = useMemo(() => {
    if (!teamsData || !teamsData[selectedLeague]) return [];
    const leagueData = teamsData[selectedLeague] as Team[];
    return [...leagueData].sort((a, b) => {
      const aValue = a[selectedSortBy as keyof Team];
      const bValue = b[selectedSortBy as keyof Team];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
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

  // Socket.IO connection and data update handling
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('https://backend-6pbu.onrender.com');
    }

    const socket = socketRef.current;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    const handleDataUpdate = (data: TeamsData) => {
      setIsUpdated(true);
      setTeamsData(data);
      setLastUpdated(new Date(data.last_updated).toLocaleString());
    };

    socket.on('data_update', handleDataUpdate);

    return () => {
      socket.off('data_update', handleDataUpdate);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

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
            SocketIO:{' '}
            <span
              style={{
                backgroundColor: isConnected ? '#4caf50b3' : '#e91e1e8a',
              }}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className={styles.statusDivider}>|</div>
          Last Updated: {lastUpdated.split(',')[1]}
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