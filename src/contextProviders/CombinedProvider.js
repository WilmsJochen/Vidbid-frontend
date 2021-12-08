import {Top5VidsProvider} from "./Top5VidsProvider"
import {AllVidsProvider} from "./AllVidsProvider"
import {FavoriteVidsProvider} from "./FavoriteVidsProvider"
import {OwnedVidsProvider} from "./OwnedVidsProvider";


export default function CombinedProvider({ children }) {
    return (
        <FavoriteVidsProvider>
            <OwnedVidsProvider>
                {children}
            </OwnedVidsProvider>
        </FavoriteVidsProvider>
    );
}