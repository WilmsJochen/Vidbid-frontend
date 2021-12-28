import {FavoriteVidsProvider} from "./FavoriteVidsProvider"
import {OwnedVidsProvider} from "./OwnedVidsProvider";
import {WalletProvider} from "./WalletProvider";


export default function CombinedProvider({ children }) {
    return (
        <FavoriteVidsProvider>
            <WalletProvider>
                <OwnedVidsProvider>
                    {children}
                </OwnedVidsProvider>
            </WalletProvider>
        </FavoriteVidsProvider>
    );
}