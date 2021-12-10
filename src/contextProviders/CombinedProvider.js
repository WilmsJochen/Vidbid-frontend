import {Top5VidsProvider} from "./Top5VidsProvider"
import {AllVidsProvider} from "./AllVidsProvider"
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