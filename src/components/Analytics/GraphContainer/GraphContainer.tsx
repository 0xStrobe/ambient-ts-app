import styles from './GraphContainer.module.css';
import chartImage from '../../../assets/images/Temporary/Analytics/chart.svg';
import { motion } from 'framer-motion';
import { useProtocolData } from '../../../state/protocol/hooks';
import { useEffect, useState } from 'react';
import { formatDollarAmount } from '../../../utils/numbers';

export default function GraphContainer() {
    const [protocolData] = useProtocolData();
    const [volumeHover, setVolumeHover] = useState<number | undefined>();
    const [liquidityHover, setLiquidityHover] = useState<number | undefined>();

    useEffect(() => {
        if (volumeHover === undefined && protocolData) {
            setVolumeHover(protocolData.volumeUSD);
        }
    }, [protocolData, volumeHover]);
    useEffect(() => {
        if (liquidityHover === undefined && protocolData) {
            setLiquidityHover(protocolData.tvlUSD);
        }
    }, [liquidityHover, protocolData]);

    const timeFrame = (
        <div className={styles.time_frame_container}>
            <div className={styles.title}>Ambient Analytics</div>
            <div className={styles.right_side}>
                <span>Timeframe</span>
                <button>1m</button>
                <button>5m</button>
                <button>15m</button>
                <button>1h</button>
                <button>4h</button>
                <button>1d</button>
            </div>
        </div>
    );

    const graphData = (
        <div className={styles.graph_data}>
            <div className={styles.graph_container}>
                <div className={styles.title}>Total TVL</div>
                <div className={styles.image_container}>
                    <motion.img
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        exit={{ x: innerWidth, transition: { duration: 5 } }}
                        src={chartImage}
                        alt='chart'
                    />
                </div>
            </div>
            <div className={styles.graph_container}>
                <div className={styles.title}>Total TVL</div>
                <div className={styles.image_container}>
                    <motion.img
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        exit={{ x: innerWidth, transition: { duration: 5 } }}
                        src={chartImage}
                        alt='chart'
                    />
                </div>
            </div>
        </div>
    );

    const analyticsInfo = (
        <div className={styles.info_container}>
            <div className={styles.info_content}>
                <div className={styles.info_title}>Total TVL</div>
                <div className={styles.info_value}>
                    {formatDollarAmount(liquidityHover, 2, true)}{' '}
                </div>
            </div>

            <div className={styles.info_content}>
                <div className={styles.info_title}>24h Volume</div>
                <div className={styles.info_value}>{formatDollarAmount(volumeHover, 2)}</div>
            </div>

            <div className={styles.info_content}>
                <div className={styles.info_title}>24h Fees</div>
                <div className={styles.info_value}>{formatDollarAmount(protocolData?.feesUSD)}</div>
            </div>
        </div>
    );
    return (
        <div className={styles.GraphContainers}>
            {timeFrame}
            {graphData}
            {analyticsInfo}
        </div>
    );
}