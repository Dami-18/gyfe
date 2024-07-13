import React from "react";
import { useAppContext } from "../AppContext/AppContext";
type props = {
    openModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const Footer: React.FC<props> = ({ openModal }) => {
    const { logout, user } = useAppContext();

    return (
        <div>
            <div className="help">
                <button className="help-button" onClick={() => openModal(true)}>
                    Help 💡
                </button>
                {user.ssoToken && (
                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                )}
            </div>
            <footer>
                <p>
                    Maintained by{" "}
                    <strong>
                        <a target="_blank" href="https://metakgp.github.io/">
                            <span className="metakgp">MetaKGP</span>
                        </a>
                    </strong>{" "}
                    with<strong> ❤️ </strong>at{" "}
                    <a target="_blank" href="https://github.com/metakgp/gyfe">
                        <strong>GitHub</strong>
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Footer;
