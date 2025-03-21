import React, { Fragment } from 'react';
import Image from 'next/image'
import styles from './TeamTable.module.css'

interface Team {
    id: string;
    name: string;
    nickname: string;
    display_name: string;
    conference: string;
    division: string;
    logo?: string
}

interface TeamTableProps {
    isHead: boolean;
    list: Team[];
}

const TeamTable: React.FC<TeamTableProps> = ({ isHead, list }) => {
    return (
        < >
            {isHead ? (
                <div className={`${styles.tablerow} ${styles.header}`}>
                    <div>NAME</div>
                    <div>NICKNAME</div>
                    <div>DISPLAY NAME</div>
                    <div>CONFERENCE</div>
                    <div>DIVISION</div>
                </div>
            ) : (
                list.map((item) => (
                    <div className={styles.tablerow} key={item.id}>
                        <div className={styles.logo}>
                            {item.logo ? <Image
                                src={item.logo}
                                width={30}
                                height={30}
                                alt="Picture of the author"
                            /> : null}
                            {item.name}</div>
                        <div><span className={styles.mobElement}>NICKNAME :</span> {item.nickname}</div>
                        <div><span className={styles.mobElement}>DISPLAY NAME :</span> {item.display_name}</div>
                        <div><span className={styles.mobElement}>CONFERENCE : </span> {item.conference}</div>
                        <div><span className={styles.mobElement}>DIVISION :</span> {item.division}</div>
                    </div>
                ))
            )}
        </>
    );
};

export default TeamTable;