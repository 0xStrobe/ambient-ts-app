import styles from './PageFooter.module.css';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { BsMedium } from 'react-icons/bs';
import { AiFillTwitterCircle } from 'react-icons/ai';
import ChatPanel from '../../../components/Chat/ChatPanel';
import { useState } from 'react';
// import { useLocation} from 'react-router-dom'

interface IFooterProps {
    lastBlockNumber: number;
}

const pageBlockSign = <div className={styles.page_block_sign}></div>;

export default function PageFooter(props: IFooterProps) {
    const [chatStatus, setChatStatus] = useState(false);
    // const  location = useLocation()
    return (
        <footer data-testid={'page-footer'} className={styles.footer}>
            <ChatPanel chatStatus={chatStatus} />
            <a onClick={() => setChatStatus(!chatStatus)}>aaa</a>
            <a href='#'>
                <AiFillTwitterCircle size={15} />
                {/* <span>Twitter</span> */}
            </a>
            <a href='#'>
                <FaDiscord size={15} />
                {/* <span>Discord</span> */}
            </a>
            <a href='#'>
                <BsMedium size={15} />
                {/* <span>Medium</span> */}
            </a>
            <a href='#'>
                <FaGithub size={15} />
                {/* <span>Github</span> */}
            </a>
            <a href='#'>
                <span>Docs</span>
            </a>
            {/* {location.pathname !== '/' && ( */}

            <a href='#'>
                {pageBlockSign}
                <span>{props.lastBlockNumber}</span>
            </a>
            {/* // )} */}
        </footer>
    );
}
