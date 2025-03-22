import React from "react";
import Image from "next/image";
import styles from "./TeamTable.module.css";

interface Team {
  id: string;
  name: string;
  nickname: string;
  display_name: string;
  conference: string;
  division: string;
  logo?: string;
}

interface TeamTableProps {
  isHead: boolean;
  list: Team[];
}

const TeamTable: React.FC<TeamTableProps> = ({ isHead, list }) => {
  // Define the table headers
  const headers = [
    "NAME",
    "NICKNAME",
    "DISPLAY NAME",
    "CONFERENCE",
    "DIVISION",
  ];

  return (
    <>
      {isHead ? (
        // Render the table header
        <div className={`${styles.tablerow} ${styles.header}`}>
          {headers.map((header, index) => (
            <div key={index}>{header}</div>
          ))}
        </div>
      ) : (
        // Render the table rows
        list.map((item) => (
          <div className={styles.tablerow} key={item.id}>
            <div className={styles.logo}>
              {item.logo && (
                <Image
                  src={item.logo}
                  width={30}
                  height={30}
                  alt={`${item.name} logo`}
                />
              )}
              {item.name}
            </div>
            <div>
              <span className={styles.mobElement}>NICKNAME :</span>{" "}
              {item.nickname}
            </div>
            <div>
              <span className={styles.mobElement}>DISPLAY NAME :</span>{" "}
              {item.display_name}
            </div>
            <div>
              <span className={styles.mobElement}>CONFERENCE :</span>{" "}
              {item.conference}
            </div>
            <div>
              <span className={styles.mobElement}>DIVISION :</span>{" "}
              {item.division}
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default TeamTable;
