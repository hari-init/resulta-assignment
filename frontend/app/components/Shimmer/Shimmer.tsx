import React from "react";
import styles from "./Shimmer.module.css";

interface ShimmerProps {
  count: number;
}

const Shimmer: React.FC<ShimmerProps> = ({ count = 1 }) => {
  console.log("rendering Shimmer component");
  return (
    <>
      <div className={styles.isMob}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={styles.shimmerWrapper}>
            <div className={`${styles.shimmer} ${styles.shimmerHeader}`} />
            <div className={`${styles.shimmer} ${styles.shimmerHeader}`} />
            <div
              className={`${styles.shimmer} ${styles.shimmerParagraph}`}
              style={{ width: "90%" }}
            />
            <div
              className={`${styles.shimmer} ${styles.shimmerParagraph}`}
              style={{ width: "90%" }}
            />
            <div
              className={`${styles.shimmer} ${styles.shimmerParagraph}`}
              style={{ width: "80%" }}
            />
            <div
              className={`${styles.shimmer} ${styles.shimmerParagraph}`}
              style={{ width: "70%" }}
            />
          </div>
        ))}
      </div>
      <div className={styles.isTable}>
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            data-testid="shimmer-wrapper-desktop"
            className={`${styles.shimmerWrapper} ${styles.shimmerTable}`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i}>
                <div
                  className={`${styles.shimmer} ${styles.shimmerParagraph}`}
                  style={{ width: "90%" }}
                />
                <div
                  className={`${styles.shimmer} ${styles.shimmerParagraph}`}
                  style={{ width: "80%" }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Shimmer;
